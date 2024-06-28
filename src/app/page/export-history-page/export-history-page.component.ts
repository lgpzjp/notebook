import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { GridOptions, SelectionChangedEvent } from 'ag-grid';
import { defer as _defer, forEach as _forEach, isEmpty as _isEmpty } from 'lodash';

import { DateTimeUtils } from '@blcloud/bl-common';
import { ContractConst } from '@blcloud/bl-datamodel/const/contract';
import { ProductCode } from "@blcloud/bl-datamodel/enum/common/product-code";
import { IGenericDataExportInfo } from '@blcloud/bl-datamodel';
import { BlListResponseBody } from '@blcloud/bl-ng-common';
import {
  AbstractContainer,
  BlReferenceGridComponent,
  BlLoadingService,
  BlDialogService,
  BlModalService,
} from '@blcloud/bl-ng-ui-component';
import {
  ScreenService, FunctionRole, FnKey, WithAllCompanyDiv, AutoUpdateComponent, AutoUpdateIntervalUnit, LoginResourceService
} from '@blcloud/bl-ng-share-module';

import { ExportDateRangeComponent } from '../../shared/input/date-range/export-date-range.component';
import { ExportHistoryPageService } from './export-history-page.service';
import { ISearchCondition, ISearchResult } from './export-history-page.interface';
import {
  PAGE_ID, PAGE_TITLE, Message, PageSizePatterns, SEARCH_MAX_COUNT, DefaultColumns, AUTO_UPDATE_STORAGE_KEY, AutoUpdateDefaultSetting
} from './export-history-page.const'
import { ExportConditionModalComponent } from './modal/export-condition/export-condition-modal.component';
import { ExportInfoTabDiv } from '@blcloud/bl-datamodel/enum/output/export-info-tab-div';

@Component({
  templateUrl: './export-history-page.component.html',
  styleUrls: ['./export-history-page.component.scss'],
})
export class ExportHistoryPageComponent extends AbstractContainer implements OnInit {
  /** 画面ID */
  readonly PAGE_ID = PAGE_ID;

  /** タイトル */
  readonly PAGE_TITLE = PAGE_TITLE;

  /** グリッドサイズパターン */
  readonly PageSizePatterns = PageSizePatterns;

  /** 全社設定取得区分の定義 */
  readonly WithAllCompanyDiv = WithAllCompanyDiv;

  /** 自動更新ストレージキー */
  readonly AUTO_UPDATE_STORAGE_KEY = AUTO_UPDATE_STORAGE_KEY;

  /** 自動更新デフォルト設定 */
  readonly AutoUpdateDefaultSetting = AutoUpdateDefaultSetting;

  /** 自動更新間隔単位 */
  readonly AutoUpdateIntervalUnit = AutoUpdateIntervalUnit;

  /** 自動更新日時 */
  _latestUpdateDateTime: string;

  /** 自動更新一時停止フラグ */
  _autoUpdatePause = false;

  /** 検索条件 */
  _condition: ISearchCondition;

  /** グリッドオプション */
  _gridOptions: GridOptions = {
    rowData: [],
    enableColResize: true,
    enableSorting: true,
    onSelectionChanged: this.onChangeSelection.bind(this),
  };

  /** グリッド上に表示するメッセージ */
  _gridMessage = '';

  /** 総件数 */
  _totalCount = 0;

  _isGridReady = false;

  /** ログインユーザー所属組織コード */
  private loginUserOrganizationCode: string;

  /** 現在のページインデックス */
  private currentPageIndex = 1;

  /** 現在のページサイズ */
  private currentPageSize = 50;

  /** 対象期間インプット */
  @ViewChild('dateRangeInput') dateRangeInput: ExportDateRangeComponent;

  /** 検索結果グリッド */
  @ViewChild('refGrid') refGrid: BlReferenceGridComponent;

  /** 自動更新 */
  @ViewChild('autoUpdate') autoUpdate: AutoUpdateComponent;

  /** データ表示フラグ */
  get isShowData() {
    return this._totalCount > 0;
  }

  constructor(
    private router: Router,
    private screenService: ScreenService,
    private loadingService: BlLoadingService,
    private dialogService: BlDialogService,
    private modalService: BlModalService,
    private pageService: ExportHistoryPageService,
    private loginResourceService: LoginResourceService,
  ) {
    super();
  }

