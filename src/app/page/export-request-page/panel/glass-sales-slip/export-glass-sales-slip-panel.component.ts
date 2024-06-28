import { Component, EventEmitter, Injector, Output, ViewChild } from '@angular/core';

import { IGenericExportInstruction } from '@blcloud/bl-datamodel/entity/output/generic-export-instruction';
import { ExportInfoDiv, ExportInfoDivArray, ExportInfoDivMap } from '@blcloud/bl-datamodel/enum/output/export-info-div';
import { ExportInfoTabDiv } from '@blcloud/bl-datamodel/enum/output/export-info-tab-div';
import { cloneDeep as _cloneDeep, isNil as _isNil, forEach as _forEach } from 'lodash';
import { of as RxOf } from 'rxjs/observable/of';

import { AbstractExportPanel } from '../abstract-export-panel.component';
import {
  ExportOrderDiv,
  ExportOrderDivArray,
  ExportPartsWorkDiv,
  ExportPartsWorkDivArray,
  ExportSlipTypeDiv,
  ExportSlipTypeDivArray,
  IExportGlassSalesSlipConditionInput
} from './export-glass-sales-slip.define';
import { DateTimeUtils } from '@blcloud/bl-common';
import { SalesSlipSupplierSelect, SalesSlipSupplierSelectArray } from '@blcloud/bl-datamodel/enum/sales/sales-slip-supplier-select';
import { CompanyConst } from '@blcloud/bl-datamodel/const/company';
import { OutputDiv, OutputDivArray } from '@blcloud/bl-datamodel/enum/common/output-div';
import { GlassSalesSlipDivScreen, GlassSalesSlipDivScreenMap } from '@blcloud/bl-datamodel/enum/sales/glass-sales-slip-div-screen';
import { ProductCode } from '@blcloud/bl-datamodel/enum/common/product-code';
import { OpeHistoryResource } from '@blcloud/bl-ng-resource';
import { CustomerInfo, ICodeDivNameMgtBody, ICustomerInfo, IOpeHistory } from '@blcloud/bl-datamodel';
import { FunctionCategoryDiv } from '@blcloud/bl-datamodel/enum/bizcmn/function-category-div';
import { OpeDiv } from '@blcloud/bl-datamodel/enum/bizcmn/ope-div';
import { LogicalDeleteDiv } from '@blcloud/bl-datamodel/enum/common/logical-delete-div';
import { catchError } from 'rxjs/operators';
import { ExportPanelContainerComponent } from '../../container/export-panel-container.component';
import { Observable } from 'rxjs/Observable';
import { IselectObject, SelectTypeEnum } from '../../../../shared/input/range-organization/range-organization.define';
import { RangeOrganizationComponent } from '../../../../shared/input/range-organization/range-organization.component';
import { IExportGlassExportSearchInfo } from '../../export-request-page.define';
import { EmployeeGuideComponent, FunctionRole, UserGuideComponent } from '@blcloud/bl-ng-share-module';
import { CustomerGuideComponent, CustomerGuideKeys } from '@blcloud/bl-ng-vehicle-customer-module';
import { BlModalRef, BlNumberInputComponent, BlTextInputComponent, ModalReason } from '@blcloud/bl-ng-ui-component';
import { ExportGlassSalesSlipPanelService } from './export-glass-sales-slip-panel.service';
import { CodeDivGenre } from '@blcloud/bl-datamodel/enum/common/code-div-genre';

/**
 * 売上データ出力コンテナコンポーネント
 */
@Component({
  selector: 'app-export-glass-sales-slip-panel',
  templateUrl: 'export-glass-sales-slip-panel.component.html',
  styleUrls: ['export-glass-sales-slip-panel.component.scss']
})
export class ExportGlassSalesSlipPanelComponent extends AbstractExportPanel {

  /** 組織情報(範囲指定/個別指定) */
  public organizationObject: IselectObject = {
    selectType: SelectTypeEnum.RANGE,
    focus: null,
    organizationCodeFrom: null,
    organizationCodeTo: null,
    organizationList: [null, null, null, null, null, null, null, null, null, null],
    allOrganizationCode: [CompanyConst.ORGANIZATION_CODE_ALL_COMPANY]
  };

