import { Component, EventEmitter, Injector, Output, ViewChild } from '@angular/core';

import { IGenericExportInstruction } from '@blcloud/bl-datamodel/entity/output/generic-export-instruction';
import { ExportInfoDiv, ExportInfoDivArray, ExportInfoDivMap } from '@blcloud/bl-datamodel/enum/output/export-info-div';
import { ExportInfoTabDiv } from '@blcloud/bl-datamodel/enum/output/export-info-tab-div';
import { cloneDeep as _cloneDeep } from 'lodash';
import { of as RxOf } from 'rxjs/observable/of';

import { AbstractExportPanel } from '../abstract-export-panel.component';
import { ExportPaymentDivArray, ExportPaymentTypeDiv, ExportOrderDiv, ExportOrderDivArray } from './export-glass-payment.define';
import { DateTimeUtils } from '@blcloud/bl-common';
import { CompanyConst } from '@blcloud/bl-datamodel/const/company';
import { OutputDiv, OutputDivArray } from '@blcloud/bl-datamodel/enum/common/output-div';
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
import { IExportGlassPaymentConditionInput } from './export-glass-payment.define';
import { IExportGlassExportSearchInfo } from '../../export-request-page.define';

/**
 * 出金伝票データ出力コンテナコンポーネント
 */
@Component({
  selector: 'app-export-glass-payment-panel',
  templateUrl: 'export-glass-payment-panel.component.html',
  styleUrls: ['export-glass-payment-panel.component.scss']
})
export class ExportGlassPaymentPanelComponent extends AbstractExportPanel {

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
  /* ガイド非活性イベント */
  @Output() guideDisabledEvent: EventEmitter<object> = new EventEmitter();

  /** 出力情報タブ区分 */
  exportInfoTabDiv = ExportInfoTabDiv.GlassPayment;

  /** 出力情報区分 */
  exportInfoDiv = ExportInfoDiv.Payment;

  /** 出力情報名称 */
  exportInfoName = ExportInfoDivMap[ExportInfoDiv.Payment];

  /** 出力情報項目リスト */
  _exportInfoItems = ExportInfoDivArray.filter(info => info.value === ExportInfoDiv.Payment);

  _SearchInfo: IExportGlassExportSearchInfo = {};

  /** ガイド用フォーカスエレメント */
  preFocusElement = null;

  /** 組織情報用フォーカスエレメント */
  isFocusRangeOrganization = false;

  /** 出力タイプ */
  public ExportPaymentDivArray = ExportPaymentDivArray;

  /** 『出力区分』配列 */
  public readonly OutputDivArray = OutputDivArray;

  /** 『順序区分』の配列 */
  public readonly ExportOrderDivArray = ExportOrderDivArray;

  _condition: IExportGlassPaymentConditionInput = {
    startDate: DateTimeUtils.formatIso(DateTimeUtils.today()),
    endDate: DateTimeUtils.formatIso(DateTimeUtils.today()),
    exportInfoType: ExportPaymentTypeDiv.Slip,
    glassOutPutPurchaseOrderDiv: ExportOrderDiv.OrderDiv0,
    outPutHeaderDiv: OutputDiv.Output,
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
   * 出力タイプの変更イベント
   * @param exportInfoType
   */

  onChangeExportInfoType(exportInfoType: string): void {
    this._condition.exportInfoType = exportInfoType;
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
    this._condition.exportInfoType = ExportPaymentTypeDiv.Slip;
    this._condition.glassOutPutPurchaseOrderDiv = ExportOrderDiv.OrderDiv0;
    this._condition.outPutHeaderDiv = OutputDiv.Output;
    this._condition.organization = CompanyConst.ORGANIZATION_CODE_ALL_COMPANY;
    this._condition.productCode = ProductCode.Glass;
    this._condition.cutoffDay = 0;
    this.RangeOrganization.doClear();
  }

  /**
   * 出力内容を検証します。
   * 検証OKの場合はnullを返却します。
   * @returns 検証結果メッセージ
   */
  protected validate(): Observable<any> {
    const observer = { message: '', childElement: null };
    return RxOf(observer);
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
