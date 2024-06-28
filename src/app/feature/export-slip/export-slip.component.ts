import {
  Component,
  OnInit,
  ViewChild,
  EventEmitter,
  Output,
  QueryList,
  ViewChildren,
  Input,
} from '@angular/core';
import {
  AbstractContainer, BlDialogService, BlLoadingService, BlModalService
} from '@blcloud/bl-ng-ui-component';
import { ExportSlipService } from './export-slip.service';
import {
  defer as _defer,
  forEach as _forEach,
  filter as _filter,
  map as _map
} from 'lodash';
import { IExportSlipConditionInput, IDropDownInput } from './export-slip.define';
import { ExportSlipConditionManager } from './export-slip.condition';
import {
  PageId,
  WithAllCompanyDiv,
  LoginResourceService,
} from '@blcloud/bl-ng-share-module';
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
import { ProductCode } from '@blcloud/bl-datamodel/enum/common/product-code';
import { SlipKind } from '@blcloud/bl-datamodel/enum/sales/slip-kind';
import { ExportWorkTypeDiv, ExportWorkTypeDivMap } from '@blcloud/bl-datamodel/enum/output/export-work-type-div';
import { OrganizationCtrlDiv } from '@blcloud/bl-datamodel/enum/company/organization-ctrl-div';
import { ExportInfoTabDiv } from '@blcloud/bl-datamodel/enum/output/export-info-tab-div';
import { IExportPatternInfo } from '@blcloud/bl-datamodel';
import { RoleConst } from '@blcloud/bl-datamodel/const/role';

@Component({
  selector: 'app-export-slip',
  templateUrl: './export-slip.component.html',
  styleUrls: ['./export-slip.component.scss'],
  providers: [ExportSlipService, ExportSlipConditionManager]
})
export class ExportSlipComponent extends AbstractContainer implements OnInit {
  private isShowDetail = false;

  private documentMode = true;

  private webSocketConnected = false;

  public readonly withAllCompanyDiv = WithAllCompanyDiv;

  public exportCondition: IExportSlipConditionInput;

  public targetPeriodItems: IDropDownInput[];

  public exportInfoTypeItems: IDropDownInput[] = [
    { code: ExportWorkTypeDiv.MainWorkType, name: ExportWorkTypeDivMap[ExportWorkTypeDiv.MainWorkType] },
    { code: ExportWorkTypeDiv.DetailWorkType, name: ExportWorkTypeDivMap[ExportWorkTypeDiv.DetailWorkType] }
  ];

  public salseRecordedOrganizationItems = [
    { code: OrganizationCtrlDiv.BillingAdd, name: '請求計上組織' },
    { code: OrganizationCtrlDiv.ResultsAdd, name: '実績計上組織' }
  ];

  /**
   * 『伝票種別』を表します。
   */
  public readonly slipKind = SlipKind;
  public readonly slipKindLabel = {
    Quotation: '見積書',
    Directions: '指示書',
    Invoice: '納品書'
  };

  public selectedOrganizationCode: string;

  defaultSelectedOrganizationCode: string;

  constructor(
    private exportSlipService: ExportSlipService,
    private dialogService: BlDialogService,
    private loadingService: BlLoadingService,
    private appContext: BlAppContext,
    private exportService: ExportPageService,
    private modalService: BlModalService,
    private loginResourceService: LoginResourceService
  ) {
    super();
    this.exportService.invokeEventTabSlip.subscribe(dataDownload => {
      this.showModalDownload(<IExportPatternInfo[]>this.dataExportPatterns,
        dataDownload.infoDataDownload);
    });
  }
  @ViewChildren('detailConditionSlip') conditionsList: QueryList<AbstractConditionsComponent>;
  @ViewChild(ExportPatternSelectorComponent) exportPatternSelectorComponent: ExportPatternSelectorComponent;
  @ViewChild(DatePickerConditionComponent) datePickerCondition: DatePickerConditionComponent;
  @Output() tabFocusKeyboardEvent = new EventEmitter();
  @Output() changeExportPatternEvent: EventEmitter<IExportPatternInfo[]> = new EventEmitter();
  @Input() dataExportPatterns: IExportPatternInfo[];