  /** データ出力パターン選択コンポーネント */
  @ViewChild(ExportPanelContainerComponent) exportPanelContainerComponent: ExportPanelContainerComponent;
  /** 組織 個別/範囲指定切り替えコンポーネント */
  @ViewChild(RangeOrganizationComponent) private RangeOrganization: RangeOrganizationComponent;
  @ViewChild('creditSales') private creditSales;

  /** 得意先 */
  @ViewChild('customerCodeStart') customerCodeStart: BlNumberInputComponent;
  /** 担当者 */
  @ViewChild('picEmployeeCodeStart') picEmployeeCodeStart: BlTextInputComponent;
  /** 業種 */
  @ViewChild('businessCodeStart') businessCodeStart: BlNumberInputComponent;
  /** 地区 */
  @ViewChild('areaCdStart') areaCdStart: BlNumberInputComponent;

  /* ガイド非活性イベント */
  @Output() guideDisabledEvent: EventEmitter<object> = new EventEmitter();

  /** 出力情報タブ区分 */
  exportInfoTabDiv = ExportInfoTabDiv.GlassSalesSlip;

  /** 出力情報区分 */
  exportInfoDiv = ExportInfoDiv.SalesSlip;

  /** 出力情報名称 */
  exportInfoName = ExportInfoDivMap[ExportInfoDiv.SalesSlip];

  /** 出力情報項目リスト */
  _exportInfoItems = ExportInfoDivArray.filter(info => info.value === ExportInfoDiv.SalesSlip);

  /** 出力内容リスト */
  salesSlipDivList: string[] = [];

  _SearchInfo: IExportGlassExportSearchInfo = {};

  /** 対象期間 */
  public readonly SalesSlipSupplierSelectArray = SalesSlipSupplierSelectArray;

  /** 出力タイプ */
  public readonly ExportSlipTypeDivArray = ExportSlipTypeDivArray;

  /** 『部品作業区分』配列 */
  public readonly ExportPartsWorkDivArray = ExportPartsWorkDivArray;

  /** 『出力区分』配列 */
  public readonly OutputDivArray = OutputDivArray;

  /** 『出力伝票タイプ区分』配列 */
  public readonly ExportSlipTypeDiv = ExportSlipTypeDiv;

  /** 『順序区分』の配列 */
  public readonly ExportOrderDivArray = ExportOrderDivArray;

  /** 『硝子商売上伝票区分』を表します。 */
  public readonly glassSalesSlipDivScreen = GlassSalesSlipDivScreen;

  /** 『硝子商売上伝票区分』の連想配列情報 */
  public readonly glassSalesSlipDivScreenMap = GlassSalesSlipDivScreenMap;

  /** ガイド用フォーカスエレメント */
  preFocusElement = null;

  /** 組織情報用フォーカスエレメント */
  isFocusRangeOrganization = false;

  /** フォーカス中のガイドボタン */
  private currentGuideBt: HTMLButtonElement;

  /** ガイドに表示される名前 */
  customerNameStart = null;
  customerNameEnd = null;
  picEmployeeNameStart = null;
  picEmployeeNameEnd = null;
  areaNameStart = null;
  areaNameEnd = null;
  dispBusinessNameStart = null;
  dispBusinessNameEnd = null;

  _condition: IExportGlassSalesSlipConditionInput = {
    targetPeriod: SalesSlipSupplierSelect.SlipDate,
    startDate: DateTimeUtils.formatIso(DateTimeUtils.today()),
    endDate: DateTimeUtils.formatIso(DateTimeUtils.today()),
    exportInfoType: ExportSlipTypeDiv.Slip,
    glassClassDiv: ExportPartsWorkDiv.All,
    outPutOrderDiv: ExportOrderDiv.OrderDiv0,
    outPutHeaderDiv: OutputDiv.Output,
    creditSales: true,
    creditReturned: true,
    cashSales: true,
    cashReturned: true,
    claim: false,
    direction: false,
    temporarySave: false,
    organization: CompanyConst.ORGANIZATION_CODE_ALL_COMPANY,
    productCode: ProductCode.Glass,
    cutoffDay: 0
  };

  constructor(
    injector: Injector,
    private opeHistoryResource: OpeHistoryResource,
    private exportGlassSalesSlipPanelService: ExportGlassSalesSlipPanelService,
  ) {
    super(injector);
  }

