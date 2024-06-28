import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { defer as _defer, isNil as _isNil, cloneDeep as _cloneDeep } from 'lodash';
import { Ng2DeviceService } from 'ng2-device-detector';

import {
  ILoginUserEmployeeBindModel,
  IOrganizationInformation,
  IReportOutputResult,
  IAccountGenericSettingSubID,
} from '@blcloud/bl-datamodel';
import { DateTimeUtils } from '@blcloud/bl-common';
import {
  AbstractContainer,
  BlTabOption,
  BlTabContainerComponent,
  BlModalService,
  ModalReason,
  BlDialogService,
} from '@blcloud/bl-ng-ui-component';
import { PreviewType, OrganizationInformationResourceService, PageId } from '@blcloud/bl-ng-share-module';

import { ExportReportPanelContainerService } from './export-report-panel-container.service';
import { ReportConditionSettingModalComponent } from '../modal/report-condition-setting-modal/report-condition-setting-modal.component';
import {
  ReportConditionSettingDetailModalComponent
} from '../modal/report-condition-setting-detail-modal/report-condition-setting-detail-modal.component';
import {
  IReportConditionSettingModal,
  IReportConditionSettingModalResponse,
} from '../modal/report-condition-setting-modal/report-condition-setting-modal.interface';
import {
  IReportConditionSettingDetailModal,
  ReportConditionSettingDetailModalMode,
} from '../modal/report-condition-setting-detail-modal/report-condition-setting-detail-modal.interface';
import { IFavoriteCondition } from '../service/favorite-condition.interface';
import { FavoriteConditionService } from '../service/favorite-condition.service';

/**
 * 出力パネル共通コンテナコンポーネント
 */
@Component({
  selector: 'app-export-report-panel-container',
  templateUrl: 'export-report-panel-container.component.html',
  styleUrls: ['export-report-panel-container.component.scss'],
})
export class ExportReportPanelContainerComponent extends AbstractContainer implements OnInit, AfterViewInit, OnChanges {
  /** プレビュー */
  @ViewChild('preview') private preview: ElementRef;

  /** タブコンテナ */
  @ViewChild(BlTabContainerComponent) private tabContainer: BlTabContainerComponent;

  /** 帳票出力結果 */
  @Input() reportOutputResult: IReportOutputResult;

  /** 画面ID */
  @Input() pageId: PageId;

  /** 設定識別ID */
  @Input() settingDataId: string;

  /** 検索条件 */
  @Input() reportCondition: any;

  /** よく使う条件の表示設定 */
  @Input() isShownFavoriteCondition = false;

  /** ログインユーザー情報取得完了イベント */
  @Output() readyLoginUserInfoEvent: EventEmitter<ILoginUserEmployeeBindModel> = new EventEmitter();

  /** 組織リスト取得完了イベント */
  @Output() readyOrganizationListEvent: EventEmitter<IOrganizationInformation[]> = new EventEmitter();

  /** 組織変更イベント */
  @Output() changeOrganizationListEvent: EventEmitter<string[]> = new EventEmitter();

  /** よく使う条件読み込みイベント */
  @Output() loadFavoriteConditionEvent: EventEmitter<any> = new EventEmitter();

  /** 組織項目定義 */
  organizationItems: { code: string; name: string }[] = [];

  /** 組織コード配列 */
  _organizationCodeList: string[] = [];

  /** 選択中のアカウント別汎用設定(サブID有) */
  selectedAccountGenericSettingSubID: IAccountGenericSettingSubID;
  /** よく使う条件の名称 */
  selectedFavoriteConditionName = '';

  /** タブの設定配列 */
  tabitems: BlTabOption[] = [
    { tabId: 'tabCondition', elementId: 'tabCondition', label: '検索条件', active: true },
    { tabId: 'tabPreview', elementId: 'tabPreview', label: 'PDF出力', disabled: true },
  ];

  /** ログインユーザー情報 */
  private loginUserInfo: ILoginUserEmployeeBindModel;

  /**
   * コンストラクタ
   * @param exportReportPanelContainerService 帳票出力サービスクラス
   */
  constructor(
    private exportReportPanelContainerService: ExportReportPanelContainerService,
    private organizationService: OrganizationInformationResourceService,
    private deviceService: Ng2DeviceService,
    private modalService: BlModalService,
    private dialogService: BlDialogService,
    private favoriteConditionService: FavoriteConditionService
  ) {
    super();
  }

  ngOnInit() {
    // ログインユーザーの組織コードを取得
    this.exportReportPanelContainerService.getLoginUserInfo().subscribe((info) => {
      this.loginUserInfo = info;

      _defer(() => {
        this._organizationCodeList = [info.organizationCode];
        this.readyLoginUserInfoEvent.emit(info);
        this.changeOrganizationListEvent.emit(this._organizationCodeList);
      });

    });

    this.organizationService.getAllWithAllOrg<IOrganizationInformation>().subscribe((response) => {
      if (response) {
        this.organizationItems = response.searchResultList.map((org) => {
          return { name: org.organizationName, code: org.organizationCode };
        });
      } else {
        this.organizationItems = [];
      }
    });
  }

