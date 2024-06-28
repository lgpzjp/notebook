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
import { ExportCustomerSlipService } from './export-customer-slip.service';
import {
  defer as _defer,
  forEach as _forEach,
  filter as _filter,
  map as _map,
} from 'lodash';
import { IExportCustomerSlipConditionInput } from './export-customer-slip.define';
import { ExportCustomerSlipConditionManager } from './export-customer-slip.condition';
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
  DetailCustomerSlipConditionComponent
} from '../../page/export-page/components/detail-customer-slip-condition/detail-customer-slip-condition.component';
import { DownloadModalComponent } from '../../shared/modal/download-modal/download-modal.component';
import { ExportInfoTabDiv } from '@blcloud/bl-datamodel/enum/output/export-info-tab-div';
import { IExportPatternInfo, IOrganizationInformation } from '@blcloud/bl-datamodel';
import { RoleConst } from '@blcloud/bl-datamodel/const/role';
import { DateTimeUtils } from '@blcloud/bl-common';
import { CustomerExportContentArray, CustomerExportContent } from '@blcloud/bl-datamodel/enum/customer/customer-export-content';
import { ProductCode } from '@blcloud/bl-datamodel/enum/common/product-code';

/**
 * 得意先伝票コンポーネント
 */
@Component({
  selector: 'app-export-customer-slip',
  templateUrl: './export-customer-slip.component.html',
  styleUrls: ['./export-customer-slip.component.scss'],
  providers: [ExportCustomerSlipService, ExportCustomerSlipConditionManager]
})
export class ExportCustomerSlipComponent extends AbstractContainer implements OnInit {
  /** 詳細条件表示有無 */
  private isShowDetail = false;
  /** WebSocket接続済み */
  private webSocketConnected = false;
  /** 全社設定取得区分 */
  public readonly withAllCompanyDiv = WithAllCompanyDiv;
  /** 得意先伝票出力条件 */
  public exportCondition: IExportCustomerSlipConditionInput;
  /** テキスト出力情報タブ区分 */
  public readonly exportInfoTabDiv = ExportInfoTabDiv;
  /** 開始日付 */
  public startDate: string;
  /** 終了日付 */
  public endDate: string;
  /** 詳細条件表示有無 */
  public showDetailFlg = true;
  /** 詳細画面フラグ */
  public detailDateCode = '0';
  /** 出力内容 */
  public readonly customerExportContentArray = CustomerExportContentArray;
  /** 画面初期化完了フラグ */
  defaultSelectedOrganizationCode = '0';

  /** データ出力パターン */
  @Input() dataExportPatterns: IExportPatternInfo[];
  /** 業務選択肢 */
  @Input() systemItems: {value: string, text: string}[];
  /** 初期選択プロダクトコード */
  @Input() productCode: string;

  /** タブフォーカスキーボードイベント */
  @Output() tabFocusKeyboardEvent = new EventEmitter();
  /** データ出力パターン変更イベント */
  @Output() changeExportPatternEvent: EventEmitter<IExportPatternInfo[]> = new EventEmitter();

  /** 検索条件コンポーネント一覧 */
  @ViewChildren('detailConditionCustomerSlip') conditionsList: QueryList<AbstractConditionsComponent>;
  /** データ出力パターン選択コンポーネント */
  @ViewChild(ExportPatternSelectorComponent) exportPatternSelectorComponent: ExportPatternSelectorComponent;
  /** 日付入力コンポーネント */
  @ViewChild(DatePickerConditionComponent) datePickerCondition: DatePickerConditionComponent;
  /** 詳細条件コンポーネント */
  @ViewChild(DetailCustomerSlipConditionComponent) detailCustomerCondition: DetailCustomerSlipConditionComponent;


  constructor(
    private exportCustomerService: ExportCustomerSlipService,
    private dialogService: BlDialogService,
    private loadingShow: BlLoadingService,
    private appContext: BlAppContext,
    private exportService: ExportPageService,
    private modalService: BlModalService,
    private loginResourceService: LoginResourceService,
  ) {
    super();
    this.exportService.invokeEventTabCustomerSlip.subscribe(dataDownload => {
      this.showModalDownload(<IExportPatternInfo[]>this.dataExportPatterns,
        dataDownload.infoDataDownload);
    });
  }