  /**
   * 操作履歴ログを登録します。
   */
  protected postOperationHistoryLog() {
    const entity: IOpeHistory = {
      productCode: ProductCode.Glass,
      logicalDeleteDiv: LogicalDeleteDiv.Valid,
      functionCategoryDiv: FunctionCategoryDiv.Entry,
      blTenantId: this.loginUser.blTenantId,
      organizationCode: this.loginUser.organizationCode,
      organizationName: this.loginUser.organizationName,
      createEmployeeCode: this.loginUser.employeeCode,
      createEmployeeName: this.loginUser.employeeName,
      opeHistoryFunctionName: 'データ出力',
      opeDiv: OpeDiv.NotPrint,
      opeHistoryDtlValueList: [`出力データ：${this.exportInfoName}`],
    };

    this.opeHistoryResource.post<IOpeHistory>(entity).pipe(
      catchError(() => {
        return RxOf(null);
      })
    ).subscribe();
  }

  /**
   * 条件を初期化します。
   */
  protected initCondition(): void {
    this._condition.startDate = DateTimeUtils.formatIso(DateTimeUtils.today());
    this._condition.endDate = DateTimeUtils.formatIso(DateTimeUtils.today());
    this._condition.targetPeriod = SalesSlipSupplierSelect.SlipDate;
    this._condition.exportInfoType = ExportSlipTypeDiv.Slip;
    this._condition.glassClassDiv = ExportPartsWorkDiv.All;
    this._condition.outPutOrderDiv = ExportOrderDiv.OrderDiv0;
    this._condition.outPutHeaderDiv = OutputDiv.Output;
    this._condition.creditSales = true;
    this._condition.creditReturned = true;
    this._condition.cashSales = true;
    this._condition.cashReturned = true;
    this._condition.claim = false;
    this._condition.direction = false;
    this._condition.temporarySave = false;
    this._condition.organization = CompanyConst.ORGANIZATION_CODE_ALL_COMPANY;
    this._condition.productCode = ProductCode.Glass;
    this._condition.customerCodeS = null;
    this._condition.customerCodeE = null;
    this._condition.picEmployeeCodeS = null;
    this._condition.picEmployeeCodeE = null;
    this._condition.areaCdS = null;
    this._condition.areaCdE = null;
    this._condition.dispBusinessCodeS = null;
    this._condition.dispBusinessCodeE = null;
    this._condition.cutoffDay = 0;
    this.exportInfoDiv = ExportInfoDiv.SalesSlip;
    this.exportInfoName = ExportInfoDivMap[ExportInfoDiv.SalesSlip];
    this._exportInfoItems = ExportInfoDivArray.filter(info => info.value === ExportInfoDiv.SalesSlip);
    this.RangeOrganization.doClear();
  }

  /**
   * 対象期間の変更イベント
   * @param event
   */
  onChangeTargetPeriod(event: string): void {
    this._condition.targetPeriod = event;
    this._condition.creditSales = true;
    this._condition.creditReturned = true;
    this._condition.cashSales = true;
    this._condition.cashReturned = true;
    this._condition.claim = false;
    this._condition.direction = false;
    this._condition.temporarySave = false;
  }

  /**
   * 出力内容を検証します。
   * 検証OKの場合はnullを返却します。
   * @returns 検証結果メッセージ
   */
  protected validate(): Observable<any> {
    let observer = { message: '', childElement: null };
    this.salesSlipDivList = [];
    if (this._condition.creditSales) {
      this.salesSlipDivList.push(this.glassSalesSlipDivScreen.CreditSales);
    }
    if (this._condition.creditReturned) {
      this.salesSlipDivList.push(this.glassSalesSlipDivScreen.CreditReturned);
    }
    if (this._condition.cashSales) {
      this.salesSlipDivList.push(this.glassSalesSlipDivScreen.CashSales);
    }
    if (this._condition.cashReturned) {
      this.salesSlipDivList.push(this.glassSalesSlipDivScreen.CashReturned);
    }
    if (this._condition.claim) {
      this.salesSlipDivList.push(this.glassSalesSlipDivScreen.Claim);
    }
    if (this._condition.direction) {
      this.salesSlipDivList.push(this.glassSalesSlipDivScreen.Direction);
    }
    if (this._condition.temporarySave) {
      this.salesSlipDivList.push(this.glassSalesSlipDivScreen.TemporarySave);
    }
    if (!this.salesSlipDivList || this.salesSlipDivList.length === 0) {
      observer = { message: '出力内容が指定されていません。', childElement: this.creditSales };
      return RxOf(observer);
    }
    return RxOf(observer);
  }

