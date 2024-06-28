import { Component, EventEmitter, Injector, Output, ViewChild } from '@angular/core';
import { forEach as _forEach, isNil as _isNil, isEmpty as _isEmpty} from 'lodash';
import { Observable } from 'rxjs/Observable';
import { of as RxOf } from 'rxjs/observable/of';
import { catchError } from 'rxjs/operators';

import { DateTimeUtils } from '@blcloud/bl-common';
import { IGenericExportInstruction } from '@blcloud/bl-datamodel/entity/output/generic-export-instruction';
import { ProductCode } from '@blcloud/bl-datamodel/enum/common/product-code';
import { ExportInfoDiv, ExportInfoDivArray, ExportInfoDivMap } from '@blcloud/bl-datamodel/enum/output/export-info-div';
import { ExportInfoTabDiv } from '@blcloud/bl-datamodel/enum/output/export-info-tab-div';
import { LogicalDeleteDiv } from '@blcloud/bl-datamodel/enum/common/logical-delete-div';
import { FunctionCategoryDiv } from '@blcloud/bl-datamodel/enum/bizcmn/function-category-div';
import { OpeDiv } from '@blcloud/bl-datamodel/enum/bizcmn/ope-div';
import { CustomerInfo, ICustomerInfo, IOpeHistory } from '@blcloud/bl-datamodel';
import { OpeHistoryResource } from '@blcloud/bl-ng-resource';
import { cloneDeep as _cloneDeep } from 'lodash';

import { AbstractExportPanel } from '../abstract-export-panel.component';
import { IselectObject, SelectTypeEnum } from '../../../../shared/input/range-organization/range-organization.define';
import { CompanyConst } from '@blcloud/bl-datamodel/const/company';
import { OutputDiv, OutputDivArray } from '@blcloud/bl-datamodel/enum/common/output-div';
import { RangeOrganizationComponent } from '../../../../shared/input/range-organization/range-organization.component';
import { ExportCustomerDivArray, IExportGlassExportSearchInfo } from '../../export-request-page.define';
import { ExportGlassCustomerPanelService } from './export-glass-customer-panel.service';
import { FunctionRole } from '@blcloud/bl-ng-share-module';
import { CustomerGuideComponent, CustomerGuideKeys } from '@blcloud/bl-ng-vehicle-customer-module';
import { BlModalRef, ModalReason } from '@blcloud/bl-ng-ui-component';

/**
 * 売上データ出力コンテナコンポーネント
 */
@Component({
  selector: 'app-export-glass-customer-panel',
  templateUrl: 'export-glass-customer-panel.component.html',
  styleUrls: ['export-glass-customer-panel.component.scss'],
  providers: [ExportGlassCustomerPanelService]
})
export class ExportGlassCustomerPanelComponent extends AbstractExportPanel {

  /* ガイド非活性イベント */
  @Output() guideDisabledEvent: EventEmitter<object> = new EventEmitter();
  /** 組織 個別/範囲指定切り替えコンポーネント */
  @ViewChild(RangeOrganizationComponent) private RangeOrganization: RangeOrganizationComponent;

  /** 組織情報(範囲指定/個別指定) */
  public organizationObject: IselectObject = {
    selectType: SelectTypeEnum.RANGE,
    focus: null,
    organizationCodeFrom: null,
    organizationCodeTo: null,
    organizationList: [null, null, null, null, null, null, null, null, null, null],
    allOrganizationCode: [CompanyConst.ORGANIZATION_CODE_ALL_COMPANY]
  };

  /** ガイド用フォーカスエレメント */
  preFocusElement = null;

  /** 組織情報用フォーカスエレメント */
  isFocusRangeOrganization = false;

  /** 出力情報タブ区分 */
  exportInfoTabDiv = ExportInfoTabDiv.GlassCustomer;

  /** 出力情報区分 */
  exportInfoDiv = ExportInfoDiv.Customer;

  /** 出力情報名称 */
  exportInfoName = ExportInfoDivMap[ExportInfoDiv.Customer];

  /** 出力情報項目リスト */
  _exportInfoItems = ExportInfoDivArray.filter(info => info.value === ExportInfoDiv.Customer);

  /** 出力タイプ */
  ExportCustomerDivArray = ExportCustomerDivArray;

  /** 『出力区分』配列 */
  OutputDivArray = OutputDivArray;

  _condition: IExportGlassExportSearchInfo = {
      dataExportTargetPeriodStDate: DateTimeUtils.formatIso(DateTimeUtils.addMonths(DateTimeUtils.today(), -1)),
      dataExportTargetPeriodEdDate: DateTimeUtils.formatIso(DateTimeUtils.today()),
      customerExportContent: '1',
      organizationCodeList: [CompanyConst.ORGANIZATION_CODE_ALL_COMPANY],
      customerCodeStart: null,
      customerCodeEnd: null,
      customerNameStart: null,
      customerNameEnd: null,
      cutoffDay: 0,
      outPutHeaderDiv: OutputDiv.Output,
  };

  constructor(
    injector: Injector,
    private opeHistoryResource: OpeHistoryResource,
    private exportGlassCustomerPanelService: ExportGlassCustomerPanelService,
  ) {
    super(injector);
  }

