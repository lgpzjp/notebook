import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { AbstractContainer, BlDialogService, BlLoadingService, BlModalService } from '@blcloud/bl-ng-ui-component';
import { BlAppContext } from '@blcloud/bl-ng-common';
import { LoginResourceService } from '@blcloud/bl-ng-share-module';
import { ExportInfoDiv, ExportInfoDivMap } from '@blcloud/bl-datamodel/enum/output/export-info-div';
import { ExportInfoTabDiv } from '@blcloud/bl-datamodel/enum/output/export-info-tab-div';
import { IExportPatternInfo } from '@blcloud/bl-datamodel';
import { RoleConst } from '@blcloud/bl-datamodel/const/role';
import { ExportPageService } from '../../page/export-page/export-page.service';
import { IDownloadContent } from '../../page/export-page/export-page.define';
import { DownloadModalComponent } from '../../shared/modal/download-modal/download-modal.component';
import { ExportSettingInfoDivArray, IExportGlassSettingInfoConditionInput } from './export-glass-setting-info.define';
import { ExportGlassSettingInfoConditionManager } from './export-glass-setting-info.condition';
import { ExportGlassSettingInfoService } from './export-glass-setting-info.service';
import { forEach as _forEach } from 'lodash';

/**
 * 硝子取引先情報コンポーネント
 */
@Component({
  selector: 'app-export-glass-setting-info',
  templateUrl: './export-glass-setting-info.component.html',
  styleUrls: ['./export-glass-setting-info.component.scss'],
  providers: [ExportGlassSettingInfoService, ExportGlassSettingInfoConditionManager]
})
export class ExportGlassSettingInfoComponent extends AbstractContainer implements OnInit {
  /** 詳細情報出力条件 */
  public exportCondition: IExportGlassSettingInfoConditionInput;
  /** 出力タイプ */
  public ExportSettingInfoDivArray = ExportSettingInfoDivArray;
  /** テキスト出力情報タブ区分 */
  public readonly exportInfoTabDiv = ExportInfoTabDiv;
  /** WebSocket接続済み */
  @Input() webSocketConnected: boolean;
  /** WebSocket変更イベント */
  @Output() changeWebSocketConnected: EventEmitter<boolean> = new EventEmitter();

  constructor(
    private exportGlassSettingInfoService: ExportGlassSettingInfoService,
    private dialogService: BlDialogService,
    private loadingService: BlLoadingService,
    private appContext: BlAppContext,
    private exportService: ExportPageService,
    private modalService: BlModalService,
    private loginResourceService: LoginResourceService,
  ) {
    super();
    this.exportService.invokeEventTabGlassSettingInfoSlip.subscribe(dataDownload => {
      this.showModalDownload(this.createSettingInfoExportPatternList(), dataDownload.infoDataDownload);
    });
  }

  /**
   * 初期化
   */
  ngOnInit() {
    this.initConditions();
  }

  /**
   * 入力条件を初期化
   */
  private initConditions(): void {
    this.exportCondition = this.exportGlassSettingInfoService.initCondition();
  }

  /**
   * 出力ボタンを押下する時のイベント
   */
  onClickExport(): void {
    // ロール確認
    this.loadingService.show();
    this.loginResourceService.isAvailableFunction(RoleConst.ROLEID_FUNC_ALL_SALESSLIP_TEXT_OUTPUT).subscribe(
      isAvailable => {
        if (isAvailable) {
          // 設定情報画面で出力する対象データは分割処理を行うほど大量のデータではないため、カウントを取得せずCSV出力処理を行う
          this.export(false);
        } else {
          this.loadingService.hide();
          this.dialogService.error('権限が無い為、テキスト出力は行えません').subscribe(
            dialogRef => dialogRef.hide()
          );
        }
      }
    );
  }

