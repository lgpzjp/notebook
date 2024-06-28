import { Component, EventEmitter, Injector, Output, ViewChild } from '@angular/core';

import { IGenericExportInstruction } from '@blcloud/bl-datamodel/entity/output/generic-export-instruction';
import { ExportInfoDiv, ExportInfoDivArray, ExportInfoDivMap } from '@blcloud/bl-datamodel/enum/output/export-info-div';
import { ExportInfoTabDiv } from '@blcloud/bl-datamodel/enum/output/export-info-tab-div';
import { cloneDeep as _cloneDeep } from 'lodash';
import { of as RxOf } from 'rxjs/observable/of';

import { AbstractExportPanel } from '../abstract-export-panel.component';
import {
  ExportOrderDiv,
  ExportOrderDivArray,
  ExportSlipTypeDiv,
  ExportSlipTypeDivArray,
  IExportGlassPurchaseSlipConditionInput
} from './export-glass-purchase-slip.define';
import { DateTimeUtils } from '@blcloud/bl-common';
import { PurchaseSlipTargetPeriodDiv, PurchaseSlipTargetPeriodDivArray } from '@blcloud/bl-datamodel/enum/purchase/purchase-slip-target-period-div';
import { CompanyConst } from '@blcloud/bl-datamodel/const/company';
import { OutputDiv, OutputDivArray } from '@blcloud/bl-datamodel/enum/common/output-div';
import { GlassPurchaseSlipDiv, GlassPurchaseSlipDivMap } from '@blcloud/bl-datamodel/enum/purchase/glass-purchase-slip-div';
import { ProductCode } from '@blcloud/bl-datamodel/enum/common/product-code';
import { OpeHistoryResource } from '@blcloud/bl-ng-resource';
import { IOpeHistory } from '@blcloud/bl-datamodel';
import { FunctionCategoryDiv } from '@blcloud/bl-datamodel/enum/bizcmn/function-category-div';
import { OpeDiv } from '@blcloud/bl-datamodel/enum/bizcmn/ope-div';
import { LogicalDeleteDiv } from '@blcloud/bl-datamodel/enum/common/logical-delete-div';
import { catchError } from 'rxjs/operators';
import { ExportPanelContainerComponent } from '../../container/export-panel-container.component';
import { Observable } from 'rxjs/Observable';
import { IselectObject, SelectTypeEnum } from '../../../../shared/input/range-organization/range-organization.define';
import { RangeOrganizationComponent } from '../../../../shared/input/range-organization/range-organization.component';
import { IExportGlassExportSearchInfo } from '../../export-request-page.define';

/**
 * 仕入伝票データ出力コンテナコンポーネント
 */
@Component({
  selector: 'app-export-glass-purchase-slip-panel',
  templateUrl: 'export-glass-purchase-slip-panel.component.html',
  styleUrls: ['export-glass-purchase-slip-panel.component.scss']
})
export class ExportGlassPurchaseSlipPanelComponent extends AbstractExportPanel {

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
  @ViewChild('creditPurchase') private creditPurchase;
  /* ガイド非活性イベント */
  @Output() guideDisabledEvent: EventEmitter<object> = new EventEmitter();

  /** 出力情報タブ区分 */
  exportInfoTabDiv = ExportInfoTabDiv.GlassPurchaseSlip;

  /** 出力情報区分 */
  exportInfoDiv = ExportInfoDiv.PurchaseSlip;

  /** 出力情報名称 */
  exportInfoName = ExportInfoDivMap[ExportInfoDiv.PurchaseSlip];

  /** 出力情報項目リスト */
  _exportInfoItems = ExportInfoDivArray.filter(info => info.value === ExportInfoDiv.PurchaseSlip);

  /** 出力内容リスト */
  purchaseSlipDivList: string[] = [];

  _SearchInfo: IExportGlassExportSearchInfo = {};

  /** 対象期間 */
  public readonly PurchaseSlipTargetPeriodDivArray = PurchaseSlipTargetPeriodDivArray;

  /** 出力タイプ */
  public readonly ExportSlipTypeDivArray = ExportSlipTypeDivArray;

