import {
  Component,
  OnInit,
  ViewChild,
  EventEmitter,
  Output,
  QueryList,
  ViewChildren,
  Input
} from '@angular/core';
import {
  AbstractContainer, BlDialogService, BlLoadingService, BlModalService,
} from '@blcloud/bl-ng-ui-component';
import { ExportPurchaseSlipService } from './export-purchase-slip.service';
import * as _moment from 'moment';
import {
  defer as _defer,
  isNil as _isNil,
  forEach as _forEach,
  filter as _filter,
  map as _map,
} from 'lodash';
import { IExportPurchaseSlipConditionInput } from './export-purchase-slip.define';
import { ExportPurchaseSlipConditionManager } from './export-purchase-slip.condition';
import { LoginResourceService, WithAllCompanyDiv } from '@blcloud/bl-ng-share-module';
import {
  ExportPatternSelectorComponent
} from '../../page/export-page/components/export-pattern-selector/export-pattern-selector.component';
import { DatePickerConditionComponent } from '../../page/export-page/components/date-picker-condition/date-picker-condition.component';
import { AbstractConditionsComponent } from '../../page/export-page/components/abstract-conditions.component';
import { BlAppContext } from '@blcloud/bl-ng-common';
import { ExportPageService } from '../../page/export-page/export-page.service';
import {
  IDownloadContent
} from '../../page/export-page/export-page.define';
import {
  DetailPurchaseSlipConditionComponent
} from '../../page/export-page/components/detail-purchase-slip-condition/detail-purchase-slip-condition.component';
import {
  IDetailCustomerCondition
} from '../../page/export-page/components/detail-purchase-slip-condition/detail-purchase-slip-condition.define';
import { DownloadModalComponent } from '../../shared/modal/download-modal/download-modal.component';
import { PurchaseSlipExportContent, PurchaseSlipExportContentMap  } from '@blcloud/bl-datamodel/enum/purchase/purchase-slip-export-content';
import { ExportSlipTypeDiv, ExportSlipTypeDivArray } from '@blcloud/bl-datamodel/enum/output/export-slip-type-div';
import { ExportInfoTabDiv } from '@blcloud/bl-datamodel/enum/output/export-info-tab-div';
import { IExportPatternInfo, IOrganizationInformation } from '@blcloud/bl-datamodel';
import { RoleConst } from '@blcloud/bl-datamodel/const/role';
import { DateTimeUtils } from '@blcloud/bl-common';
import {
  PurchaseSlipTargetPeriodDiv, PurchaseSlipTargetPeriodDivArray
} from '@blcloud/bl-datamodel/enum/purchase/purchase-slip-target-period-div';
import { PurchaseSlipOrganizationSelect } from '@blcloud/bl-datamodel/enum/purchase/purchase-slip-organization-select';
import { PurchaseSlipSupplierSelect } from '@blcloud/bl-datamodel/enum/purchase/purchase-slip-supplier-select';
import { ProductCode } from '@blcloud/bl-datamodel/enum/common/product-code';

/**
 * 仕入伝票出力コンポーネント
 */
@Component({
  selector: 'app-export-purchase-slip',
  templateUrl: './export-purchase-slip.component.html',
  styleUrls: ['./export-purchase-slip.component.scss'],
  providers: [ExportPurchaseSlipService, ExportPurchaseSlipConditionManager]
})
export class ExportPurchaseSlipComponent extends AbstractContainer implements OnInit {
  /** 詳細条件表示有無 */
  private isShowDetail = false;
  /** WebSocket接続済み */
  private webSocketConnected = false;
  /** 全社設定取得区分 */
  public readonly withAllCompanyDiv = WithAllCompanyDiv;
  /** 出力条件 */
  public exportCondition: IExportPurchaseSlipConditionInput;
  /** テキスト出力情報タブ区分 */
  public readonly exportInfoTabDiv = ExportInfoTabDiv;
  /** 仕入情報表示有無 */
  public isShowPurchaseInfo = true;
  /** 入荷情報表示有無 */
  public isShowArrivalInfo = true;
  /** 発注情報表示有無 */
  public isShowOrderInfo = true;
  /** 返品予定情報表示有無 */
  public isShowReturningInfo = true;
  /** 出金情報表示有無 */
  public isShowWithdrawalInfo = false;
  /** 開始日付 */
  public startDate: string;
  /** 終了日付 */
  public endDate: string;
  /** 出力タイプ項目 */
  public exportInfoTypeItems = ExportSlipTypeDivArray;

