import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  Input,
  OnChanges
} from '@angular/core';
import { AbstractConditionsComponent } from '../abstract-conditions.component';
import { IExportSalesSlipConditionInput } from '../../../../feature/export-sales-slip/export-sales-slip.define';
import { ExportSlipTypeDiv } from '@blcloud/bl-datamodel/enum/output/export-slip-type-div';
import { ExportSalesSlipService } from '../../../../feature/export-sales-slip/export-sales-slip.service';
import {
  SalesSlipOrganizationSelectArray, SalesSlipOrganizationSelect
} from '@blcloud/bl-datamodel/enum/sales/sales-slip-organization-select';
import {
  SalesSlipTargetPeriodDivArray, SalesSlipTargetPeriodDiv
} from '@blcloud/bl-datamodel/enum/sales/sales-slip-target-period-div';

/**
 * 売上伝票詳細条件
 */
@Component({
  selector: 'app-detail-sales-slip-condition',
  templateUrl: './detail-sales-slip-condition.component.html',
  styleUrls: ['./detail-sales-slip-condition.component.scss'],
  providers: [ExportSalesSlipService],
})
export class DetailSalesSlipConditionComponent extends AbstractConditionsComponent implements OnInit, OnChanges {
  /** 売上伝票出力条件 */
  @Input() detailSalesSlipCondition: IExportSalesSlipConditionInput;
  /** 組織選択可否 */
  @Input() organizationSelectPossible: true;
  /** 顧客選択可否 */
  @Input() customerSelectPossible: true;
  /** 出力情報タイプ */
  @Input() exportInfoType: string;

  /** 変更イベント */
  @Output() changeEvent: EventEmitter<IExportSalesSlipConditionInput> = new EventEmitter();
  /** 組織変更イベント */
  @Output() changeOrganizationSelectEvent: EventEmitter<string> = new EventEmitter();
  /** 顧客変更イベント */
  @Output() changeCustomerSelectEvent: EventEmitter<string> = new EventEmitter();
  /** 条件クリアイベント */
  @Output() clearCondition: EventEmitter<void> = new EventEmitter();

  /** 出力情報タイプが伝票明細か */
  public exportInfoTypeIsSlipDetail = false;

  /** 『売上伝票情報組織選択』配列 */
  public SalesSlipOrganizationSelectArray = SalesSlipOrganizationSelectArray;
  /** 『売上伝票情報得意先選択』配列 */
  public SalesSlipTargetPeriodDivArray = SalesSlipTargetPeriodDivArray;

  constructor(
    protected exportSalesSlipService: ExportSalesSlipService
  ) {
    super();
  }

  /** @implements */
  ngOnInit() {
    this._isOpened = false;
  }

  /** @implements */
  ngOnChanges() {

    if (!this.organizationSelectPossible) {
      // EL2-5-2(組織選択)は選択不可、「請求組織」を設定値とする。
      this.detailSalesSlipCondition.organizationSelect = SalesSlipOrganizationSelect.BillingOrganization;
    }

    if (!this.customerSelectPossible) {
      // EL2-5-3(得意先選択)は選択不可、「請求先」を設定値とする。
      this.detailSalesSlipCondition.customerSelect = SalesSlipTargetPeriodDiv.Billing;
    }

    // 出力タイプが「伝票明細タイプ」の場合
    if (this.exportInfoType === ExportSlipTypeDiv.SlipDetail) {
      this.exportInfoTypeIsSlipDetail = true;
    } else {
      this.exportInfoTypeIsSlipDetail = false;
    }

    this.emitValue();
  }

  /**
   * 変更イベント組織選択
   * @param $event
   */
  onChangeOrganizationSelect($event: string): void {
    this.detailSalesSlipCondition.organizationSelect = $event;
    this.changeOrganizationSelectEvent.emit($event);
  }

  /**
   * 変更イベント得意先選択
   * @param $event
   */
  onChangeCustomerSelect($event: string): void {
    this.detailSalesSlipCondition.customerSelect = $event;
    this.changeCustomerSelectEvent.emit($event);
  }

  /**
   * 変更イベント担当者コード
   * @param $event 担当者コード
   * @param startOrEnd 範囲の開始(ge: GreaterThanEqual) か 終了(le: LessThanEqual)
   */
  public onChangePicEmployeeCode($event, startOrEnd: string) {
    if (startOrEnd === 'ge') {
      this.detailSalesSlipCondition.picEmployeeCodeS = $event;
    } else {
      this.detailSalesSlipCondition.picEmployeeCodeE = $event;
    }
    this.emitValue();
  }

  /**
   * 変更イベント得意先コード
   * @param $event 得意先コード
   * @param startOrEnd 範囲の開始(ge: GreaterThanEqual) か 終了(le: LessThanEqual)
   */
  public onChangeBillingCode($event, startOrEnd: string) {
    if (startOrEnd === 'ge') {
      this.detailSalesSlipCondition.billingCodeS = $event;
    } else {
      this.detailSalesSlipCondition.billingCodeE = $event;
    }
    this.emitValue();
  }

  /**
   * 変更イベント倉庫コード
   * @param $event 倉庫コード
   * @param startOrEnd 範囲の開始(ge: GreaterThanEqual) か 終了(le: LessThanEqual)
   */
  public onChangeWhCode($event, startOrEnd: string) {
    if (startOrEnd === 'ge') {
      this.detailSalesSlipCondition.whCodeS = $event;
    } else {
      this.detailSalesSlipCondition.whCodeE = $event;
    }
    this.emitValue();
  }

  /**
   * 変更イベントメーカーコード
   * @param $event メーカーコード
   * @param startOrEnd 範囲の開始(ge: GreaterThanEqual) か 終了(le: LessThanEqual)
   */
  public onChangeItemMakerCd($event, startOrEnd: string) {
    if (startOrEnd === 'ge') {
      this.detailSalesSlipCondition.itemMakerCdS = $event;
    } else {
      this.detailSalesSlipCondition.itemMakerCdE = $event;
    }
    this.emitValue();
  }

  /** 変更イベント発火 */
  emitValue(): void {
    this.changeEvent.emit(this.detailSalesSlipCondition);
  }

  /** 条件取消ボタンクリックイベント */
  onClickClearButton(): void {
    this.clearCondition.emit();
  }

}
