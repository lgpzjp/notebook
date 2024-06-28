import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { defer as _defer, delay as _delay, isEmpty as _isEmpty, isNil as _isNil, some as _some } from 'lodash';

import { IExportPatternInfo, ILoginUserEmployeeBindModel, IOrganizationInformation } from '@blcloud/bl-datamodel';
import { ExportInfoDivMap } from '@blcloud/bl-datamodel/enum/output/export-info-div';
import { AbstractContainer, BlLoadingService, BlModalService, ModalReason } from '@blcloud/bl-ng-ui-component';

import { ExportPatternModalComponent, IExportPatternModalParams } from '@blcloud/bl-ng-share-module';
import { ExportPanelContainerService } from './export-panel-container.service';

/**
 * 出力パネル共通コンテナコンポーネント
 */
@Component({
  selector: 'app-export-panel-container',
  templateUrl: 'export-panel-container.component.html',
  styleUrls: ['export-panel-container.component.scss']
})
export class ExportPanelContainerComponent extends AbstractContainer implements OnInit, AfterViewInit, OnChanges {

  /** 出力情報タブ区分 */
  @Input() exportInfoTabDiv: string;

  /** 出力情報区分 */
  @Input() exportInfoDiv: string;

  /** 出力作業タイプ区分 */
  @Input() exportWorkTypeDiv: string;

  /** 組織セレクトボックス表示モード */
  @Input() organizationSelectMode: string;

  /** 本社機能モード(trueの場合に本社機能が有効となる) */
  @Input() officeControl = true;

  /** ログインユーザー情報取得完了イベント */
  @Output() readyLoginUserInfoEvent: EventEmitter<ILoginUserEmployeeBindModel> = new EventEmitter();

  /** 組織リスト取得完了イベント */
  @Output() readyOrganizationListEvent: EventEmitter<IOrganizationInformation[]> = new EventEmitter();

  /** 組織変更イベント */
  @Output() changeOrganizationEvent: EventEmitter<string> = new EventEmitter();

  /** 出力パターン変更イベント */
  @Output() changeExportPatternEvent: EventEmitter<number> = new EventEmitter();

  /** 組織コード */
  _organizationCode: string;

  /** 出力情報名称 */
  _exportInfoName = '';

  /** 出力パターン項目リスト */
  _exportPatternItems: IExportPatternInfo[] = [];

  /** 出力パターンコード */
  _exportPatternCode = 0;

  /** ログインユーザー情報 */
  private loginUserInfo: ILoginUserEmployeeBindModel;

  /** 出力パターン選択情報 */
  private selectExportPatterns: {};

  constructor(
    private modalService: BlModalService,
    private loadingService: BlLoadingService,
    private exportPanelContainerService: ExportPanelContainerService
  ) {
    super();
  }

  ngOnInit() {
    // ログインユーザーの組織コードを取得
    this.exportPanelContainerService.getLoginUserInfo().subscribe(
      info => {
        this.loginUserInfo = info;
        this._organizationCode = info.organizationCode;

        this.getSelectExportPattern();
        this.updateExportPatternItems();

        _defer(() => {
          this.readyLoginUserInfoEvent.emit(info);
          this.changeOrganizationEvent.emit(this._organizationCode);
        });
      }
    );

  }

  ngAfterViewInit() {
    this.initContainer().subscribe(
      () => this.emitInitExit(),
      e => this.emitInitExit(e)
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!_isNil(changes.exportInfoTabDiv) && changes.exportInfoTabDiv.currentValue) {
      this.getSelectExportPattern();
      this.updateExportPatternItems();
    }

    if (!_isNil(changes.exportInfoDiv) && changes.exportInfoDiv.currentValue) {
      this.updateExportInfoName();
      this.updateExportPatternItems();
    }

    if (!_isNil(changes.exportWorkTypeDiv) && changes.exportWorkTypeDiv.currentValue) {
      this.updateExportPatternItems();
    }
  }

  /**
   * 条件を初期化します。
   */
  initCondition() {
    this._organizationCode = this.loginUserInfo.organizationCode;
    this.changeOrganizationEvent.emit(this._organizationCode);

    if (!_isEmpty(this._exportPatternItems)) {
      this._exportPatternCode = this._exportPatternItems[0].exportPatternCode;
    }
  }

  /**
   * 組織リスト取得完了イベント
   * @param organizationList 組織リスト
   */
  onReadyOrganizationList(organizationList: IOrganizationInformation[]) {
    this.readyOrganizationListEvent.emit(organizationList);
  }