  /**
   * 条件を初期化します。
   */
  protected initCondition(): void {
    // 出力内容
    this.exportInfoDiv = ExportInfoDiv.Customer;
    this.exportInfoName = ExportInfoDivMap[ExportInfoDiv.Customer];
    this._condition.customerExportContent = '1';
    // 対象期間
    this._condition.dataExportTargetPeriodStDate = DateTimeUtils.formatIso(DateTimeUtils.addMonths(DateTimeUtils.today(), -1));
    this._condition.dataExportTargetPeriodEdDate = DateTimeUtils.formatIso(DateTimeUtils.today());
    // 管理組織
    this._condition.organizationCodeList = [CompanyConst.ORGANIZATION_CODE_ALL_COMPANY];
    this.organizationObject = {
      selectType: SelectTypeEnum.RANGE,
      focus: null,
      organizationCodeFrom: null,
      organizationCodeTo: null,
      organizationList: [null, null, null, null, null, null, null, null, null, null],
      allOrganizationCode: [CompanyConst.ORGANIZATION_CODE_ALL_COMPANY]
    };
    this.RangeOrganization.doClear();

    // 顧客コード
    this._condition.customerCodeStart = null;
    this._condition.customerCodeEnd = null;
    // 締日
    this._condition.cutoffDay = 0;
    // ヘッダ行
    this._condition.outPutHeaderDiv = OutputDiv.Output;
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
   * クエリパラメータを生成します。
   */
  protected makeGenericExportInstruction(): IGenericExportInstruction {
    const condition: IExportGlassExportSearchInfo = {};

    condition.customerExportContent = this._condition.customerExportContent;
    condition.dataExportTargetPeriodStDate = this._condition.dataExportTargetPeriodStDate;
    condition.dataExportTargetPeriodEdDate = this._condition.dataExportTargetPeriodEdDate;

    if (this.organizationObject.selectType === SelectTypeEnum.RANGE) {
      if (!_isEmpty(this.organizationObject.organizationCodeFrom)) {
        condition.organizationCodeStart = this.organizationObject.organizationCodeFrom;
      }
      if (!_isEmpty(this.organizationObject.organizationCodeTo)) {
        condition.organizationCodeEnd = this.organizationObject.organizationCodeTo;
      }
    } else if (this.organizationObject.selectType === SelectTypeEnum.INDIVIDUAL) {
      condition.organizationCodeList = this.cutOrganizationList(this.organizationObject.organizationList);
    }

    if (!_isEmpty(this._condition.customerCodeStart)) {
      condition.customerCodeStart = this._condition.customerCodeStart;
    }
    if (!_isEmpty(this._condition.customerCodeEnd)) {
      condition.customerCodeEnd = this._condition.customerCodeEnd;
    }

    condition.cutoffDay = this._condition.cutoffDay;
    condition.outPutHeaderDiv = this._condition.outPutHeaderDiv;

    return _cloneDeep({
      exportInfoTabDiv: this.exportInfoTabDiv,
      exportInfoDiv: this.exportInfoDiv,
      extractConditionString: JSON.stringify(condition),
      exportPatternCode: this.exportPatternCode
    });
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
   * 組織情報設定
   * @param event 組織情報
   */
  onSelectInfoEvent(event: IselectObject): void {
    this.organizationObject = event;
  }

  /**
   * 変更イベントヘッダ行選択
   * @param $event
   */
  onChangeOutPutHeaderDiv($event: string): void {
    this._condition.outPutHeaderDiv = $event;
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
   * 組織ガイドボタンクリックイベント
   * @param element
   */
  onClickOrganizationGuide(element) {
    this.RangeOrganization.onClickOrganizationGuide(element);
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

  /**
   * ガイドファンクションを非活性にします
   *
   */
  onBlurEvent(): void {
    this.preFocusElement = null;
    this.screenService.disableFnKey(FunctionRole.Guide);
  }

  /**
   * フォーカスイベント処理
   * @param button ガイドボタン
   */
  onFocusEvent(button: HTMLButtonElement) {
    this.preFocusElement = button;
    this.screenService.enableFnKey(FunctionRole.Guide);
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
      this.exportGlassCustomerPanelService.getCustomerInfo(customerCode).subscribe(
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
      this._condition.customerCodeStart = !_isNil(customerCode) ? customerCode.customerCode.toString() : null;
      this._condition.customerNameStart = !_isNil(customerCode) ? CustomerInfo.dispCustomerName(customerCode) : null;
    } else if (index === 2) {
      this._condition.customerCodeEnd = !_isNil(customerCode) ? customerCode.customerCode.toString() : null;
      this._condition.customerNameEnd = !_isNil(customerCode) ? CustomerInfo.dispCustomerName(customerCode) : null;
    }
  }

  /**
   * 顧客ガイドを押下するイベント
   * @param index 索引
   */
  onClickCustomerCodeGuideEvent(index: number) {
    const activeElement = document.activeElement;

    let initValue: String;
    let keyItem: String;
    switch (index) {
      case 1:
        initValue = this._condition.customerCodeStart;
        keyItem = CustomerGuideKeys.customerNameKana;
        break;
      case 2:
        initValue = this._condition.customerCodeEnd;
        keyItem = CustomerGuideKeys.customerNameKana;
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
}
