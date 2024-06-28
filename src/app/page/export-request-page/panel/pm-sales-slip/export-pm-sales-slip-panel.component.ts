import { Component, Injector, ViewChild } from '@angular/core';
import {
  isEmpty as _isEmpty,
  isNaN as _isNaN,
  isNil as _isNil,
  toNumber as _toNumber
} from 'lodash';
import { Observable } from 'rxjs/Observable';
import { of as RxOf } from 'rxjs/observable/of';
import { catchError } from 'rxjs/operators';

import { DateTimeUtils, StringUtils } from '@blcloud/bl-common';
import { CompanyConst } from '@blcloud/bl-datamodel/const/company';
import { IGenericExportInstruction } from '@blcloud/bl-datamodel/entity/output/generic-export-instruction';
import { ISalesSlipExportSearchInfo } from '@blcloud/bl-datamodel/entity/sales/sales-slip-export-search-info';
import { CodeDivGenre } from '@blcloud/bl-datamodel/enum/common/code-div-genre';
import { ProductCode } from '@blcloud/bl-datamodel/enum/common/product-code';
import { CustomerKind } from '@blcloud/bl-datamodel/enum/customer/customer-kind';
import { ExportInfoDiv, ExportInfoDivArray, ExportInfoDivMap } from '@blcloud/bl-datamodel/enum/output/export-info-div';
import { ExportInfoTabDiv } from '@blcloud/bl-datamodel/enum/output/export-info-tab-div';
import {
  SalesSlipExportIssueTypeDiv,
  SalesSlipExportIssueTypeDivArray
} from '@blcloud/bl-datamodel/enum/sales/sales-slip-export-issue-type-div';
import { SalesSlipExportRedSlipDiv, SalesSlipExportRedSlipDivArray } from '@blcloud/bl-datamodel/enum/sales/sales-slip-export-red-slip-div';
import { SalesSlipExportSlipDiv, SalesSlipExportSlipDivArray } from '@blcloud/bl-datamodel/enum/sales/sales-slip-export-slip-div';
import { SalesSlipExportUnitDiv } from '@blcloud/bl-datamodel/enum/sales/sales-slip-export-unit-div';
import { StockBackorderDesignDiv, StockBackorderDesignDivArray } from '@blcloud/bl-datamodel/enum/stock/stock-backorder-design-div';
import { LogicalDeleteDiv } from '@blcloud/bl-datamodel/enum/common/logical-delete-div';
import { FunctionCategoryDiv } from '@blcloud/bl-datamodel/enum/bizcmn/function-category-div';
import { OpeDiv } from '@blcloud/bl-datamodel/enum/bizcmn/ope-div';
import { IOpeHistory } from '@blcloud/bl-datamodel';
import { OpeHistoryResource } from '@blcloud/bl-ng-resource';
import {
  BlCodeGuideComponent,
  BlGroupCodeGuideComponent,
  EmployeeGuideComponent,
  ItemMakerNameGuideComponent,
  ItemMiddleClassGuideComponent,
  UserGuideComponent,
  WarehouseGuideComponent,
  WithAllCompanyDiv
} from '@blcloud/bl-ng-share-module';
import { BlModalRef, BlModalService, ModalReason } from '@blcloud/bl-ng-ui-component';
import { CustomerGuideComponent, SupplierGuideComponent } from '@blcloud/bl-ng-vehicle-customer-module';
import { cloneDeep as _cloneDeep, map as _map } from 'lodash';
import { ExportDateRangeComponent } from '../../../../shared/input/date-range/export-date-range.component';
import { ExportTextRangeComponent } from '../../../../shared/input/text-range/export-text-range.component';
import { ExportTextGuideRangeComponent } from '../../../../shared/input/text-guide-range/export-text-guide-range.component';

import { AbstractExportPanel } from '../abstract-export-panel.component';

/**
 * 売上データ出力コンテナコンポーネント
 */
@Component({
  selector: 'app-export-pm-sales-slip-panel',
  templateUrl: 'export-pm-sales-slip-panel.component.html',
  styleUrls: ['export-pm-sales-slip-panel.component.scss']
})
export class ExportPmSalesSlipPanelComponent extends AbstractExportPanel {