  /** 対象期間 */
  readonly purchaseSlipTargetPeriodDivArray = PurchaseSlipTargetPeriodDivArray;
  /** プロダクトコード */
  public readonly ProductCode = ProductCode;

  /** 顧客詳細条件 */
  public detailCustomerConditionValue: IDetailCustomerCondition = {
    picEmployeeCodeStart: '',
    picEmployeeCodeEnd: '',
    payeeCodeStart: '',
    payeeCodeEnd: '',
    cutoffDay: '',
    whCodeStart: '',
    whCodeEnd: '',
    itemMakerCdStart: '',
    itemMakerCdEnd: '',
    partsNumber: '',
    partsName: ''
  };

  /** 仕入伝票情報出力内容 */
  public readonly purchaseSlipExportContent = PurchaseSlipExportContent;
  /** 仕入伝票情報出力内容マップ */
  public readonly PurchaseSlipExportContentMap = PurchaseSlipExportContentMap;

  /** 画面初期化完了フラグ */
  defaultSelectedOrganizationCode = '0';

  /** 仕入伝票詳細条件コンポーネント */
  @ViewChildren('detailConditionPurchaseSlip') conditionsList: QueryList<AbstractConditionsComponent>;
  /** データ出力パターン選択コンポーネント */
  @ViewChild(ExportPatternSelectorComponent) exportPatternSelectorComponent: ExportPatternSelectorComponent;
  /** 対象期間の日付選択コンポーネント */
  @ViewChild(DatePickerConditionComponent) datePickerCondition: DatePickerConditionComponent;
  /** 仕入伝票詳細条件コンポーネント */
  @ViewChild(DetailPurchaseSlipConditionComponent) detailCustomerCondition: DetailPurchaseSlipConditionComponent;

  /** データ出力パターン */
  @Input() dataExportPatterns: IExportPatternInfo[];
  /** 業務選択肢 */
  @Input() systemItems: {value: string, text: string}[];
  /** プロダクトコード */
  @Input() productCode: string;

  /** タブフォーカスキーボードイベント */
  @Output() tabFocusKeyboardEvent = new EventEmitter();
  /** データ出力パターン変更イベント */
  @Output() changeExportPatternEvent: EventEmitter<IExportPatternInfo[]> = new EventEmitter();

  constructor(
    private exportPurchaseSlipService: ExportPurchaseSlipService,
    private dialogService: BlDialogService,
    private loadingShow: BlLoadingService,
    private appContext: BlAppContext,
    private exportService: ExportPageService,
    private modalService: BlModalService,
    private loginResourceService: LoginResourceService
  ) {
    super();
    this.exportService.invokeEventTabPurchaseSlip.subscribe(dataDownload => {
      this.showModalDownload(<IExportPatternInfo[]>this.dataExportPatterns,
        dataDownload.infoDataDownload);
    });
  }

  /**
   * 初期化
   */
  ngOnInit() {
    this.initConditions();

    if (this.productCode === ProductCode.Recycle) {
      // ログイン組織コードを取得
      this.exportService.getLoginUserInfo().subscribe(
        loginUser => {
          this.exportCondition.organization = loginUser.organizationCode;
          this.defaultSelectedOrganizationCode = loginUser.organizationCode;
        }
      );
    }

    this.onInitDatePicker();
  }

  /** クリア */
  clear(exportSlipTypeDiv: string): void {
    if (exportSlipTypeDiv === ExportSlipTypeDiv.SlipDetail) {
      this.exportCondition.whCodeStart = '',
      this.exportCondition.whCodeEnd = '',
      this.exportCondition.itemMakerCdStart = '',
      this.exportCondition.itemMakerCdEnd = '',
      this.exportCondition.partsNumber = '',
      this.exportCondition.partsName = '';
    }
      this.exportCondition.picEmployeeCodeStart = '',
      this.exportCondition.picEmployeeCodeEnd = '',
      this.exportCondition.payeeCodeStart = '',
      this.exportCondition.payeeCodeEnd = '',
      this.exportCondition.cutoffDay = '';
      if (this.detailCustomerCondition.isShowCustomerInfo  === true) {
        this.exportCondition.salseSupplierMgtOrganization = this.defaultSelectedOrganizationCode;
        this.exportCondition.salseSupplier = this.defaultSelectedOrganizationCode;
      }
  }

  /**
   * 出力内容設定
   */
  outputCutoffDay(): void {
    this.isShowWithdrawalInfo  = false;
    this.exportCondition.withdrawal = true;
    this.isShowPurchaseInfo  = false;
    this.exportCondition.purchase = false;
    this.isShowArrivalInfo  = false;
    this.exportCondition.arrival = false;
    this.isShowOrderInfo  = false;
    this.exportCondition.order = false;
    this.isShowReturningInfo  = false;
    this.exportCondition.returning = false;
  }