  /**
   * 出力タイプの変更イベント
   * @param exportInfoType bl-select return value
   */
  onChangeExportInfoType(exportInfoType: string): void {
    this._condition.exportInfoType = exportInfoType;
    if (exportInfoType !== ExportSlipTypeDiv.StatisticalAnalysis) {
      this._condition.dispBusinessCodeS = null;
      this._condition.dispBusinessCodeE = null;
      this._condition.areaCdS = null;
      this._condition.areaCdE = null;
    }
    if (exportInfoType === ExportSlipTypeDiv.SlipDetail) {
      this.exportInfoDiv = ExportInfoDiv.SalesSlipDetail;
      this.exportInfoName = ExportInfoDivMap[ExportInfoDiv.SalesSlipDetail];
      this._exportInfoItems = ExportInfoDivArray.filter(info => info.value === ExportInfoDiv.SalesSlipDetail);
    } else if (exportInfoType === ExportSlipTypeDiv.StatisticalAnalysis) {
      this.exportInfoDiv = ExportInfoDiv.StatisticalAnalysis;
      this.exportInfoName = ExportInfoDivMap[ExportInfoDiv.StatisticalAnalysis];
      this._exportInfoItems = ExportInfoDivArray.filter(info => info.value === ExportInfoDiv.StatisticalAnalysis);
    } else {
      this.exportInfoDiv = ExportInfoDiv.SalesSlip;
      this.exportInfoName = ExportInfoDivMap[ExportInfoDiv.SalesSlip];
      this._exportInfoItems = ExportInfoDivArray.filter(info => info.value === ExportInfoDiv.SalesSlip);
    }
  }

  /**
   * 掛売上の変更イベント | 出力内容
   * @param event
   */
  onChangeSlipExportContentCreditSales(event: Event): void {
    this._condition.creditSales = (<HTMLInputElement>event.target).checked;
  }

  /**
  * 掛返品の変更イベント | 出力内容
  * @param event
  */
  onChangeSlipExportContentCreditReturned(event: Event): void {
    this._condition.creditReturned = (<HTMLInputElement>event.target).checked;
  }

  /**
   * 現金売上の変更イベント | 出力内容
   * @param event
   */
  onChangeSlipExportContentCashSales(event: Event): void {
    this._condition.cashSales = (<HTMLInputElement>event.target).checked;
  }

  /**
   * 現金返品の変更イベント | 出力内容
   * @param event
   */
  onChangeSlipExportContentCashReturned(event: Event): void {
    this._condition.cashReturned = (<HTMLInputElement>event.target).checked;
  }

  /**
   * クレームの変更イベント | 出力内容
   * @param event
   */
  onChangeSlipExportContentClaim(event: Event): void {
    this._condition.claim = (<HTMLInputElement>event.target).checked;
  }

  /**
   * 指示書の変更イベント | 出力内容
   * @param event
   */
  onChangeSlipExportContentDirection(event: Event): void {
    this._condition.direction = (<HTMLInputElement>event.target).checked;
  }

  /**
   * 一時保存の変更イベント | 出力内容
   * @param event
   */
  onChangeSlipExportContentTemporarySave(event: Event): void {
    this._condition.temporarySave = (<HTMLInputElement>event.target).checked;
  }

  /**
   * 部品作業区分変更イベントヘッダ行選択
   * @param $event
   */
  onChangeGlassClassDiv($event: number): void {
    this._condition.glassClassDiv = $event;
  }

  /**
   * 変更イベントヘッダ行選択
   * @param $event
   */
  onChangeOutPutHeaderDiv($event: string): void {
    this._condition.outPutHeaderDiv = $event;
  }

  /**
   * 順序区分変更イベントヘッダ行選択
   * @param $event
   */
  onChangeOutPutOrderDiv($event: string): void {
    this._condition.outPutOrderDiv = $event;
  }