  @ViewChild('salesDateRange') private salesDateRange: ExportDateRangeComponent;
  @ViewChild('inputDateRange') private inputDateRange: ExportDateRangeComponent;
  @ViewChild('slipNumberRange') private slipNumberRange: ExportTextRangeComponent;
  @ViewChild('customerCodeRange') private customerCodeRange: ExportTextGuideRangeComponent;
  @ViewChild('areaCdRange') private areaCdRange: ExportTextGuideRangeComponent;
  @ViewChild('businessCodeRnage') private businessCodeRnage: ExportTextGuideRangeComponent;
  @ViewChild('picEmployeeCodeRange') private picEmployeeCodeRange: ExportTextGuideRangeComponent;
  @ViewChild('orderEmployeeCodeRange') private orderEmployeeCodeRange: ExportTextGuideRangeComponent;
  @ViewChild('issueEmployeeCodeRange') private issueEmployeeCodeRange: ExportTextGuideRangeComponent;
  @ViewChild('itemLClassCdRange') private itemLClassCdRange: ExportTextGuideRangeComponent;
  @ViewChild('itemMClassCdRange') private itemMClassCdRange: ExportTextGuideRangeComponent;
  @ViewChild('blCdGroupCodeRange') private blCdGroupCodeRange: ExportTextGuideRangeComponent;
  @ViewChild('blPartsCdRange') private blPartsCdRange: ExportTextGuideRangeComponent;
  @ViewChild('itemMakerCdRange') private itemMakerCdRange: ExportTextGuideRangeComponent;
  @ViewChild('supplierCdRange') private supplierCdRange: ExportTextGuideRangeComponent;
  @ViewChild('salesDivRange') private salesDivRange: ExportTextGuideRangeComponent;
  @ViewChild('whCodeRange') private whCodeRange: ExportTextGuideRangeComponent;
  @ViewChild('shelfNumRange') private shelfNumRange: ExportTextRangeComponent;

  /** 出力情報タブ区分 */
  exportInfoTabDiv = ExportInfoTabDiv.SalesSlip;

  /** 出力情報区分 */
  exportInfoDiv = ExportInfoDiv.SalesSlip;

  /** 出力情報名称 */
  exportInfoName = ExportInfoDivMap[ExportInfoDiv.SalesSlip];

  /** 組織選択表示モード */
  organizationSelectMode = WithAllCompanyDiv.None;

  /** 出力情報項目リスト */
  _exportInfoItems = ExportInfoDivArray.filter(info => info.value === ExportInfoDiv.SalesSlip || info.value === ExportInfoDiv.SalesSlipDetail);

  _condition: ISalesSlipExportSearchInfo = {
    salesSlipExportUnitDiv: SalesSlipExportUnitDiv.Slip,
    salesDateStart: DateTimeUtils.formatIso(DateTimeUtils.today()),
    salesDateEnd: DateTimeUtils.formatIso(DateTimeUtils.today()),
    inputDateStart: DateTimeUtils.initial.iso8601.date,
    inputDateEnd: DateTimeUtils.initial.iso8601.date,
    salesSlipExportSlipDiv: SalesSlipExportSlipDiv.All,
    salesSlipExportRedSlipDiv: SalesSlipExportRedSlipDiv.All,
    salesSlipExportIssueTypeDiv: SalesSlipExportIssueTypeDiv.All,
    stockBackorderDesignDiv: StockBackorderDesignDiv.All
  }

  /** 伝票区分 */
  _slipDivItems = SalesSlipExportSlipDivArray;

  /** 赤伝区分 */
  _redSlipDivItems = SalesSlipExportRedSlipDivArray;

  /** 発行タイプ */
  _issueTypeDivItems = SalesSlipExportIssueTypeDivArray;

  /** 在庫取寄区分 */
  _stockBackorderDivItems = StockBackorderDesignDivArray;

  /** 出力情報区分定義 */
  readonly ExportInfoDiv = ExportInfoDiv;

  /** コード区分分類定義 */
  readonly CodeDivGenre = CodeDivGenre;

  constructor(
    injector: Injector,
    private _modalService: BlModalService,
    private opeHistoryResource: OpeHistoryResource,
  ) {
    super(injector);
  }