  /**
   * 出力内容設定
   */
  outputNoCutoffDay(): void {
    this.isShowWithdrawalInfo  = false;
    this.exportCondition.withdrawal = false;
    this.isShowPurchaseInfo  = true;
    this.exportCondition.purchase = true;
    this.isShowArrivalInfo  = true;
    this.exportCondition.arrival = true;
    this.isShowOrderInfo  = true;
    this.exportCondition.order = true;
    this.isShowReturningInfo  = true;
    this.exportCondition.returning = true;
  }

  /**
   * テキスト出力を更新
   * @param isLoadOld load pattern selected on old session
   */
  updateExportPattern(isLoadOld: boolean = false): void {
    this.exportPatternSelectorComponent.genTableExportPatternData(isLoadOld);
  }

  /**
   * 仕入の変更イベント | 出力内容
   * @param event
   */
  onChangePurchase(event: Event): void {
    if ((<HTMLInputElement>event.target).checked) {
      this.exportCondition.purchase = true;
    } else {
      this.exportCondition.purchase = false;
    }
  }

  /**
   * 入荷の変更イベント | 出力内容
   * @param event
   */
  onChangeArrival(event: Event): void {
    if ((<HTMLInputElement>event.target).checked) {
      this.exportCondition.arrival = true;
    } else {
      this.exportCondition.arrival = false;
    }
  }

  /**
   * 発注の変更イベント | 出力内容
   * @param event
   */
  onChangeOrder(event: Event): void {
    if ((<HTMLInputElement>event.target).checked) {
      this.exportCondition.order = true;
    } else {
      this.exportCondition.order = false;
    }
  }

  /**
   * 返品予定の変更イベント | 出力内容
   * @param event
   */
  onChangeReturning(event: Event): void {
    if ((<HTMLInputElement>event.target).checked) {
      this.exportCondition.returning = true;
    } else {
      this.exportCondition.returning = false;
    }
  }

  /**
   * 出金の変更イベント | 出力内容
   * @param event
   */
  onChangeWithdrawal(event: Event): void {
    if ((<HTMLInputElement>event.target).checked) {
      this.exportCondition.withdrawal = true;
    } else {
      this.exportCondition.withdrawal = false;
    }
  }

  /**
   * 対象期間の変更イベント
   * @param event
   */
  onChangeTargetPeriod(event: string): void {
    // 「対象期間項目」に「支払締日」を選択時
    if (event === PurchaseSlipTargetPeriodDiv.PayCutoffDate) {
      this.exportCondition.salseSupplierMgtOrganization = PurchaseSlipOrganizationSelect.PayOrganization;
      this.exportCondition.salseSupplier = PurchaseSlipSupplierSelect.Payee;
      this.datePickerCondition.displayEndDate = false;
      this.detailCustomerCondition.isShowCustomerInfo  = false;
      this.outputCutoffDay();
      this.detailCustomerCondition.showDetailFlg  = false;
      if (this.exportCondition.exportInfoType === ExportSlipTypeDiv.Slip) {
        this.detailCustomerCondition.showDetailFlg  = false;
      } else {
        this.detailCustomerCondition.showDetailFlg  = true;
      }
    // 「対象期間項目」に「支払締日」以外を選択時
    } else {
      const start = _moment(this.datePickerCondition.startDate);
      const end = _moment(this.datePickerCondition.endDate);
      if (start.isAfter(end)) {
        this.datePickerCondition.endDate = this.datePickerCondition.startDate;
        this.onEndDateChange(this.datePickerCondition.endDate);
      }
      this.exportCondition.salseSupplierMgtOrganization = PurchaseSlipOrganizationSelect.PurchaseOrganization;
      this.exportCondition.salseSupplier = PurchaseSlipSupplierSelect.Supplier;
      this.datePickerCondition.displayEndDate = true;
      this.detailCustomerCondition.isShowCustomerInfo  = true;
      this.outputNoCutoffDay();
      this.detailCustomerCondition.showDetailFlg  = true;
      if (this.exportCondition.exportInfoType === ExportSlipTypeDiv.Slip) {
        this.detailCustomerCondition.showDetailFlg  = false;
      } else {
        this.detailCustomerCondition.showDetailFlg  = true;
      }
    }
    this.exportPurchaseSlipService.setDocumentMode(event);
  }