  /**
   * 初期化
   */
  ngOnInit() {
    this.initConditions();
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
   * 出力内容イベント
   * @param event
   */
  onChangeOutputInfo(event: string): void {
    if (event === CustomerExportContent.Customer) {
      this.detailCustomerCondition.billingFlg = true;
      this.detailCustomerCondition.SupplierFlg = false;
      this.detailCustomerCondition.targetPeriodItems = this.detailCustomerCondition.targetPeriodCustomer;
      this.detailCustomerCondition.onChangeCustomerDealsDiv(this.exportCondition.customerDealsDiv);
      this.showDetailFlg = true;
    } else if (event === CustomerExportContent.Supplier) {
      this.detailCustomerCondition.billingFlg = false;
      this.detailCustomerCondition.SupplierFlg = true;
      this.detailCustomerCondition.targetPeriodItems = this.detailCustomerCondition.targetPeriodSupplier;
      this.showDetailFlg = true;
      this.detailCustomerCondition.onChangeSupplierDealsDiv(this.exportCondition.supplierDealsDiv);
    } else {
      if (this.isShowDetail) {
        this.onClickDetailButton();
      }
      this.showDetailFlg = false;
    }
    this.exportCondition.outputInfo = event;
    this.updateExportPattern(true);
  }

  /**
   * 管理組織の変更イベント
   * @param $event
   */
  onChangeOrgCode($event: IOrganizationInformation): void {
    this.exportCondition.organizationCode = $event.organizationCode;
  }

  /**
   * 入力条件を初期化
   */
  private initConditions(): void {
    this.exportCondition = this.exportCustomerService.initCondition();
  }

  /**
   * 初期値にする
   */
  onClearCondition(): void {
    this.datePickerCondition.startDate = this.startDate;
    this.datePickerCondition.endDate = this.endDate;
    this.detailCustomerCondition.onChangeData();
    this.exportCondition.outputInfo = CustomerExportContent.Customer;
    this.updateExportPattern(true);
    this.exportCondition = this.exportCustomerService.initCondition();
    this.onChangeOutputInfo(this.exportCondition.outputInfo);
    this.detailCustomerCondition.isShowTargetPeriodFlg = false;
    this.detailCustomerCondition.onChangeCustomerDealsDiv(this.exportCondition.customerDealsDiv);
    this.detailCustomerCondition.onChangeSupplierDealsDiv(this.exportCondition.supplierDealsDiv);
    this.onClickDetailButton();
  }

  /**
   * 出力ボタンを押下する時のイベント
   */
  onClickExport(): void {
    // ロール確認
    this.loadingShow.show();
    this.loginResourceService.isAvailableFunction(RoleConst.ROLEID_FUNC_ALL_CUSTOMER_TEXT_OUTPUT).subscribe(
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
    if (!this.exportCondition.outputInfo || this.exportCondition.outputInfo === '') {
      this.dialogService.warn('出力内容が指定されていません。', '確認').subscribe(dialogRef => {
        const el = document.activeElement;
        dialogRef.hide(el);
        this.loadingShow.hide();
      });
      return;
    }
    const productCodes = _map(
      _filter(this.systemItems, item => item.value !== ProductCode.Common), product => product.value
    );
    this.exportCustomerService.setProductCodes(productCodes);
    this.exportCustomerService.setExportPatternCode(this.exportPatternSelectorComponent.getExportPatternCodeList());
    this.exportCustomerService.setCustomerExportContent(this.exportCondition.outputInfo);
    this.exportCustomerService.setUpdateDateTime(this.exportCondition.startDate, this.exportCondition.endDate);
    this.exportCustomerService.setOrganizationCode(this.exportCondition.organizationCode);
    this.exportCustomerService.setCustomerCode(this.exportCondition.billingCodeStart,
    this.exportCondition.billingCodeEnd);
    this.exportCustomerService.setSupplierCd(this.exportCondition.supplierCdStart,
    this.exportCondition.supplierCdEnd);
    this.exportCustomerService.setCutoffDay(this.exportCondition.cutoffDay);
    if (this.exportCondition.outputInfo === CustomerExportContent.Customer) {
      this.exportCustomerService.setDate(this.exportCondition.startDateDetail,
      this.exportCondition.endDateDetail, this.exportCondition.targetPeriod, this.exportCondition.outputInfo);
      this.exportCustomerService.setCustomerDealsDiv(this.exportCondition.customerDealsDiv);
    }
    if (this.exportCondition.outputInfo === CustomerExportContent.Supplier) {
      this.exportCustomerService.setSupplierDealsDiv(this.exportCondition.supplierDealsDiv);
      this.exportCustomerService.setDate(this.exportCondition.startDateDetail,
      this.exportCondition.endDateDetail, this.exportCondition.targetPeriod, this.exportCondition.outputInfo);
    }
    const clientSessionId = this.appContext.getUuid() + 'customer';
    this.exportCustomerService.setClientSessionId(clientSessionId);
    if (!this.webSocketConnected) {
      this.exportService.connectWebSocket(ExportInfoTabDiv.Customer, clientSessionId);
      this.webSocketConnected = true;
    }

    this.loadingShow.show({ message: '出力処理中です。<br />しばらくお待ちください。' });
    this.exportCustomerService.export().subscribe(_response => { },
      _error => { });
  }

  /**
   * 詳細パネル表示イベント
   */
  onClickDetailButton(): void {
    if (this.exportCondition.outputInfo === CustomerExportContent.Customer) {
      this.detailCustomerCondition.targetPeriodItems = this.detailCustomerCondition.targetPeriodCustomer;
      this.detailCustomerCondition.onChangeCustomerDealsDiv(this.exportCondition.customerDealsDiv);
    } else if (this.exportCondition.outputInfo === CustomerExportContent.Supplier) {
      this.detailCustomerCondition.targetPeriodItems = this.detailCustomerCondition.targetPeriodSupplier;
      this.detailCustomerCondition.onChangeCustomerDealsDiv(this.exportCondition.supplierDealsDiv);
    }
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

  /** 開始日変更イベント */
  onStartDateChange($event: string): void {
    this.exportCondition.startDate = $event;
  }

  /** 終了日変更イベント */
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
    this.detailCustomerCondition.startDateDetail = DateTimeUtils.formatIso(DateTimeUtils.addMonths(today, - 1));
    // 当年月日
    this.endDate = DateTimeUtils.formatIso(today);
    this.detailCustomerCondition.endDateDetail = DateTimeUtils.formatIso(today);
  }
}