  /**
   * 組織情報変更イベントハンドラ
   * @param organization 組織情報
   */
  onChangeOrganization(organization: IOrganizationInformation) {
    this._organizationCode = organization.organizationCode;
    this.changeOrganizationEvent.emit(this._organizationCode);
  }

  /**
   * 出力パターン変更イベントハンドラ
   * @param exportPatternCode 出力パターンコード
   */
  onChangeExportPattern(exportPatternCode: number) {
    this._exportPatternCode = exportPatternCode;
    this.selectExportPatterns[this.exportInfoDiv] = exportPatternCode;
    this.changeExportPatternEvent.emit(exportPatternCode);

    // 出力パターンの選択情報をローカルストレージに保存
    this.exportPanelContainerService.saveExportPatternLocalStorage(
      this.loginUserInfo.blTenantId, this.loginUserInfo.blUserId, this.exportInfoTabDiv, this.selectExportPatterns
    );
  }

  /**
   * 出力パターン編集クリックイベントハンドラ
   */
  onClickPatternEdit() {
    const data: IExportPatternModalParams = {
      exportInfoTabDiv: this.exportInfoTabDiv,
      exportInfoDiv: this.exportInfoDiv,
      exportPatternCode: this._exportPatternCode,
      dataModalExportPatterns: this._exportPatternItems,
      isSortable: true,
    };
    // 出力パターン編集モーダル画面で情報変更通知
    let isUpdateOrCreatenNewPattern = false;

    const subscription = this.modalService.show(ExportPatternModalComponent, { data }).subscribe(
      modalRef => {
        switch (modalRef.reason) {
          case ModalReason.Cancel:
          case ModalReason.Esc:
          case ModalReason.BackdropClick:
            // 出力パターン編集モーダル画面で変更有無処理
            if (isUpdateOrCreatenNewPattern) {
              _delay(() => {
                this.updateExportPatternItems();
                this.loadingService.hide();
                modalRef.hide();
                subscription.unsubscribe();
              }, 1000);
            } else {
              // 出力パターン編集モーダル画面で情報を変更しない場合、モーダル画面を閉じる
              modalRef.hide();
              subscription.unsubscribe();
            }
            break;
          case ModalReason.Done:
          case ModalReason.Any:
            isUpdateOrCreatenNewPattern = true;
            break;
          default:
            break;
        }
      }
    );
  }

  /**
   * 出力情報名称を更新します。
   */
  private updateExportInfoName() {
    this._exportInfoName = ExportInfoDivMap[this.exportInfoDiv] ? ExportInfoDivMap[this.exportInfoDiv] : '';
  }

  /**
   * 出力パターン選択情報を取得します。
   */
  private getSelectExportPattern() {
    if (!this.loginUserInfo || !this.exportInfoTabDiv) {
      return;
    }

    // 出力パターン選択情報をローカルストレージから取得
    this.selectExportPatterns = this.exportPanelContainerService.getExportPatternLocalStorage(
      this.loginUserInfo.blTenantId, this.loginUserInfo.blUserId, this.exportInfoTabDiv
    );
  }

  /**
   * 出力パターン項目リストを更新します。
   */
  private updateExportPatternItems() {
    if (!this.loginUserInfo || !this.exportInfoTabDiv) {
      return;
    }

    this.exportPanelContainerService.getExportPatternInfo(this.exportInfoTabDiv, this.exportInfoDiv, this.exportWorkTypeDiv).subscribe(
      items => {
        this._exportPatternItems = items;

        if (!_isEmpty(this._exportPatternItems)) {
          let exportPatternCode = this._exportPatternItems[0].exportPatternCode;

          if (this.selectExportPatterns[this.exportInfoDiv]) {
            if (_some(this._exportPatternItems, item => item.exportPatternCode === this.selectExportPatterns[this.exportInfoDiv])) {
              exportPatternCode = this.selectExportPatterns[this.exportInfoDiv];
            }
          }

          this._exportPatternCode = exportPatternCode;
          this.changeExportPatternEvent.emit(exportPatternCode);

          // 出力パターンの選択情報をローカルストレージに保存
          this.selectExportPatterns[this.exportInfoDiv] = exportPatternCode;
          this.exportPanelContainerService.saveExportPatternLocalStorage(
            this.loginUserInfo.blTenantId, this.loginUserInfo.blUserId, this.exportInfoTabDiv, this.selectExportPatterns
          );
        }
      }
    );
  }

}