  /**
   * 出力タイプの変更イベント
   * @param v bl-select return value
   */
  onChangeExportInfoType(v: string): void {
    this.exportCondition.exportInfoType = v;
    this.updateExportPattern(true);
    if (v === ExportSlipTypeDiv.SlipDetail) {
      this.detailCustomerCondition.showDetailFlg  = true;
    } else {
      this.detailCustomerCondition.showDetailFlg  = false;
    }
  }

  /**
   * 管理組織の表示イベント
   * @param event
   */
  onReadySlipMgtStdOrgCode(event: IOrganizationInformation[]): void {
    if (!_isNil(event)) {
      if (event.length > 0) {
        this.defaultSelectedOrganizationCode = this.exportCondition.organization = event[0].organizationCode;
        return;
      }
    }
    this.exportCondition.organization = null;
  }

  /**
   * システムの変更イベント
   * @param v
   */
  onChangeProductCode(v: string): void {
    this.exportCondition.productCode = v;
  }

  /**
   * 入力条件を初期化
   */
  private initConditions(): void {
    this.exportCondition = this.exportPurchaseSlipService.initCondition();
    if (this.productCode === ProductCode.Recycle) {
      this.exportCondition.arrival = false;
      this.exportCondition.order = false;
      this.exportCondition.returning = false;
      this.exportCondition.withdrawal = false;
    }
  }

  /**
   * 条件取消ボタンクリックイベント
   * exportCustomerVehicle & salseRecordedOrganizationを初期値にする
   */
  onClearCondition(): void {
    this.clear(this.exportCondition.exportInfoType);
    this.datePickerCondition.startDate = this.startDate;
    this.datePickerCondition.endDate = this.endDate;
    this.datePickerCondition.displayEndDate = true;
    this.exportCondition = this.exportPurchaseSlipService.initCondition();
    this.onChangeExportInfoType(ExportSlipTypeDiv.Slip);
    this.onChangeTargetPeriod(PurchaseSlipTargetPeriodDiv.SlipDate);
    this.toggleDetailCondition();
    this.updateExportPattern(true);
  }

  /**
   * 出力ボタンを押下する時のイベント
   */
  onClickExport(): void {
    // ロール確認
    this.loadingShow.show();
    this.loginResourceService.isAvailableFunction(RoleConst.ROLEID_FUNC_PMC_PURCHASESLIP_TEXT_OUTPUT).subscribe(
      isAvailable => {
        if (isAvailable) {
          this.export();
        } else {
          this.loadingShow.hide();
          this.dialogService.error('権限が無い為、テキスト出力は行えません').subscribe(
            dialogRef => dialogRef.hide()
          );
        }
      }
    );
  }

  /**
   * 出力ボタンを押下する時のイベント
   */
  export(): void {
    const purchaseSlipExportContentList: string[] = [];
    if (this.exportCondition.purchase) {
      purchaseSlipExportContentList.push(this.purchaseSlipExportContent.Purchase);
    }
    if (this.exportCondition.arrival) {
      purchaseSlipExportContentList.push(this.purchaseSlipExportContent.Arrival);
    }
    if (this.exportCondition.order) {
      purchaseSlipExportContentList.push(this.purchaseSlipExportContent.Order);
    }
    if (this.exportCondition.returning) {
      purchaseSlipExportContentList.push(this.purchaseSlipExportContent.Returning);
    }
    if (this.exportCondition.withdrawal) {
      purchaseSlipExportContentList.push(this.purchaseSlipExportContent.Withdrawal);
    }
    if (!purchaseSlipExportContentList || purchaseSlipExportContentList.length === 0) {
      this.dialogService.warn('出力内容が指定されていません。', '確認').subscribe(dialogRef => {
        const el = document.activeElement;
        dialogRef.hide(el);
        this.loadingShow.hide();
      });
      return;
    }

    this.exportPurchaseSlipService.setExportPatternCode(this.exportPatternSelectorComponent.getExportPatternCodeList());
    this.exportPurchaseSlipService.setPurchaseSlipExportContentList(purchaseSlipExportContentList);
    this.exportPurchaseSlipService.setDate(this.exportCondition.startDate, this.exportCondition.endDate, this.exportCondition.targetPeriod);
    this.exportPurchaseSlipService.setOrganization(this.exportCondition.organization,
      this.exportCondition.salseSupplierMgtOrganization, this.productCode);
    if (this.isShowDetail === true ) {
      this.exportPurchaseSlipService.setPicEmployeeCode(this.detailCustomerConditionValue.picEmployeeCodeStart,
      this.detailCustomerConditionValue.picEmployeeCodeEnd);
      this.exportPurchaseSlipService.setSupplierCd(this.detailCustomerConditionValue.payeeCodeStart,
      this.detailCustomerConditionValue.payeeCodeEnd, this.exportCondition.salseSupplier);
      this.exportPurchaseSlipService.setCutoffDay(this.detailCustomerConditionValue.cutoffDay);
      if (this.exportCondition.exportInfoType === ExportSlipTypeDiv.SlipDetail ) {
        this.exportPurchaseSlipService.setWhCode(this.detailCustomerConditionValue.whCodeStart,
          this.detailCustomerConditionValue.whCodeEnd);
        this.exportPurchaseSlipService.setItemMakerCd(this.detailCustomerConditionValue.itemMakerCdStart,
          this.detailCustomerConditionValue.itemMakerCdEnd);
        this.exportPurchaseSlipService.setPartsNumber(this.detailCustomerConditionValue.partsNumber);
        this.exportPurchaseSlipService.setPartsName(this.detailCustomerConditionValue.partsName);
      }
    }
    const productCodes = _map(
      _filter(this.systemItems, item => item.value !== ProductCode.Common), product => product.value
    );
    this.exportPurchaseSlipService.setProductCodes(productCodes);
    const clientSessionId = this.appContext.getUuid() + 'PurchaseSlip';
    this.exportPurchaseSlipService.setClientSessionId(clientSessionId);
    if (!this.webSocketConnected) {
      this.exportService.connectWebSocket(ExportInfoTabDiv.PurchaseSlip, clientSessionId);
      this.webSocketConnected = true;
    }

    this.loadingShow.show({ message: '出力処理中です。<br />しばらくお待ちください。' });
    this.exportPurchaseSlipService.export(this.exportCondition.salseSupplierMgtOrganization).subscribe(_response => { },
      _error => { });
  }