  /** 初期選択プロダクトコード */
  @Input() productCode: string;

  /** 業務選択肢 */
  @Input() systemItems: {value: string, text: string}[];

  /** プロダクトコード内部値 */
  _productCode: string;

  /** プロダクトコード内部値 */
  private outputProductCodes: string[];

  /**
   * 初期化
   */
  ngOnInit() {
    this.initConditions();

    // ログイン組織コードを取得
    this.exportService.getLoginUserInfo().subscribe(
      loginUser => {
        this.selectedOrganizationCode = loginUser.organizationCode;
        this.defaultSelectedOrganizationCode = loginUser.organizationCode;
      }
    );
  }

  /**
   * テキスト出力を更新
   * @param isLoadOld load pattern selected on old session
   */
  updateExportPattern(isLoadOld: boolean = false): void {
    this.exportPatternSelectorComponent.genTableExportPatternData(isLoadOld);
  }

  /**
   * 見積書の変更イベント | 出力内容
   * @param event
   */
  onChangeSlipKindQuotation(event: Event): void {
    if ((<HTMLInputElement>event.target).checked) {
      this.exportCondition.slipKindQuotation = true;
    } else {
      this.exportCondition.slipKindQuotation = false;
    }
  }

  /**
   * 指示書の変更イベント | 出力内容
   * @param event
   */
  onChangeSlipKindDirections(event: Event): void {
    if ((<HTMLInputElement>event.target).checked) {
      this.exportCondition.slipKindDirections = true;
    } else {
      this.exportCondition.slipKindDirections = false;
    }
  }

  /**
   * 納品書の変更イベント | 出力内容
   * @param event
   */
  onChangeSlipKindInvoice(event: Event): void {
    if ((<HTMLInputElement>event.target).checked) {
      this.exportCondition.invoice = true;
    } else {
      this.exportCondition.invoice = false;
    }
  }

  /**
   * 対象期間の変更イベント
   * @param event
   */
  onChangeTargetPeriod(event: number): void {
    if (event === 1) {
      this.documentMode = true;
    } else {
      this.documentMode = false;
    }
    this.exportSlipService.setDocumentMode(this.documentMode);
  }

  /**
   * 出力タイプの変更イベント
   * @param v bl-select return value
   */
  onChangeExportInfoType(v: string): void {
    this.exportCondition.exportInfoType = v;
    this.updateExportPattern(true);
  }

  /**
   * 管理組織の変更イベント
   * @param o
   */
  onChangeSlipMgtStdOrgCode($event): void {
    this.selectedOrganizationCode = $event.organizationCode;
  }

  /**
   * 拠点選択の変更イベント
   * @param v
   */
  onChangeSalseRecordedOrganization(v: string): void {
    this.exportCondition.salseRecordedOrganization = v;
  }

  /**
   * 顧客・車両情報 の変更イベント
   * @param event EventEmiter
   */
  onChangeExportCustomerVehicleOption(event: Event): void {
    if ((<HTMLInputElement>event.target).checked) {
      this.exportCondition.exportCustomerVehicle = true;
    } else {
      this.exportCondition.exportCustomerVehicle = false;
    }
    this.updateExportPattern(true);
  }

  /**
   * 入力条件を初期化
   */
  private initConditions(): void {
    this.exportCondition = this.exportSlipService.initCondition();
    this.targetPeriodItems = this.exportSlipService.initTargetPeriodItems();
    this.setProductCode(this.productCode);
  }

  /**
   * exportCustomerVehicle & salseRecordedOrganizationを初期値にする
   */
  onClickClearCondition(): void {
    this.exportCondition.exportCustomerVehicle = false;
    this.selectedOrganizationCode = this.defaultSelectedOrganizationCode;
    this.datePickerCondition.clear();
    this.updateExportPattern(true);
    this.setProductCode(this.productCode);
  }