  /**
   * クエリパラメータを生成します。
   */
  protected makeGenericExportInstruction(): IGenericExportInstruction {
    // 売上伝票区分情報配列
    this._SearchInfo.salesSlipDivList = this.salesSlipDivList;
    // 対象期間
    this._SearchInfo.dataExportTargetPeriodDiv = this._condition.targetPeriod;
    // 硝子テキスト出力伝票タイプ区分
    this._SearchInfo.glassExportSlipTypeDiv = this._condition.exportInfoType;
    // データ出力対象期間(開始)
    this._SearchInfo.dataExportTargetPeriodStDate = this._condition.startDate;
    // データ出力対象期間(終了)
    this._SearchInfo.dataExportTargetPeriodEdDate = this._condition.endDate;

    if (this.organizationObject.selectType === SelectTypeEnum.RANGE) {
      // 組織コード(開始)
      this._SearchInfo.organizationCodeStart = this.organizationObject.organizationCodeFrom;
      // 組織コード(終了)
      this._SearchInfo.organizationCodeEnd = this.organizationObject.organizationCodeTo;
    } else if (this.organizationObject.selectType === SelectTypeEnum.INDIVIDUAL) {
      // 組織コード配列
      this._SearchInfo.organizationCodeList = this.cutOrganizationList(this.organizationObject.organizationList);
    }
    // 顧客コード(開始)
    this._SearchInfo.customerCodeStart = this._condition.customerCodeS;
    // 顧客コード(終了)
    this._SearchInfo.customerCodeEnd = this._condition.customerCodeE;
    // 担当従業員コード(開始)
    this._SearchInfo.picEmployeeCodeStart = this._condition.picEmployeeCodeS;
    // 担当従業員コード(終了)
    this._SearchInfo.picEmployeeCodeEnd = this._condition.picEmployeeCodeE;
    if (this._condition.exportInfoType === ExportSlipTypeDiv.StatisticalAnalysis) {
      // 業種コード(開始)
      this._SearchInfo.businessCodeStart = this._condition.dispBusinessCodeS;
      // 業種コード(終了)
      this._SearchInfo.businessCodeEnd = this._condition.dispBusinessCodeE;
    }
    if (this._condition.exportInfoType === ExportSlipTypeDiv.StatisticalAnalysis) {
      // 地区コード(開始)
      this._SearchInfo.areaCdStart = this._condition.areaCdS;
      // 地区コード(終了)
      this._SearchInfo.areaCdEnd = this._condition.areaCdE;
    }
    // 締日
    this._SearchInfo.cutoffDay = this._condition.cutoffDay;
    // 硝子分類区分種別
    this._SearchInfo.glassClassDivGetDiv = this._condition.glassClassDiv;
    // CSVヘッダー出力区分
    this._SearchInfo.outPutHeaderDiv = this._condition.outPutHeaderDiv;
    // CSV出力順序区分
    this._SearchInfo.outPutOrderDiv = this._condition.outPutOrderDiv;

    return _cloneDeep({
      exportInfoTabDiv: this.exportInfoTabDiv,
      exportInfoDiv: this.exportInfoDiv,
      extractConditionString: JSON.stringify(this._SearchInfo),
      exportPatternCode: this.exportPatternCode
    });
  }

  /**
   * フォーカス処理
   * @param event 変更値
   */
  onGuideDisabledEvent(event: any): void {
    this.guideDisabledEvent.emit(event);
    if (!event.focus) {
      super.onBlurGuideCondition(this.preFocusElement);
      this.isFocusRangeOrganization = false;
    } else {
      this.preFocusElement = event.focusElement;
      super.onFocusGuideCondition(this.preFocusElement);
      this.isFocusRangeOrganization = true;
    }
  }

  protected showGuide(): void {
    if (this.isFocusRangeOrganization) {
      this.onClickOrganizationGuide(this.preFocusElement);
    } else {
      if (!_isNil(this.currentGuideBt)) {
        this.currentGuideBt.click();
      }
    }
  }

  /**
   * 組織情報設定
   * @param event 組織情報
   */
  onSelectInfoEvent(event: IselectObject): void {
    this.organizationObject = event;
  }

  /**
   * 組織ガイドボタンクリックイベント
   * @param element
   */
  onClickOrganizationGuide(element) {
    this.RangeOrganization.onClickOrganizationGuide(element);
  }

  /**
   * フォーカスイベント処理
   * @param button ガイドボタン
   */
  onFocusEvent(button: HTMLButtonElement) {
    this.currentGuideBt = button;
    this.screenService.enableFnKey(FunctionRole.Guide);
  }

