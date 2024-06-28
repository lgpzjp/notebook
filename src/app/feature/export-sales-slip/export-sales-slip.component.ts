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
import { ExportSalesSlipService } from './export-sales-slip.service';
import * as _moment from 'moment';
import {
  forEach as _forEach,
  defer as _defer,
  filter as _filter,
  map as _map
} from 'lodash';
import { IExportSalesSlipConditionInput } from './export-sales-slip.define';
import { ExportSalesSlipConditionManager } from './export-sales-slip.condition';
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
import { DownloadModalComponent } from '../../shared/modal/download-modal/download-modal.component';
import { SalesSlipExportContent } from '@blcloud/bl-datamodel/enum/sales/sales-slip-export-content';
import { SalesSlipExportContentMap } from '@blcloud/bl-datamodel/enum/sales/sales-slip-export-content';
import { ExportSlipTypeDiv, ExportSlipTypeDivArray } from '@blcloud/bl-datamodel/enum/output/export-slip-type-div';
import { ExportInfoTabDiv } from '@blcloud/bl-datamodel/enum/output/export-info-tab-div';
import { IExportPatternInfo } from '@blcloud/bl-datamodel';
import {
  DetailSalesSlipConditionComponent
} from '../../page/export-page/components/detail-sales-slip-condition/detail-sales-slip-condition.component';
import { RoleConst } from '@blcloud/bl-datamodel/const/role';
import {
  SalesSlipSupplierSelect, SalesSlipSupplierSelectArray
} from '@blcloud/bl-datamodel/enum/sales/sales-slip-supplier-select';
import {
  SalesSlipOrganizationSelect
} from '@blcloud/bl-datamodel/enum/sales/sales-slip-organization-select';
import {
  SalesSlipTargetPeriodDiv
} from '@blcloud/bl-datamodel/enum/sales/sales-slip-target-period-div';
import { DateTimeUtils } from '@blcloud/bl-common';
import { ProductCode } from '@blcloud/bl-datamodel/enum/common/product-code';
import { ContractConst } from '@blcloud/bl-datamodel/const/contract';

/**
 * 売上伝票出力コンポーネント
 */
@Component({
  selector: 'app-export-sales-slip',
  templateUrl: './export-sales-slip.component.html',
  styleUrls: ['./export-sales-slip.component.scss'],
  providers: [ExportSalesSlipService, ExportSalesSlipConditionManager]
})
export class ExportSalesSlipComponent extends AbstractContainer implements OnInit {
  /** 詳細条件表示有無 */
  private isShowDetail = false;
  /** WebSocket接続済み */
  private webSocketConnected = false;
  /** 終了日表示フラグ */
  public displayEndDate = true;
  /** 組織選択可否 */
  public organizationSelectPossible = true;
  /** 顧客選択可否 */
  public customerSelectPossible = true;
  /** 出力内容変更可否 */
  public exportContentChangePossible = true;
  /** 全社設定取得区分 */
  public readonly withAllCompanyDiv = WithAllCompanyDiv;
  /** 売上伝票出力条件 */
  public exportCondition: IExportSalesSlipConditionInput;
  /** 開始日付 */
  public startDate: string;
  /** 終了日付 */
  public endDate: string;
  /** 対象期間 */
  readonly SalesSlipSupplierSelectArray = SalesSlipSupplierSelectArray;
  /** 出力タイプ */
  public ExportSlipTypeDivArray = ExportSlipTypeDivArray;
  /** 初期選択組織コード */
  private defaultSelectedOrganizationCode: string;

  /** 『売上伝票情報出力内容』を表します。 */
  public readonly salesSlipExportContent = SalesSlipExportContent;
  /** 『売上伝票情報出力内容』の連想配列情報 */
  public readonly salesSlipExportContentMap = SalesSlipExportContentMap;
  /** テキスト出力情報タブ区分 */
  public readonly exportInfoTabDiv = ExportInfoTabDiv;
  /** プロダクトコード */
  public readonly ProductCode = ProductCode;