  /**
   * 出力ボタンを押下する時のイベント
   */
  onClickExport(): void {
    const slipKind: string[] = [];
    if (this.exportCondition.slipKindQuotation) {
      slipKind.push(this.slipKind.EstimatesSlip);
    }
    if (this.exportCondition.slipKindDirections) {
      slipKind.push(this.slipKind.SalesOrderSlip);
    }
    if (this.exportCondition.invoice) {
      slipKind.push(this.slipKind.SalesSlip);
    }

    if (!slipKind || slipKind.length === 0) {
      this.dialogService.warn('出力内容が指定されていません。', '確認').subscribe(dialogRef => {
        const el = document.activeElement;
        dialogRef.hide(el);
      });
      return;
    }

    // ロール確認
    this.loadingService.show();
    this.loginResourceService.isAvailableFunction(RoleConst.ROLEID_FUNC_ALL_SALESSLIP_TEXT_OUTPUT).subscribe(
      isAvailable => {
        if (isAvailable) {
          this.export(slipKind);
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
   * @param slipKind 出力内容配列
   */
  private export(slipKind: string[]) {
    this.exportSlipService.setSlipKind(slipKind);
    this.exportSlipService.setExportPatternCode(this.exportPatternSelectorComponent.getExportPatternCodeList());
    this.exportSlipService.setDate(this.exportCondition.startDate, this.exportCondition.endDate, this.documentMode);
    if (this.exportCondition.salseRecordedOrganization === OrganizationCtrlDiv.BillingAdd) {
      this.exportSlipService.setSalseRecordedBillingsOrganizationCode(this.selectedOrganizationCode);
      this.exportSlipService.setSalseRecordedResultsOrganizationCode('');
    } else {
      this.exportSlipService.setSalseRecordedResultsOrganizationCode(this.selectedOrganizationCode);
      this.exportSlipService.setSalseRecordedBillingsOrganizationCode('');
    }
    this.exportSlipService.setExportCustomerVehicle(Number(this.exportCondition.exportCustomerVehicle));
    this.exportSlipService.setProductCodes(this.outputProductCodes);
    const clientSessionId = this.appContext.getUuid() + 'slip';
    this.exportSlipService.setClientSessionId(clientSessionId);
    if (!this.webSocketConnected) {
      this.exportService.connectWebSocket(ExportInfoTabDiv.Slip, clientSessionId);
      this.webSocketConnected = true;
    }

    this.loadingService.show({ message: '出力処理中です。<br />しばらくお待ちください。' });
    this.exportSlipService.export().subscribe(
      _response => {
        const exportPatternList = this.exportPatternSelectorComponent.exportPatternList;
        const exportInfoDivEnumName = exportPatternList[exportPatternList.length - 1].exportInfoDivEnumName;
        // 操作履歴ログの登録
        this.exportService.postOperationHistoryLog(PageId.ExportSlip, exportInfoDivEnumName);
      },
      _error => { }
    );
  }

  /**
   * 詳細パネル表示イベント
   */
  onPanelShown(): void {
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

  /* ファイルダウンロードのモダール画面を表示
  * exportInfoDivEnumNameを取り出す@param dataDivSortExportTab1
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

  onStartDateChange($event: string): void {
    this.exportCondition.startDate = $event;
  }

  onEndDateChange($event: string): void {
    this.exportCondition.endDate = $event;
  }

  onChangeDataExportPattern(data: IExportPatternInfo[]) {
    this.dataExportPatterns = data;
    this.changeExportPatternEvent.emit(data);
  }

  /**
   * 業務変更イベントハンドラ
   * @param productCode プロダクトコード
   */
  onChangeSystem(productCode: string) {
    this.setProductCode(productCode);
  }

  /**
   * プロダクトコード設定
   * @param productCode プロダクトコード
   */
  private setProductCode(productCode: string) {
    this._productCode = productCode;
    if (this._productCode === ProductCode.Common) {
      this.outputProductCodes = _map(
        _filter(this.systemItems, item => item.value !== ProductCode.Common), product => product.value
      );
    } else {
      this.outputProductCodes = [this._productCode];
    }
  }
}