  /**
   * 条件を初期化します。
   */
  protected initCondition(): void {
    // 出力内容
    this.exportInfoDiv = ExportInfoDiv.SalesSlip;
    this.exportInfoName = ExportInfoDivMap[ExportInfoDiv.SalesSlip];

    // 売上日
    this._condition.salesDateStart = DateTimeUtils.formatIso(DateTimeUtils.today());
    this._condition.salesDateEnd = DateTimeUtils.formatIso(DateTimeUtils.today());
    // 入力日
    this._condition.inputDateStart = DateTimeUtils.initial.iso8601.date;
    this._condition.inputDateEnd = DateTimeUtils.initial.iso8601.date;
    // 伝票番号
    this._condition.slipNumberStart = null;
    this._condition.slipNumberEnd = null;
    // 倉庫
    this._condition.whCodeStart = '';
    this._condition.whCodeEnd = '';
    // 棚番
    this._condition.shelfNumStart = '';
    this._condition.shelfNumEnd = '';
    // 担当者
    this._condition.picEmployeeCodeStart = '';
    this._condition.picEmployeeCodeEnd = '';
    // 受注者
    this._condition.orderEmployeeCodeStart = '';
    this._condition.orderEmployeeCodeEnd = '';
    // 発行者
    this._condition.issueEmployeeCodeStart = '';
    this._condition.issueEmployeeCodeEnd = '';
    // 得意先
    this._condition.customerCodeStart = null;
    this._condition.customerCodeEnd = null;
    // 地区
    this._condition.areaCdStart = null;
    this._condition.areaCdEnd = null;
    // 業種
    this._condition.businessCodeStart = null;
    this._condition.businessCodeEnd = null;
    // 商品大分類
    this._condition.itemLClassCdStart = null;
    this._condition.itemLClassCdEnd = null;
    // 商品中分類
    this._condition.itemMClassCdStart = null;
    this._condition.itemMClassCdEnd = null;
    // グループコード
    this._condition.blCdGroupCodeStart = null;
    this._condition.blCdGroupCodeEnd = null;
    // BLコード
    this._condition.blPartsCdStart = null;
    this._condition.blPartsCdEnd = null;
    // メーカー
    this._condition.itemMakerCdStart = null;
    this._condition.itemMakerCdEnd = null;
    // 仕入先
    this._condition.supplierCdStart = null;
    this._condition.supplierCdEnd = null;
    // 販売区分
    this._condition.salesDivStart = null;
    this._condition.salesDivEnd = null;
    // 伝票区分
    this._condition.salesSlipExportSlipDiv = SalesSlipExportSlipDiv.All;
    // 赤伝区分
    this._condition.salesSlipExportRedSlipDiv = SalesSlipExportRedSlipDiv.All;
    // 発行タイプ
    this._condition.salesSlipExportIssueTypeDiv = SalesSlipExportIssueTypeDiv.All;
    // 在庫取寄区分
    this._condition.stockBackorderDesignDiv = StockBackorderDesignDiv.All;
  }