  /**
   * 設定情報画面用の出力パターンリストを生成する<br>
   * ※設定情報画面は出力パターンを画面に表示しない、かつ、イレギュラーな出力情報区分を持っているため、対象パターンを手動で生成する
   * @private
   */
  private createSettingInfoExportPatternList(): IExportPatternInfo[] {
    const pattern1: IExportPatternInfo = new class implements IExportPatternInfo {};
    const pattern2: IExportPatternInfo = new class implements IExportPatternInfo {};
    // 車種メモ
    pattern1.exportInfoDiv = ExportInfoDiv.GlassVehicleModelMemoInfo;
    pattern1.exportInfoDivEnumName = ExportInfoDivMap[ExportInfoDiv.GlassVehicleModelMemoInfo];
    // 硝子メモ
    pattern2.exportInfoDiv = ExportInfoDiv.GlassMemoInfo;
    pattern1.exportInfoDivEnumName = ExportInfoDivMap[ExportInfoDiv.GlassMemoInfo];

    const patternList: IExportPatternInfo[] = [];
    patternList.push(pattern1);
    patternList.push(pattern2);
    return patternList;
  }

  /**
   * テキスト出力処理
   * @param isSplit 分割フラグ
   */
  private export(isSplit: boolean) {
    this.loadingService.show({ message: '出力処理中です。<br />しばらくお待ちください。' });
    // 出力条件設定
    this.setExportConditions();
    this.exportGlassSettingInfoService.export(isSplit).subscribe(() => {
    }, e => {
      // kongによる60秒エラー対策のため500エラーのハンドリングは行わない
      if (e.status !== 500) {
        this.loadingService.hide();
        this.dialogService.error(e.messages).subscribe(ref => {
          ref.hide();
        });
      }
    });
  }

  /**
   * 出力条件設定
   */
  private setExportConditions() {
    // 出力パターン
    this.exportGlassSettingInfoService.setExportPatternCodeList([this.exportCondition.exportPatternCode]);
    // ヘッダ行
    this.exportGlassSettingInfoService.setOutPutHeaderDiv(this.exportCondition.outPutHeaderDiv);
    // プロダクトコード
    this.exportGlassSettingInfoService.setProductCodes(this.exportCondition.productCode);
    // セッションID
    const clientSessionId = this.appContext.getUuid() + 'salesSlip';
    this.exportGlassSettingInfoService.setClientSessionId(clientSessionId);
    if (!this.webSocketConnected) {
      this.exportService.connectWebSocket(ExportInfoTabDiv.GlassSettingInfo, clientSessionId, true);
      this.webSocketConnected = true;
      this.changeWebSocketConnected.emit(this.webSocketConnected);
    }
  }

  /**
   * ファイルダウンロードのモーダル画面を表示
   * exportInfoDivEnumNameを取り出す
   * @param dataDivSortExportTab1 出力パターンリスト
   * @param listFile APIより返却されたcsvファイルの一覧
   */
  private showModalDownload(dataDivSortExportTab1: IExportPatternInfo[], listFile: IDownloadContent[]): void {
    const tmpFile = [];
    _forEach(listFile, (file, fileIndex) => {
      let keepGoing = true;
      _forEach(dataDivSortExportTab1, items => {
        if (keepGoing) {
          if (items.exportInfoDiv === file.exportInfoDiv) {
            tmpFile.push({
              exportInfoDiv: items.exportInfoDiv,
              urlDownload: file.urlDownload.toString(),
              exportInfoDivEnumName: `${items.exportInfoDivEnumName}_(${fileIndex + 1}/${listFile.length})`
            });
            keepGoing = false;
          }
        }
      });
    });
    if (listFile.length === 1) {
      location.href = tmpFile[0].urlDownload;
    } else {
      const data = {
        listFile: tmpFile
      };
      const subscription = this.modalService.show(DownloadModalComponent, { data }).subscribe(_modalRef => {
        switch (_modalRef.reason) {
          default:
            _modalRef.hide();
            subscription.unsubscribe();
            break;
        }
      });
    }
  }
}