  /**
   * ガイドファンクションを非活性にします
   *
   */
  onBlurEvent(): void {
    this.currentGuideBt = null;
    this.screenService.disableFnKey(FunctionRole.Guide);
  }

  /**
   * 顧客の変更のイベント
   * @param customerCode 顧客コード
   * @param propertyId 項目名
   * @param index 索引
   */
  onChangeCustomerCodeEvent(customerCode: number, propertyId: string, index: number) {
    if (!customerCode) {
      this.setInputCustomerCode(null, index);
      return;
    }
    this._condition[propertyId] = customerCode;
    console.log(JSON.stringify(this._condition));
    if (index === 1 || index === 2) {
      this.exportGlassSalesSlipPanelService.getCustomerInfo(customerCode).subscribe(
        response => {
          this.setInputCustomerCode(response, index);
        }
      );
    }
  }

  /**
   * 顧客の値を設定する
   * @param customerCode 顧客情報
   * @param index 索引
   */
  setInputCustomerCode(customerCode: ICustomerInfo, index: number) {
    if (index === 1) {
      this._condition.customerCodeS = !_isNil(customerCode) ? customerCode.customerCode.toString() : null;
      this.customerNameStart = !_isNil(customerCode) ? CustomerInfo.dispCustomerName(customerCode) : null;
    } else if (index === 2) {
      this._condition.customerCodeE = !_isNil(customerCode) ? customerCode.customerCode.toString() : null;
      this.customerNameEnd = !_isNil(customerCode) ? CustomerInfo.dispCustomerName(customerCode) : null;
    }
  }

  /**
   * 顧客ガイドを押下するイベント
   * @param index 索引
   */
  onClickCustomerCodeGuideEvent(index: number) {
    const activeElement = document.activeElement;

    let initValue: number;
    let keyItem: String;
    switch (index) {
      case 1:
        initValue = this._condition.customerCodeS ? Number(this._condition.customerCodeS) : null;
        keyItem = CustomerGuideKeys.customerCode;
        break;
      case 2:
        initValue = this._condition.customerCodeE ? Number(this._condition.customerCodeE) : null;
        keyItem = CustomerGuideKeys.customerCode;
        break;
      default:
        break;
    }

    const data = {
      initialSearch: {
        key: keyItem,
        value: initValue,
      },
      productCode: ProductCode.Glass,
    };

    this.modalService.show(CustomerGuideComponent, { data }).subscribe(
      (modalRef: BlModalRef) => {
        if (modalRef.reason === ModalReason.Done) {
          this.setInputCustomerCode(modalRef.getResults(), index);
        }
        modalRef.hide(activeElement);
      }
    );
  }

  /**
   * 担当者の変更のイベント
   * @param employeeCode 担当者コード
   * @param propertyId 項目名
   * @param index 索引
   */
  onChangeEmployeeCodeEvent(employeeCode: string, propertyId: string, index: number) {
    if (!employeeCode) {
      this.setInputCustomerCode(null, index);
      return;
    }
    this._condition[propertyId] = employeeCode;
    console.log(JSON.stringify(this._condition));
    if (index === 1 || index === 2) {
      this.exportGlassSalesSlipPanelService.getEmployee(employeeCode).subscribe(
        response => {
          if (index === 1) {
            this._condition.picEmployeeCodeS = !_isNil(response) ? response.employeeCode : null;
            this.picEmployeeNameStart = !_isNil(response) ? response.employeeName : null;
          } else if (index === 2) {
            this._condition.picEmployeeCodeE = !_isNil(response) ? response.employeeCode : null;
            this.picEmployeeNameEnd = !_isNil(response) ? response.employeeName : null;
          }
        }
      );
    }
  }

  /**
   * 担当者ガイドを押下するイベント
   * @param index 索引
   */
  onClickEmployeeCodeGuideEvent(index: number) {
    const activeElement = document.activeElement;
    let initValue: String;
    switch (index) {
      case 1:
        initValue = this._condition.picEmployeeCodeS;
        break;
      case 2:
        initValue = this._condition.picEmployeeCodeE;
        break;
      default:
        break;
    }

    const data = {
      title: '従業員',
      productCode: ProductCode.Glass,
      employeeCode: initValue,
    };

    this.modalService.show(EmployeeGuideComponent, { data }).subscribe(
      modalRef => {
        if (modalRef.reason === ModalReason.Done) {
          const result = modalRef.getResults();
          if (index === 1) {
            this._condition.picEmployeeCodeS = !_isNil(result) ? result.employeeCode : null;
            this.picEmployeeNameStart = !_isNil(result) ? result.employeeName : null;
          } else if (index === 2) {
            this._condition.picEmployeeCodeE = !_isNil(result) ? result.employeeCode : null;
            this.picEmployeeNameEnd = !_isNil(result) ? result.employeeName : null;
          }
        }
        modalRef.hide(activeElement);
      }
    );
  }