  /**
   * 出力内容を検証します。
   * 検証OKの場合はnullを返却します。
   * @returns 検証結果メッセージ
   */
  protected validate(): Observable<any> {
    let observer = { message: '', childElement: null };
    if (this._condition.salesDateStart === DateTimeUtils.initial.iso8601.date || this._condition.salesDateEnd === DateTimeUtils.initial.iso8601.date) {
      observer = { message: '売上日を入力してください。', childElement: this.salesDateRange };
      return RxOf(observer);
    }

    if (this._condition.salesDateStart > this._condition.salesDateEnd) {
      observer = { message: '売上日の範囲指定に誤りがあります。', childElement: this.salesDateRange };
      return RxOf(observer);
    }
    if (DateTimeUtils.addYears(DateTimeUtils.parseDate(this._condition.salesDateEnd), -2)
      > DateTimeUtils.parseDate(this._condition.salesDateStart)) {
      observer = { message: '売上日の範囲指定に誤りがあります。（2年以内で設定してください）', childElement: this.salesDateRange };
      return RxOf(observer);
    }
    if (this._condition.inputDateStart !== DateTimeUtils.initial.iso8601.date
      && this._condition.inputDateEnd !== DateTimeUtils.initial.iso8601.date
      && this._condition.inputDateStart > this._condition.inputDateEnd) {
      observer = { message: '入力日の範囲指定に誤りがあります。', childElement: this.inputDateRange };
      return RxOf(observer);
    }
    if (!_isNil(this._condition.slipNumberStart) && !_isNil(this._condition.slipNumberEnd)
      && this._condition.slipNumberStart !== 0 && this._condition.slipNumberEnd !== 0
      && this._condition.slipNumberStart > this._condition.slipNumberEnd) {
      observer = { message: '伝票番号の範囲指定に誤りがあります。', childElement: this.slipNumberRange };
      return RxOf(observer);
    }
    if (!_isNil(this._condition.customerCodeStart) && !_isNil(this._condition.customerCodeEnd)
      && this._condition.customerCodeStart !== 0 && this._condition.customerCodeEnd !== 0
      && this._condition.customerCodeStart > this._condition.customerCodeEnd) {
      observer = { message: '得意先の範囲指定に誤りがあります。', childElement: this.customerCodeRange };
      return RxOf(observer);
    }
    if (!_isNil(this._condition.areaCdStart) && !_isNil(this._condition.areaCdEnd)
      && this._condition.areaCdStart !== 0 && this._condition.areaCdEnd !== 0
      && this._condition.areaCdStart > this._condition.areaCdEnd) {
      observer = { message: '地区の範囲指定に誤りがあります。', childElement: this.areaCdRange };
      return RxOf(observer);
    }
    if (!_isNil(this._condition.businessCodeStart) && !_isNil(this._condition.businessCodeEnd)
      && this._condition.businessCodeStart !== 0 && this._condition.businessCodeEnd !== 0
      && this._condition.businessCodeStart > this._condition.businessCodeEnd) {
      observer = { message: '業種の範囲指定に誤りがあります。', childElement: this.businessCodeRnage };
      return RxOf(observer);
    }
    if (!_isNil(this._condition.picEmployeeCodeStart) && !_isNil(this._condition.picEmployeeCodeEnd)
      && !_isEmpty(this._condition.picEmployeeCodeStart) && !_isEmpty(this._condition.picEmployeeCodeEnd)
      && this._condition.picEmployeeCodeStart > this._condition.picEmployeeCodeEnd) {
      observer = { message: '担当者の範囲指定に誤りがあります。', childElement: this.picEmployeeCodeRange };
      return RxOf(observer);
    }
    if (!_isNil(this._condition.orderEmployeeCodeStart) && !_isNil(this._condition.orderEmployeeCodeEnd)
      && !_isEmpty(this._condition.orderEmployeeCodeStart) && !_isEmpty(this._condition.orderEmployeeCodeEnd)
      && this._condition.orderEmployeeCodeStart > this._condition.orderEmployeeCodeEnd) {
      observer = { message: '受注者の範囲指定に誤りがあります。', childElement: this.orderEmployeeCodeRange };
      return RxOf(observer);
    }
    if (!_isNil(this._condition.issueEmployeeCodeStart) && !_isNil(this._condition.issueEmployeeCodeEnd)
      && !_isEmpty(this._condition.issueEmployeeCodeStart) && !_isEmpty(this._condition.issueEmployeeCodeEnd)
      && this._condition.issueEmployeeCodeStart > this._condition.issueEmployeeCodeEnd) {
      observer = { message: '発行者の範囲指定に誤りがあります。', childElement: this.issueEmployeeCodeRange };
      return RxOf(observer);
    }
    if (!_isNil(this._condition.itemLClassCdStart) && !_isNil(this._condition.itemLClassCdEnd)
      && this._condition.itemLClassCdStart !== 0 && this._condition.itemLClassCdEnd !== 0
      && this._condition.itemLClassCdStart > this._condition.itemLClassCdEnd) {
      observer = { message: '商品大分類の範囲指定に誤りがあります。', childElement: this.itemLClassCdRange };
      return RxOf(observer);
    }
    if (!_isNil(this._condition.itemMClassCdStart) && !_isNil(this._condition.itemMClassCdEnd)
      && this._condition.itemMClassCdStart !== 0 && this._condition.itemMClassCdEnd !== 0
      && this._condition.itemMClassCdStart > this._condition.itemMClassCdEnd) {
      observer = { message: '商品中分類の範囲指定に誤りがあります。', childElement: this.itemMClassCdRange };
      return RxOf(observer);
    }
    if (!_isNil(this._condition.blCdGroupCodeStart) && !_isNil(this._condition.blCdGroupCodeEnd)
      && this._condition.blCdGroupCodeStart !== 0 && this._condition.blCdGroupCodeEnd !== 0
      && this._condition.blCdGroupCodeStart > this._condition.blCdGroupCodeEnd) {
      observer = { message: 'グループコードの範囲指定に誤りがあります。', childElement: this.blCdGroupCodeRange };
      return RxOf(observer);
    }
    if (!_isNil(this._condition.blPartsCdStart) && !_isNil(this._condition.blPartsCdEnd)
      && this._condition.blPartsCdStart !== 0 && this._condition.blPartsCdEnd !== 0
      && this._condition.blPartsCdStart > this._condition.blPartsCdEnd) {
      observer = { message: 'BLコードの範囲指定に誤りがあります。', childElement: this.blPartsCdRange };
      return RxOf(observer);
    }
    if (!_isNil(this._condition.itemMakerCdStart) && !_isNil(this._condition.itemMakerCdEnd)
      && this._condition.itemMakerCdStart !== 0 && this._condition.itemMakerCdEnd !== 0
      && this._condition.itemMakerCdStart > this._condition.itemMakerCdEnd) {
      observer = { message: 'メーカーの範囲指定に誤りがあります。', childElement: this.itemMakerCdRange };
      return RxOf(observer);
    }
    if (!_isNil(this._condition.supplierCdStart) && !_isNil(this._condition.supplierCdEnd)
      && this._condition.supplierCdStart !== 0 && this._condition.supplierCdEnd !== 0
      && this._condition.supplierCdStart > this._condition.supplierCdEnd) {
      observer = { message: '仕入先の範囲指定に誤りがあります。', childElement: this.supplierCdRange };
      return RxOf(observer);
    }
    if (!_isNil(this._condition.salesDivStart) && !_isNil(this._condition.salesDivEnd)
      && this._condition.salesDivStart !== 0 && this._condition.salesDivEnd !== 0
      && this._condition.salesDivStart > this._condition.salesDivEnd) {
      observer = { message: '販売区分の範囲指定に誤りがあります。', childElement: this.salesDivRange };
      return RxOf(observer);
    }
    if (!_isNil(this._condition.whCodeStart) && !_isNil(this._condition.whCodeEnd)
      && !_isEmpty(this._condition.whCodeStart) && !_isEmpty(this._condition.whCodeEnd)
      && this._condition.whCodeStart > this._condition.whCodeEnd) {
      observer = { message: '倉庫の範囲指定に誤りがあります。', childElement: this.whCodeRange };
      return RxOf(observer);
    }
    if (!_isNil(this._condition.shelfNumStart) && !_isNil(this._condition.shelfNumEnd)
      && !_isEmpty(this._condition.shelfNumStart) && !_isEmpty(this._condition.shelfNumEnd)
      && this._condition.shelfNumStart > this._condition.shelfNumEnd) {
      observer = { message: '棚番の範囲指定に誤りがあります。', childElement: this.shelfNumRange };
      return RxOf(observer);
    }
    return RxOf(observer);
  }