  ngAfterViewInit() {
    this.initContainer().subscribe(
      () => this.emitInitExit(),
      (e) => this.emitInitExit(e)
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!_isNil(changes.reportOutputResult) && changes.reportOutputResult.currentValue) {
      const tabItem = this.tabitems.find((item) => item.tabId === 'tabPreview');
      if (tabItem) {
        tabItem.disabled = false;
      }

      _defer(() => {
        (<HTMLObjectElement>this.preview.nativeElement).type = PreviewType.Pdf;
        const path = changes.reportOutputResult.currentValue.reportFileUrl;
        (<HTMLObjectElement>this.preview.nativeElement).data = path;
      });
    }
  }

  /**
   * 条件の初期化
   */
  initCondition() {
    this._organizationCodeList = [this.loginUserInfo.organizationCode];
    this.changeOrganizationListEvent.emit(this._organizationCodeList);
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
  onChangeOrganizationItems(organizationCodeList: string[]) {
    this._organizationCodeList = organizationCodeList;
    this.changeOrganizationListEvent.emit(this._organizationCodeList);
  }

  /**
   * よく使う条件ボタンクリックイベントハンドラ
   */
  onClickLoadFavoriteCondition() {
    const data: IReportConditionSettingModal = {
      pageId: this.pageId,
      settingDataId: this.settingDataId,
      accountGenericSettingSubID: this.selectedAccountGenericSettingSubID,
    };

    this.modalService.show(ReportConditionSettingModalComponent, { data }).subscribe((ref) => {
      ref.hide();
      const result: IReportConditionSettingModalResponse = ref.getResults();
      // 結果がある場合はデータを更新する
      if (result.accountGenericSettingSubID) {
        this.selectedAccountGenericSettingSubID = result.accountGenericSettingSubID;
        const parsed = this.favoriteConditionService.extractSettingJsonFromAccountGenericSetting(result.accountGenericSettingSubID);
        if (parsed && parsed.conditionName) {
          this.selectedFavoriteConditionName = parsed.conditionName;
        }
        this.loadFavoriteConditionEvent.emit(parsed.reportCondition);
      } else if (result.deleted) {
        this.selectedFavoriteConditionName = '';
        this.selectedAccountGenericSettingSubID = undefined;
      }
    });
  }

  /**
   * よく使う条件更新ボタンクリックイベントハンドラ
   */
  onClickUpdateFavoriteCondition() {
    this.dialogService.confirm('よく使う条件を更新します。よろしいですか？').subscribe((confirmRef) => {
      confirmRef.hide();
      if (confirmRef.reason === ModalReason.Done) {
        // 設定の編集
        const accountGenericSettingSubID = _cloneDeep(this.selectedAccountGenericSettingSubID);
        const settingInfoData = this.favoriteConditionService.extractSettingJsonFromAccountGenericSetting(accountGenericSettingSubID);
        settingInfoData.reportCondition = _cloneDeep(this.reportCondition);
        settingInfoData.updateDateTime = DateTimeUtils.formatIso(DateTimeUtils.now());
        const dataStr = JSON.stringify(settingInfoData);
        accountGenericSettingSubID.settingInfoDataJson = dataStr;
        this.favoriteConditionService.putFavoriteCondition(accountGenericSettingSubID).subscribe(() => {
          this.dialogService.info('現在表示されている内容で条件を更新しました。').subscribe((infoRef) => infoRef.hide());
        });
      }
    });
  }

  /**
   * よく使う条件追加ボタンクリックイベントハンドラ
   */
  onClickSaveFavoriteCondition() {
    const data: IReportConditionSettingDetailModal = {
      pageId: this.pageId,
      settingDataId: this.settingDataId,
      reportCondition: this.reportCondition,
      mode: ReportConditionSettingDetailModalMode.Add,
      conditionName: this.selectedFavoriteConditionName,
      accountGenericSettingSubID: this.selectedAccountGenericSettingSubID,
    };
    this.modalService.show(ReportConditionSettingDetailModalComponent, { data }).subscribe((ref) => {
      ref.hide();
      if (ref.reason === ModalReason.Done || ref.reason === ModalReason.Any) {
        const res = ref.getResults();
        this.selectedAccountGenericSettingSubID = res;
        try {
          const parsed: IFavoriteCondition = JSON.parse(res.settingInfoDataJson);
          if (parsed && parsed.conditionName) {
            this.selectedFavoriteConditionName = parsed.conditionName;
          }
          this.loadFavoriteConditionEvent.emit(parsed.reportCondition);
        } catch {
          // 何もしない
        }
      }
    });
  }

  /**
   * プレビュータブを活性化
   */
  activatePreviewTab() {
    const index = this.tabitems.findIndex((item) => item.tabId === 'tabPreview');
    if (!_isNil(index)) {
      this.tabContainer.changeActiveTab(index);
    }
  }

  /** デスクトップ利用 */
  get isDesktop() {
    return this.deviceService.isDesktop();
  }
}