  /** 詳細条件コンポーネント配列 */
  @ViewChildren('detailConditionSalesSlip') conditionsList: QueryList<AbstractConditionsComponent>;
  /** 詳細条件コンポーネント */
  @ViewChild(DetailSalesSlipConditionComponent) detailSalesSlipCondition: DetailSalesSlipConditionComponent;
  /** データ出力パターン選択コンポーネント */
  @ViewChild(ExportPatternSelectorComponent) exportPatternSelectorComponent: ExportPatternSelectorComponent;
  /** 日付入力コンポーネント */
  @ViewChild(DatePickerConditionComponent) datePickerCondition: DatePickerConditionComponent;

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
    private exportSalesSlipService: ExportSalesSlipService,
    private dialogService: BlDialogService,
    private loadingService: BlLoadingService,
    private appContext: BlAppContext,
    private exportService: ExportPageService,
    private modalService: BlModalService,
    private loginResourceService: LoginResourceService
  ) {
    super();
    this.exportService.invokeEventTabSalesSlip.subscribe(dataDownload => {
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

    // 対象期間_日付初期化
    this.onInitDatePicker();
  }

  /**
   * テキスト出力を更新
   * @param isLoadOld load pattern selected on old session
   */
  updateExportPattern(isLoadOld: boolean = false): void {
    this.exportPatternSelectorComponent.genTableExportPatternData(isLoadOld);
  }

  /**
   * 売上の変更イベント | 出力内容
   * @param event
   */
  onChangeSlipExportContentSales(event: Event): void {
    if ((<HTMLInputElement>event.target).checked) {
      this.exportCondition.sales = true;
    } else {
      this.exportCondition.sales = false;
    }
  }

  /**
   * 見積の変更イベント | 出力内容
   * @param event
   */
  onChangeSlipExportContentEstimates(event: Event): void {
    if ((<HTMLInputElement>event.target).checked) {
      this.exportCondition.estimate = true;
    } else {
      this.exportCondition.estimate = false;
    }
  }

  /**
   * 受注の変更イベント | 出力内容
   * @param event
   */
  onChangeSlipExportContentOrder(event: Event): void {
    if ((<HTMLInputElement>event.target).checked) {
      this.exportCondition.order = true;
    } else {
      this.exportCondition.order = false;
    }
  }

  /**
   * 貸出の変更イベント | 出力内容
   * @param event
   */
  onChangeSlipExportContentLoan(event: Event): void {
    if ((<HTMLInputElement>event.target).checked) {
      this.exportCondition.loan = true;
    } else {
      this.exportCondition.loan = false;
    }
  }

  /**
   * 入金の変更イベント | 出力内容
   * @param event
   */
  onChangeSlipExportContentDeposit(event: Event): void {
    if ((<HTMLInputElement>event.target).checked) {
      this.exportCondition.deposit = true;
    } else {
      this.exportCondition.deposit = false;
    }
  }

  /**
   * 対象期間の変更イベント
   * @param event
   */
  onChangeTargetPeriod(event: string): void {
    this.exportCondition.targetPeriod = event;
    // 「対象期間項目」に「請求締日」を選択時
    if (this.exportCondition.targetPeriod === SalesSlipSupplierSelect.BillingCutoffDate) {
      this.displayEndDate = false;
      this.organizationSelectPossible = false;
      this.customerSelectPossible = false;
      this.exportCondition.sales = false;
      this.exportCondition.estimate = false;
      this.exportCondition.order = false;
      this.exportCondition.loan = false;
      this.exportCondition.deposit = true;
      this.exportContentChangePossible = false;
      this.exportCondition.organizationSelect = SalesSlipOrganizationSelect.BillingOrganization;
      this.exportCondition.customerSelect = SalesSlipTargetPeriodDiv.Billing;
    // 「対象期間項目」に「請求締日」以外を選択時
    } else {
      const start = _moment(this.datePickerCondition.startDate);
      const end = _moment(this.datePickerCondition.endDate);
      if (start.isAfter(end)) {
        this.datePickerCondition.endDate = this.datePickerCondition.startDate;
        this.onEndDateChange(this.datePickerCondition.endDate);
      }
      this.displayEndDate = true;
      this.organizationSelectPossible = true;
      this.customerSelectPossible = true;
      this.exportCondition.sales = true;
      this.exportCondition.estimate = true;
      this.exportCondition.order = true;
      this.exportCondition.loan = true;
      this.exportCondition.deposit = false;
      this.exportContentChangePossible = true;
      this.exportCondition.organizationSelect = SalesSlipOrganizationSelect.SalesOrganization;
      this.exportCondition.customerSelect = SalesSlipTargetPeriodDiv.Customer;
    }
    this.exportSalesSlipService.setTargetPeriod(this.exportCondition.targetPeriod);
  }

  /**
   * 出力タイプの変更イベント
   * @param exportInfoType bl-select return value
   */
  onChangeExportInfoType(exportInfoType: string): void {
    this.exportCondition.exportInfoType = exportInfoType;
    this.updateExportPattern(true);
  }

  /**
   * 入力条件を初期化
   */
  private initConditions(): void {
    this.exportCondition = this.exportSalesSlipService.initCondition();
    if (this.productCode === ProductCode.Recycle) {
      this.exportCondition.estimate = false;
      this.exportCondition.order = false;
      this.exportCondition.loan = false;
      this.exportCondition.deposit = false;
    }
  }

  /**
   * 初期値にする
   */
  onClearCondition(): void {
    this.datePickerCondition.startDate = this.startDate;
    this.datePickerCondition.endDate = this.endDate;
    this.exportCondition = this.exportSalesSlipService.initCondition();
    this.displayEndDate = true;
    this.organizationSelectPossible = true;
    this.customerSelectPossible = true;
    this.exportContentChangePossible = true;
    this.onChangeExportInfoType(ExportSlipTypeDiv.Slip);
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
          this.export();
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
   * テキスト出力処理
   */
  private export() {
    const salesSlipExportContentList: string[] = [];
    if (this.exportCondition.sales) {
      salesSlipExportContentList.push(this.salesSlipExportContent.Sales);
    }
    if (this.exportCondition.estimate) {
      salesSlipExportContentList.push(this.salesSlipExportContent.Estimate);
    }
    if (this.exportCondition.order) {
      salesSlipExportContentList.push(this.salesSlipExportContent.Order);
    }
    if (this.exportCondition.loan) {
      salesSlipExportContentList.push(this.salesSlipExportContent.Loan);
    }
    if (this.exportCondition.deposit) {
      salesSlipExportContentList.push(this.salesSlipExportContent.Deposit);
    }
    if (!salesSlipExportContentList || salesSlipExportContentList.length === 0) {
      this.dialogService.warn('出力内容が指定されていません。', '確認').subscribe(dialogRef => {
        const el = document.activeElement;
        dialogRef.hide(el);
        this.loadingService.hide();
      });
      return;
    }
    if (!this.exportPatternSelectorComponent.getExportPatternCodeList
       || this.exportPatternSelectorComponent.getExportPatternCodeList().length === 0) {
      this.dialogService.warn('出力パターン情報項目は必須項目です。選択してください。', '確認').subscribe(dialogRef => {
        const el = document.activeElement;
        dialogRef.hide(el);
        this.loadingService.hide();
      });
      return;
    }
    // クエリ検索条件のパラメータ作成を開始
    // QueryStrings ID = 1
    this.exportSalesSlipService.setExportPatternCodeList(this.exportPatternSelectorComponent.getExportPatternCodeList());
    // QueryStrings ID = 2
    this.exportSalesSlipService.setSalesSlipExportContentList(salesSlipExportContentList);
    // QueryStrings ID = 3～7
    this.exportSalesSlipService.setDate(this.exportCondition.startDate, this.exportCondition.endDate, this.exportCondition.targetPeriod);

    // QueryStrings ID = 8～9
    // 組織選択が「 0:売上組織」の場合
    if (this.exportCondition.organizationSelect === SalesSlipOrganizationSelect.SalesOrganization) {
      if (this.productCode === ProductCode.Recycle) {
        this.exportSalesSlipService.setCustomerManageOrganizationCode('');
        this.exportSalesSlipService.setDemandOrganizationCode('');
        this.exportSalesSlipService.setSlipOrganizationCode(this.exportCondition.organization);
      } else {
        this.exportSalesSlipService.setCustomerManageOrganizationCode(this.exportCondition.organization);
        this.exportSalesSlipService.setDemandOrganizationCode('');
        this.exportSalesSlipService.setSlipOrganizationCode('');
      }
    // 組織選択が「 1:請求組織」の場合
    } else {
      this.exportSalesSlipService.setCustomerManageOrganizationCode('');
      this.exportSalesSlipService.setDemandOrganizationCode(this.exportCondition.organization);
      this.exportSalesSlipService.setSlipOrganizationCode('');
    }
    // QueryStrings ID = 10～11
    this.exportSalesSlipService.setPicEmployeeCode(this.exportCondition.picEmployeeCodeS,
      this.exportCondition.picEmployeeCodeE);

    // QueryStrings ID = 12～15
    // 得意先選択が「0:得意先」の場合
    if (this.exportCondition.customerSelect === SalesSlipTargetPeriodDiv.Customer) {
      this.exportSalesSlipService.setCustomerCode(this.exportCondition.billingCodeS, this.exportCondition.billingCodeE);
      this.exportSalesSlipService.setBillingCode('', '');
    // 得意先選択が「1:請求先」の場合
    } else {
      this.exportSalesSlipService.setCustomerCode('', '');
      this.exportSalesSlipService.setBillingCode(this.exportCondition.billingCodeS, this.exportCondition.billingCodeE);
    }
    // QueryStrings ID = 16
    this.exportSalesSlipService.setCutoffDay(this.exportCondition.cutoffDay);

    // テキスト出力伝票タイプ区分が伝票明細タイプの場合
    if (this.exportCondition.exportInfoType === ExportSlipTypeDiv.SlipDetail) {
      // QueryStrings ID = 17～18
      this.exportSalesSlipService.setWhCode(this.exportCondition.whCodeS,
        this.exportCondition.whCodeE);
      // QueryStrings ID = 19～20
      this.exportSalesSlipService.setItemMakerCd(this.exportCondition.itemMakerCdS,
        this.exportCondition.itemMakerCdE);
      // QueryStrings ID = 21
      this.exportSalesSlipService.setSearchItemPartsNumber(this.exportCondition.searchItemPartsNumber);
      // QueryStrings ID = 22
      this.exportSalesSlipService.setSearchItemPartsName(this.exportCondition.searchItemPartsName);
    }
    // QueryStrings ID = 23
    const productCodes = _map(
      _filter(this.systemItems, item => item.value !== ProductCode.Common), product => product.value
    );
    this.exportSalesSlipService.setProductCodes(productCodes);
    // QueryStrings ID = 24
    const clientSessionId = this.appContext.getUuid() + 'salesSlip';
    this.exportSalesSlipService.setClientSessionId(clientSessionId);
    if (!this.webSocketConnected) {
      this.exportService.connectWebSocket(ExportInfoTabDiv.SalesSlip, clientSessionId);
      this.webSocketConnected = true;
    }
    this.loadingService.show({ message: '出力処理中です。<br />しばらくお待ちください。' });
    this.exportSalesSlipService.export().subscribe(_response => { },
      _error => { });
  }

  /**
   * 詳細パネル表示イベント
   */
  onClickDetailButton(): void {
    this.toggleDetailCondition();
  }

  /**
   * 詳細条件表示切替
   */
  private toggleDetailCondition(): void {
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
   * ファイルダウンロードのモーダル画面を表示
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

  /** 管理組織コードリセット */
  resetOrgCode(): void {
    this.exportCondition.organization = this.defaultSelectedOrganizationCode;
  }

  /** 入金サービス */
  get serviceIdOptCmnCredit() {
    return ContractConst.SERVICEID_OPT_CMN_CREDIT;
  }
}