  /**
   * クエリパラメータを生成します。
   */
  protected makeGenericExportInstruction(): IGenericExportInstruction {
    // 出力単位
    if (this.exportInfoDiv === ExportInfoDiv.SalesSlip) {
      this._condition.salesSlipExportUnitDiv = SalesSlipExportUnitDiv.Slip;
    } else if (this.exportInfoDiv === ExportInfoDiv.SalesSlipDetail) {
      this._condition.salesSlipExportUnitDiv = SalesSlipExportUnitDiv.Detail;
    }

    // 組織の編集
    // 全組織が選択されていた場合、全ての組織コードを送る
    if (this.organizationCode === CompanyConst.ORGANIZATION_CODE_ALL_COMPANY) {
      this._condition.organizationCodeList = _map(this.organizationList, o => o.organizationCode);
    } else {
      this._condition.organizationCodeList = [this.organizationCode]
    }

    return _cloneDeep({
      exportInfoTabDiv: this.exportInfoTabDiv,
      exportInfoDiv: this.exportInfoDiv,
      extractConditionString: JSON.stringify(this._condition),
      exportPatternCode: this.exportPatternCode
    });
  }

  /**
   * 操作履歴ログを登録します。
   */
  protected postOperationHistoryLog() {
    const entity: IOpeHistory = {
      productCode: ProductCode.Partsman,
      logicalDeleteDiv: LogicalDeleteDiv.Valid,
      functionCategoryDiv: FunctionCategoryDiv.Entry,
      blTenantId: this.loginUser.blTenantId,
      organizationCode: this.loginUser.organizationCode,
      organizationName: this.loginUser.organizationName,
      createEmployeeCode: this.loginUser.employeeCode,
      createEmployeeName: this.loginUser.employeeName,
      opeHistoryFunctionName: 'データ出力',
      opeDiv: OpeDiv.DataOutput,
      opeHistoryDtlValueList: [`出力データ：${this.exportInfoName}`],
    };

    this.opeHistoryResource.post<IOpeHistory>(entity).pipe(
      catchError(() => {
        return RxOf(null);
      })
    ).subscribe();
  }