  /** 『出力区分』配列 */
  public readonly OutputDivArray = OutputDivArray;

  /** 『出力伝票タイプ区分』配列 */
  public readonly ExportSlipTypeDiv = ExportSlipTypeDiv;

  /** 『順序区分』の配列 */
  public readonly ExportOrderDivArray = ExportOrderDivArray;

  /** 『硝子商仕入伝票区分』を表します。 */
  public readonly glassPurchaseSlipDiv = GlassPurchaseSlipDiv;

  /** 『硝子商仕入伝票区分』の連想配列情報 */
  public readonly glassPurchaseSlipDivMap = GlassPurchaseSlipDivMap;

  /** ガイド用フォーカスエレメント */
  preFocusElement = null;

  /** 組織情報用フォーカスエレメント */
  isFocusRangeOrganization = false;

  _condition: IExportGlassPurchaseSlipConditionInput = {
    targetPeriod: PurchaseSlipTargetPeriodDiv.SlipDate,
    startDate: DateTimeUtils.formatIso(DateTimeUtils.today()),
    endDate: DateTimeUtils.formatIso(DateTimeUtils.today()),
    exportInfoType: ExportSlipTypeDiv.Slip,
    glassOutPutPurchaseOrderDiv: ExportOrderDiv.OrderDiv0,
    outPutHeaderDiv: OutputDiv.Output,
    creditPurchase: true,
    creditPurchaseReturn: true,
    cashPurchase: true,
    cashPurchaseReturn: true,
    organization: CompanyConst.ORGANIZATION_CODE_ALL_COMPANY,
    productCode: ProductCode.Glass,
    cutoffDay: 0
  };

  constructor(
    injector: Injector,
    private opeHistoryResource: OpeHistoryResource,
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
    this._condition.targetPeriod = PurchaseSlipTargetPeriodDiv.SlipDate;
    this._condition.exportInfoType = ExportSlipTypeDiv.Slip;
    this._condition.glassOutPutPurchaseOrderDiv = ExportOrderDiv.OrderDiv0;
    this._condition.outPutHeaderDiv = OutputDiv.Output;
    this._condition.creditPurchase = true;
    this._condition.creditPurchaseReturn = true;
    this._condition.cashPurchase = true;
    this._condition.cashPurchaseReturn = true;
    this._condition.organization = CompanyConst.ORGANIZATION_CODE_ALL_COMPANY;
    this._condition.productCode = ProductCode.Glass;
    this._condition.customerCodeS = null;
    this._condition.customerCodeE = null;
    this._condition.picEmployeeCodeS = null;
    this._condition.picEmployeeCodeE = null;
    this._condition.cutoffDay = 0;
    this.exportInfoDiv = ExportInfoDiv.PurchaseSlip;
    this.exportInfoName = ExportInfoDivMap[ExportInfoDiv.PurchaseSlip];
    this._exportInfoItems = ExportInfoDivArray.filter(info => info.value === ExportInfoDiv.PurchaseSlip);
    this.RangeOrganization.doClear();
  }

  /**
   * 対象期間の変更イベント
   * @param event
   */
  onChangeTargetPeriod(event: string): void {
    this._condition.targetPeriod = event;
    this._condition.creditPurchase = true;
    this._condition.creditPurchaseReturn = true;
    this._condition.cashPurchase = true;
    this._condition.cashPurchaseReturn = true;
  }