  /**
   * コード・区分コードの変更のイベント
   * @param cdDivCd コード・区分コード
   * @param propertyId 項目名
   * @param index 索引
   */
  onChangeDivisionCodeEvent(cdDivCd: number, propertyId: string, index: number) {
    const cdDivClassCd = this.getCodeDivGenre(index);
    if (!cdDivCd) {
      this.setInputDivisionCode(null, index);
      return;
    }
    this._condition[propertyId] = cdDivCd;
    this.exportGlassSalesSlipPanelService.getDivision(cdDivClassCd, cdDivCd).subscribe(
      response => {
        this.setInputDivisionCode(response, index);
      }
    );
  }

  /**
   * コード区分分類情報を取得する
   * @param index 索引
   */
  getCodeDivGenre(index: number) {
    switch (index) {
      case 1:
      case 2:
        return CodeDivGenre.BusinessCode;
      case 3:
      case 4:
        return CodeDivGenre.AreaType;
      default:
        return null;
    }
  }

  /**
   * エンティティの値を設定する
   * @param cdDiv コード区分名称管理明細
   * @param index 索引
   */
  setInputDivisionCode(cdDiv: ICodeDivNameMgtBody, index: number) {
    switch (index) {
      case 1:
        this._condition.dispBusinessCodeS = !_isNil(cdDiv) ? cdDiv.cdDivCd.toString() : null;
        this.dispBusinessNameStart = !_isNil(cdDiv) ? cdDiv.cdDivName : null;
        break;
      case 2:
        this._condition.dispBusinessCodeE = !_isNil(cdDiv) ? cdDiv.cdDivCd.toString() : null;
        this.dispBusinessNameEnd = !_isNil(cdDiv) ? cdDiv.cdDivName : null;
        break;
      case 3:
        this._condition.areaCdS = !_isNil(cdDiv) ? cdDiv.cdDivCd.toString() : null;
        this.areaNameStart = !_isNil(cdDiv) ? cdDiv.cdDivName : null;
        break;
      case 4:
        this._condition.areaCdE = !_isNil(cdDiv) ? cdDiv.cdDivCd.toString() : null;
        this.areaNameEnd = !_isNil(cdDiv) ? cdDiv.cdDivName : null;
        break;
      default:
        break;
    }
  }

  /**
   * ユーザー組織ガイドを押下するイベント
   * @param index 項目名
   */
  onClickUserGuideEvent(index: number) {
    const activeElement = document.activeElement;
    this.modalService.show(UserGuideComponent, {
      data: {
        initValue: this.getInitValueCode(index),
        cdDivClassCd: this.getCodeDivGenre(index),
        isGlass: (index === 1 || index === 2)
      }
    }
    ).subscribe(
      (modalRef: BlModalRef) => {
        if (modalRef.reason === ModalReason.Done) {
          this.setInputDivisionCode(modalRef.getResults(), index);
        }
        modalRef.hide(activeElement);
      }
    );
  }

  /**
   * ガイドを起動する時の初期値を取得する
   * @param index 索引
   */
  getInitValueCode(index: number) {
    switch (index) {
      case 1:
        return this._condition.dispBusinessCodeS;
      case 2:
        return this._condition.dispBusinessCodeE;
      case 3:
        return this._condition.areaCdS;
      case 4:
        return this._condition.areaCdE;
      default:
        return null;
    }
  }

  /**
   * 組織個別指定リスト 空白箇所削除
   * @param organizationList
   */
  cutOrganizationList(organizationList: string[]): string[] {
    const exportOrganizationList = [];
    _forEach(organizationList, organization => {
      if (!_isNil(organization)) {
        exportOrganizationList.push(organization);
      }
    });
    return exportOrganizationList;
  }
  
}