  /**
   * 出力情報変更イベントハンドラ
   * @param exportInfoDiv 出力情報区分
   */
  onChangeExportInfo(exportInfoDiv: string) {
    this.initCondition();
    this.exportInfoDiv = exportInfoDiv;
    this.exportInfoName = ExportInfoDivMap[exportInfoDiv];
  }

  /**
   * 得意先ガイド　クリックイベントハンドラ
   * @param button ガイドボタン
   * @param isStart 開始入力フラグ
   */
  onClickCustomerGuide(button: HTMLButtonElement, isStart: boolean) {
    if (this.modalService.isShown()) {
      return;
    }

    const data = {
      title: '得意先',
      productCode: ProductCode.Partsman,
      customerKind: [CustomerKind.Customer],
      customerKindEnableFlag: false
    };

    this._modalService.show(CustomerGuideComponent, { data }).subscribe(
      (modalRef: BlModalRef) => {
        if (modalRef.reason === ModalReason.Done) {
          const result = modalRef.getResults();

          if (!_isNil(result.customerCode)) {
            modalRef.hide();

            if (isStart) {
              this._condition.customerCodeStart = result.customerCode;
              this.customerCodeRange.focusStart();
            } else {
              this._condition.customerCodeEnd = result.customerCode;
              this.customerCodeRange.focusEnd();
            }

            return;
          }
        }

        modalRef.hide(button);
      }
    );
  }

  /**
   * ユーザーガイド　クリックイベントハンドラ
   * @param button ガイドボタン
   * @param isStart 開始入力フラグ
   * @param codeDivGenre コード区分分類
   */
  onClickUserGuide(button: HTMLButtonElement, isStart: boolean, codeDivGenre: string) {
    if (this.modalService.isShown()) {
      return;
    }

    const data = {
      cdDivClassCd: codeDivGenre,
      isPartsman: true
    };

    this._modalService.show(UserGuideComponent, { data }).subscribe(
      (modalRef: BlModalRef) => {
        if (modalRef.reason === ModalReason.Done) {
          const result = modalRef.getResults();

          if (!_isNil(result.cdDivCd)) {
            modalRef.hide();

            switch (codeDivGenre) {
              case CodeDivGenre.AreaType:
                if (isStart) {
                  this._condition.areaCdStart = result.cdDivCd;
                  this.areaCdRange.focusStart();
                } else {
                  this._condition.areaCdEnd = result.cdDivCd;
                  this.areaCdRange.focusEnd();
                }
                break;

              case CodeDivGenre.BusinessCode:
                if (isStart) {
                  this._condition.businessCodeStart = result.cdDivCd;
                  this.businessCodeRnage.focusStart();
                } else {
                  this._condition.businessCodeEnd = result.cdDivCd;
                  this.businessCodeRnage.focusEnd();
                }
                break;

              case CodeDivGenre.ItemLClass:
                if (isStart) {
                  this._condition.itemLClassCdStart = result.cdDivCd;
                  this.itemLClassCdRange.focusStart();
                } else {
                  this._condition.itemLClassCdEnd = result.cdDivCd;
                  this.itemLClassCdRange.focusEnd();
                }
                break;

              case CodeDivGenre.SalesDiv:
                if (isStart) {
                  this._condition.salesDivStart = result.cdDivCd;
                  this.salesDivRange.focusStart();
                } else {
                  this._condition.salesDivEnd = result.cdDivCd;
                  this.salesDivRange.focusEnd();
                }
                break;
            }

            return;
          }
        }

        modalRef.hide(button);
      }
    );
  }