  ngOnInit() {
    this.screenService.setPageId(PAGE_ID);
    this.screenService.setTitle(PAGE_TITLE);

    // ファンクション初期化
    this.initFunction();
  }

  /**
   * グリッド準備完了イベントハンドラ
   */
  onReadyGrid() {
    // 列設定
    this.refGrid.setColumnDefs(DefaultColumns);
    this._gridOptions.api.sizeColumnsToFit();
    this.refGrid.enableSort();

    this._isGridReady = true;

    // ログインユーザー所属組織コードを取得
    this.pageService.getLoginUserOrganizationCode().subscribe(
      organizationCode => {
        this.loginUserOrganizationCode = organizationCode;

        _defer(() => {
          // 検索条件を初期化
          this.initCondition();

          // 初期検索
          this.search();
        });
      }
    );
  }

  /**
   * 自動更新イベントハンドラ
   */
  onAutoUpdate() {
    if (!this._isGridReady) {
      return;
    }
    this.search();
  }

  /**
   * 組織変更イベントハンドラ
   * @param organizationCode 組織コード
   */
  onChangeOrganization(organizationCode: string) {
    this._condition.organizationCode = organizationCode;

    this.currentPageIndex = 1;
    this.search();
  }

  /**
   * 対象期間変更イベントハンドラ
   * @param value 日付範囲
   */
  onChangeExportDateRange(value: { start: string, end: string }) {
    this._condition.exportDateStart = value.start;
    this._condition.exportDateEnd = value.end;

    this.currentPageIndex = 1;
    this.search();
  }

  /**
   * 検索イベントハンドラ
   */
  onSearch() {
    this.currentPageIndex = 1;
    this.search();
  }

  /**
   * 前ページイベントハンドラ
   */
  onPrevPage() {
    this.currentPageIndex--;
    this.search();
  }

  /**
   * 次ページイベントハンドラ
   */
  onNextPage() {
    this.currentPageIndex++;
    this.search();
  }

  /**
   * ページサイズ変更イベントハンドラ
   */
  onChangePageSize(size: number) {
    this.currentPageSize = size;

    // サイズが変更されたので先頭ページで検索
    if (this.isShowData) {
      this.currentPageIndex = 1;
      this.search();
    }
  }

  /**
   * 選択行変更イベントハンドラ
   */
  onChangeSelection(_event: SelectionChangedEvent) {
  }

  /**
   * ファンクション初期化処理
   */
  private initFunction() {
    this.loginResourceService.isAvailableService(ContractConst.SERVICEID_OPT_CMN_GENERIC_DATA_OUTPUT).subscribe(
      isAvailable => {
        const toggle1 = [];

        if (isAvailable) {
          toggle1.push(FnKey.Toggle1Fn4.setLabel('データ出力'));
        }

        this.screenService.setFunctions(
          [
            toggle1
          ]
        ).subscribe(functionRef => {
          switch (functionRef.role) {
            case FunctionRole.Toggle1Fn4:
              this.router.navigate(['request'], );
              break;
          }
          functionRef.end(true);
        });

        this.screenService.disableFnKey(FunctionRole.Next);
      }
    );
  }

  /**
   * 検索条件を初期化
   */
  private initCondition() {
    this._condition = {};

    // ログインユーザー所属組織を設定
    this._condition.organizationCode = this.loginUserOrganizationCode;

    // 対象期間を本日に設定
    this._condition.exportDateStart = this._condition.exportDateEnd = DateTimeUtils.formatIso(DateTimeUtils.today());
  }

  /**
   * 検索処理
   */
  private search() {
    if (!this.validateCondition()) {
      return;
    }

    this.loadingService.show();

    this.pageService.search(this._condition, this.currentPageSize, this.currentPageIndex).pipe(
      finalize(() => this.loadingService.hide())
    ).subscribe(
      response => {
        // 検索結果が最大件数オーバー
        if (response.totalCount > SEARCH_MAX_COUNT) {
          this.dialogService.info(Message.OverSearchCount).subscribe(
            dialogRef => dialogRef.hide()
          );
          return;
        }

        // 自動更新部品をリセット
        this._latestUpdateDateTime = DateTimeUtils.formatIso(DateTimeUtils.now());
        this.autoUpdate.resetInterval();

        // 検索結果を表示
        this.setResult(response);
      }
    );
  }