  /**
   * 出力内容を検証します。
   * 検証OKの場合はnullを返却します。
   * @returns 検証結果メッセージ
   */
  protected validate(): Observable<any> {
    let observer = { message: '', childElement: null };

    if (this._condition.creditPurchase) {
      this.purchaseSlipDivList.push(this.glassPurchaseSlipDiv.CreditPurchase);
    }
    if (this._condition.creditPurchaseReturn) {
      this.purchaseSlipDivList.push(this.glassPurchaseSlipDiv.CreditPurchaseReturn);
    }
    if (this._condition.cashPurchase) {
      this.purchaseSlipDivList.push(this.glassPurchaseSlipDiv.CashPurchase);
    }
    if (this._condition.cashPurchaseReturn) {
      this.purchaseSlipDivList.push(this.glassPurchaseSlipDiv.CashPurchaseReturn);
    }
    if (!this.purchaseSlipDivList || this.purchaseSlipDivList.length === 0) {
      observer = { message: '出力内容が指定されていません。', childElement: this.creditPurchase };
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
    if (exportInfoType === ExportSlipTypeDiv.SlipDetail) {
      this.exportInfoDiv = ExportInfoDiv.PurchaseSlipDetail;
      this.exportInfoName = ExportInfoDivMap[ExportInfoDiv.PurchaseSlipDetail];
      this._exportInfoItems = ExportInfoDivArray.filter(info => info.value === ExportInfoDiv.PurchaseSlipDetail);
    } else if (exportInfoType === ExportSlipTypeDiv.StatisticalAnalysis) {
      this.exportInfoDiv = ExportInfoDiv.StatisticalAnalysis;
      this.exportInfoName = ExportInfoDivMap[ExportInfoDiv.StatisticalAnalysis];
      this._exportInfoItems = ExportInfoDivArray.filter(info => info.value === ExportInfoDiv.StatisticalAnalysis);
    } else {
      this.exportInfoDiv = ExportInfoDiv.PurchaseSlip;
      this.exportInfoName = ExportInfoDivMap[ExportInfoDiv.PurchaseSlip];
      this._exportInfoItems = ExportInfoDivArray.filter(info => info.value === ExportInfoDiv.PurchaseSlip);
    }
  }

  /**
   * 掛仕入の変更イベント | 出力内容
   * @param event
   */
  onChangeSlipExportContentCreditPurchase(event: Event): void {
    this._condition.creditPurchase = (<HTMLInputElement>event.target).checked;
  }

  /**
  * 掛仕入返品の変更イベント | 出力内容
  * @param event
  */
  onChangeSlipExportContentCreditReturned(event: Event): void {
    this._condition.creditPurchaseReturn = (<HTMLInputElement>event.target).checked;
  }

  /**
   * 現金仕入の変更イベント | 出力内容
   * @param event
   */
  onChangeSlipExportContentCashPurchase(event: Event): void {
    this._condition.cashPurchase = (<HTMLInputElement>event.target).checked;
  }

  /**
   * 現金仕入返品の変更イベント | 出力内容
   * @param event
   */
  onChangeSlipExportContentCashReturned(event: Event): void {
    this._condition.cashPurchaseReturn = (<HTMLInputElement>event.target).checked;
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
    this._condition.glassOutPutPurchaseOrderDiv = $event;
  }

  /**
   * クエリパラメータを生成します。
   */
  protected makeGenericExportInstruction(): IGenericExportInstruction {
    // 仕入伝票区分情報配列
    this._SearchInfo.purchaseSlipDivList = this.purchaseSlipDivList;
    // 出力タイプ
    this._SearchInfo.exportInfoType = this._condition.exportInfoType;
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
      this._SearchInfo.organizationCodeList = this.organizationObject.organizationList;
    } else if (this.organizationObject.selectType === SelectTypeEnum.ALL_ORGANAIZATION) {
      // 組織コード配列
      this._SearchInfo.organizationCodeList = this.organizationObject.allOrganizationCode;
    }
    // 顧客コード(開始)
    this._SearchInfo.customerCodeStart = this._condition.customerCodeS;
    // 顧客コード(終了)
    this._SearchInfo.customerCodeEnd = this._condition.customerCodeE;
    // 担当従業員コード(開始)
    this._SearchInfo.picEmployeeCodeStart = this._condition.picEmployeeCodeS;
    // 担当従業員コード(終了)
    this._SearchInfo.picEmployeeCodeEnd = this._condition.picEmployeeCodeE;
    // 締日
    this._SearchInfo.cutoffDay = this._condition.cutoffDay;
    // CSVヘッダー出力区分
    this._SearchInfo.outPutHeaderDiv = this._condition.outPutHeaderDiv;
    // CSV出力順序区分
    this._SearchInfo.glassOutPutPurchaseOrderDiv = this._condition.glassOutPutPurchaseOrderDiv;

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

}