  /**
   * 従業員ガイド　クリックイベントハンドラ
   * @param button ガイドボタン
   * @param isStart 開始入力フラグ
   */
  onClickEmployeeGuide(button: HTMLButtonElement, isStart: boolean, name: string) {
    if (this.modalService.isShown()) {
      return;
    }

    let title = '';
    switch (name) {
      case 'picEmployee':
        title = '担当者';
        break;
      case 'orderEmployee':
        title = '受注者';
        break;
      case 'issueEmployee':
        title = '発行者';
        break;
    }

    const data = {
      title: title,
      productCode: ProductCode.Partsman
    };

    this._modalService.show(EmployeeGuideComponent, { data }).subscribe(
      (modalRef: BlModalRef) => {
        if (modalRef.reason === ModalReason.Done) {
          const result = modalRef.getResults();

          if (!_isNil(result.employeeCode)) {
            modalRef.hide();

            switch (name) {
              case 'picEmployee':
                if (isStart) {
                  this._condition.picEmployeeCodeStart = this.padEmployeeCode(result.employeeCode);
                  this.picEmployeeCodeRange.focusStart();
                } else {
                  this._condition.picEmployeeCodeEnd = this.padEmployeeCode(result.employeeCode);
                  this.picEmployeeCodeRange.focusEnd();
                }
                break;

              case 'orderEmployee':
                if (isStart) {
                  this._condition.orderEmployeeCodeStart = this.padEmployeeCode(result.employeeCode);
                  this.orderEmployeeCodeRange.focusStart();
                } else {
                  this._condition.orderEmployeeCodeEnd = this.padEmployeeCode(result.employeeCode);
                  this.orderEmployeeCodeRange.focusEnd();
                }
                break;

              case 'issueEmployee':
                if (isStart) {
                  this._condition.issueEmployeeCodeStart = this.padEmployeeCode(result.employeeCode);
                  this.issueEmployeeCodeRange.focusStart();
                } else {
                  this._condition.issueEmployeeCodeEnd = this.padEmployeeCode(result.employeeCode);
                  this.issueEmployeeCodeRange.focusEnd();
                }
                break;
            }

            return;
          }
        }

        modalRef.hide(button);
      }
    );
  }

  /**
   * 商品中分類ガイド　クリックイベントハンドラ
   * @param button ガイドボタン
   * @param isStart 開始入力フラグ
   */
  onClickItemMClassGuide(button: HTMLButtonElement, isStart: boolean) {
    if (this.modalService.isShown()) {
      return;
    }

    // ガイドの表示
    this._modalService.show(ItemMiddleClassGuideComponent).subscribe(
      (modalRef: BlModalRef) => {
        if (modalRef.reason === ModalReason.Done) {
          const result = modalRef.getResults();

          if (!_isNil(result.itemMClassCd)) {
            modalRef.hide();

            if (isStart) {
              this._condition.itemMClassCdStart = result.itemMClassCd;
              this.itemMClassCdRange.focusStart();
            } else {
              this._condition.itemMClassCdEnd = result.itemMClassCd;
              this.itemMClassCdRange.focusEnd();
            }

            return;
          }
        }

        modalRef.hide(button);
      }
    );
  }

  /**
   * グループコードガイド　クリックイベントハンドラ
   * @param button ガイドボタン
   * @param isStart 開始入力フラグ
   */
  onClickBlCdGroupCodeGuide(button: HTMLButtonElement, isStart: boolean) {
    if (this.modalService.isShown()) {
      return;
    }

    this._modalService.show(BlGroupCodeGuideComponent).subscribe(
      (modalRef: BlModalRef) => {
        if (modalRef.reason === ModalReason.Done) {
          const result = modalRef.getResults();

          if (!_isNil(result.blCdGroupCode)) {
            modalRef.hide();

            if (isStart) {
              this._condition.blCdGroupCodeStart = result.blCdGroupCode;
              this.blCdGroupCodeRange.focusStart();
            } else {
              this._condition.blCdGroupCodeEnd = result.blCdGroupCode;
              this.blCdGroupCodeRange.focusEnd();
            }

            return;
          }
        }

        modalRef.hide(button);
      }
    );
  }