  /**
   * 検索条件を検証します
   * @returns 検証結果
   */
  private validateCondition() {
    if (
      !this._condition.exportDateStart || this._condition.exportDateStart === DateTimeUtils.initial.iso8601.date ||
      !this._condition.exportDateEnd || this._condition.exportDateEnd === DateTimeUtils.initial.iso8601.date
    ) {
      this.showValidateDialog('対象期間を入力してください。', this.dateRangeInput);
      return false;
    }

    if (this._condition.exportDateStart > this._condition.exportDateEnd) {
      this.showValidateDialog('対象期間の範囲指定に誤りがあります。', this.dateRangeInput);
      return false;
    }

    return true;
  }

  /**
   * 検証によるメッセージダイアログを表示します。
   * @param message メッセージ
   */
  private showValidateDialog(message: string, focusTarget?: any) {
    this.dialogService.info(message).subscribe(
      dialogRef => dialogRef.hide(focusTarget)
    );
  }

  /**
   * 検索結果をセットします。
   * @param result 検索結果
   */
  private setResult(result: BlListResponseBody<ISearchResult>) {
    _forEach(result.searchResultList, data => {
      data.downloadButtonInfo.onClick = this.downloadFile.bind(this, data);
      data.conditionButtonInfo.onClick = this.showExportCondition.bind(this, data);
      if (!_isEmpty(data.glassExportSearchInfo) && !_isEmpty(data.glassExportSearchInfo.exportPatternCodeList)) {
        const exportInfoTab = String(data.glassExportSearchInfo.exportPatternCodeList[0]);
        data.conditionButtonInfo.disabled = (exportInfoTab === ExportInfoTabDiv.GlassSettingInfo) ? true : false;
        data.downloadButtonInfo.disabled = data.totalCount === 0;
      }
    });

    this.refGrid.setData(result.searchResultList);
    this._totalCount = result.totalCount;

    if (this._totalCount === 0) {
      // 該当なしメッセージを表示
      this._gridMessage = Message.NotFound;

      _defer(() => {
        this.refGrid.showNoRows();
        this.dateRangeInput.focus();
      });
    } else {
      if (this.currentPageIndex === 1) {
        this.refGrid.gotoFirstPage();
      }

      // オーバーレイ非表示
      _defer(() => {
        this.refGrid.hideOverlay();
        this.refGrid.focus();
      });
    }
  }

  /**
   * ファイルをダウンロードします。
   * @param data 汎用データ出力情報
   */
  private downloadFile(data: IGenericDataExportInfo) {
    // 自動更新停止
    this._autoUpdatePause = true;

    // 署名付きダウンロードURLを取得
    this.pageService.getSignedDownloadUrl(data).pipe(
      finalize(() => {
        // 自動更新再開
        this._autoUpdatePause = false;
      })
    ).subscribe(
      url => {
        if (url) {
          // ダウンロード用のaタグ作成
          let downloadBtn = document.createElement('a');
          downloadBtn.id = 'downloadlinkTemp';
          // aタグ非表示
          downloadBtn.style.display = 'none';
          // bodyの最後にaタグ追加
          document.querySelector('body').appendChild(downloadBtn);
          // ダウンロード時のファイル名、パスをセット
          downloadBtn.setAttribute("download", data.uploadFileName);
          downloadBtn.setAttribute("href", url);

          // ダウンロード実行
          downloadBtn.click();

          // 作成したaタグを削除
          downloadBtn.remove();

          // 操作履歴ログを登録
          if (data.productCode === ProductCode.Partsman) {
            this.pageService.postDownloadOperationHistoryLogPm(data.uploadFileName);
          } else {
            this.pageService.postDownloadOperationHistoryLog(data.uploadFileName);
          }
        }
      }
    );
  }

  /**
   * 抽出条件を表示します。
   * @param data 汎用データ出力情報
   */
  private showExportCondition(data: IGenericDataExportInfo) {
    // 自動更新停止
    this._autoUpdatePause = true;

    this.modalService.show(ExportConditionModalComponent, { data }).subscribe(
      modalRef => {
        modalRef.hide();

        // 自動更新再開
        this._autoUpdatePause = false;
      }
    );
  }

}