  /**
   * 詳細条件ボタンクリックイベント
   */
  onClickDetailButton(): void {
    this.toggleDetailCondition();
  }

  /**
   * 詳細条件表示切替
   */
  private toggleDetailCondition() {
    if (!this.isShowDetail) {
      _defer(() => {
        this.openConditions();
      });
    } else {
      _defer(() => {
        this.closeConditions();
      });
    }
    this.isShowDetail = !this.isShowDetail;
  }

  /**
   * すべての詳細出力条件を表示
   */
  private openConditions(): void {
    if (this.exportCondition.exportInfoType === ExportSlipTypeDiv.Slip) {
      this.detailCustomerCondition.showDetailFlg  = false;
    } else {
      this.detailCustomerCondition.showDetailFlg  = true;
    }
    this.conditionsList.forEach(conditions => {
      conditions.open();
    });
  }

  /**
   * すべての詳細出力条件を非表示
   */
  private closeConditions(): void {
    this.conditionsList.forEach(conditions => {
      conditions.close();
    });
  }

  /**
   * ファイルダウンロードのモダール画面を表示
   * exportInfoDivEnumNameを取り出す
   * @param dataDivSortExportTab1
   * @param listFile APIより返却されたcsvファイルの一覧
   */
  private showModalDownload(dataDivSortExportTab1: IExportPatternInfo[], listFile: IDownloadContent[]): void {
    const tmpFile = [];
    _forEach(listFile, file => {
      let keepGoing = true;
      _forEach(dataDivSortExportTab1, items => {
        if (keepGoing) {
          if (items.exportInfoDiv === file.exportInfoDiv) {
            tmpFile.push({
              exportInfoDiv: items.exportInfoDiv,
              urlDownload: file.urlDownload.toString(),
              exportInfoDivEnumName: items.exportInfoDivEnumName
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

  /** 開始日付変更イベント */
  onStartDateChange($event: string): void {
    this.exportCondition.startDate = $event;
  }

  /** 終了日付変更イベント */
  onEndDateChange($event: string): void {
    this.exportCondition.endDate = $event;
  }

  /** 仕入伝票詳細条件変更イベント */
  onChangeDetailCustomerCondition($event: IDetailCustomerCondition): void {
    this.detailCustomerConditionValue = $event;
  }

  /** データ出力パターン変更イベント */
  onChangeDataExportPattern(data: IExportPatternInfo[]) {
    this.dataExportPatterns = data;
    this.changeExportPatternEvent.emit(data);
  }

  /**
   * 対象期間_日付初期化
   */
  onInitDatePicker(): void {
    // システム日付を取得
    const today = DateTimeUtils.today();
    // 当日の前月年月日
    this.startDate = DateTimeUtils.formatIso(DateTimeUtils.addMonths(today, - 1));
    // 当年月日
    this.endDate = DateTimeUtils.formatIso(today);
  }
}