  /**
   * BLコードガイド　クリックイベントハンドラ
   * @param button ガイドボタン
   * @param isStart 開始入力フラグ
   */
  onClickBlPrtsCdGuide(button: HTMLButtonElement, isStart: boolean) {
    if (this.modalService.isShown()) {
      return;
    }

    this._modalService.show(BlCodeGuideComponent).subscribe(
      (modalRef: BlModalRef) => {
        if (modalRef.reason === ModalReason.Done) {
          const result = modalRef.getResults();

          if (!_isNil(result.blPrtsCd)) {
            modalRef.hide();

            if (isStart) {
              this._condition.blPartsCdStart = result.blPrtsCd;
              this.blPartsCdRange.focusStart();
            } else {
              this._condition.blPartsCdEnd = result.blPrtsCd;
              this.blPartsCdRange.focusEnd();
            }

            return;
          }
        }

        modalRef.hide(button);
      }
    );
  }

  /**
   * メーカーガイド　クリックイベントハンドラ
   * @param button ガイドボタン
   * @param isStart 開始入力フラグ
   */
  onClickItemMakerGuide(button: HTMLButtonElement, isStart: boolean) {
    if (this.modalService.isShown()) {
      return;
    }

    this._modalService.show(ItemMakerNameGuideComponent).subscribe(
      (modalRef: BlModalRef) => {
        if (modalRef.reason === ModalReason.Done) {
          const result = modalRef.getResults();

          if (!_isNil(result.itemMakerCd)) {
            modalRef.hide();

            if (isStart) {
              this._condition.itemMakerCdStart = result.displayItemMakerCd;
              this.itemMakerCdRange.focusStart();
            } else {
              this._condition.itemMakerCdEnd = result.displayItemMakerCd;
              this.itemMakerCdRange.focusEnd();
            }

            return;
          }
        }

        modalRef.hide(button);
      }
    );
  }

  /**
   * 仕入先ガイド　クリックイベントハンドラ
   * @param button ガイドボタン
   * @param isStart 開始入力フラグ
   */
  onClickSupplierGuide(button: HTMLButtonElement, isStart: boolean) {
    if (this.modalService.isShown()) {
      return;
    }

    this._modalService.show(SupplierGuideComponent).subscribe(
      (modalRef: BlModalRef) => {
        if (modalRef.reason === ModalReason.Done) {
          const result = modalRef.getResults();

          if (!_isNil(result.supplierCd)) {
            modalRef.hide();

            if (isStart) {
              this._condition.supplierCdStart = result.supplierCd;
              this.supplierCdRange.focusStart();
            } else {
              this._condition.supplierCdEnd = result.supplierCd;
              this.supplierCdRange.focusEnd();
            }

            return;
          }
        }

        modalRef.hide(button);
      }
    );
  }

  /**
   * 倉庫ガイド　クリックイベントハンドラ
   * @param button ガイドボタン
   * @param isStart 開始入力フラグ
   */
  onClickWarehouseGuide(button: HTMLButtonElement, isStart: boolean) {
    if (this.modalService.isShown()) {
      return;
    }

    this._modalService.show(WarehouseGuideComponent).subscribe(
      (modalRef: BlModalRef) => {
        if (modalRef.reason === ModalReason.Done) {
          const result = modalRef.getResults();

          if (!_isNil(result.whCode)) {
            modalRef.hide();

            if (isStart) {
              this._condition.whCodeStart = result.whCode;
              this.whCodeRange.focusStart();
            } else {
              this._condition.whCodeEnd = result.whCode;
              this.whCodeRange.focusEnd();
            }

            return;
          }
        }

        modalRef.hide(button);
      }
    );
  }

  /**
   * 従業員コード文字列を5桁まで処理する
   * @param origin 入力文字列
   * @returns 処理済文字列
   */
  private padEmployeeCode(origin: string): string {
    if (_isNil(origin) || _isEmpty(origin)) {
      // 未入力の場合、そのまま返却する
      return origin;
    } else if (origin.length >= 6) {
      // 6桁以上の場合、画面エラーしないを回避するために、5桁までを返却する(既存データと考える)
      return origin.substring(0, 5);
    } else if (_isNaN(_toNumber(origin))) {
      // 非数字場合、画面エラーしないを回避するために、そのまま返却する(既存データと考える)
      return origin;
    } else {
      // 0を補足する
      return StringUtils.paddingLeft(origin, 5, '0');
    }
  }

}
