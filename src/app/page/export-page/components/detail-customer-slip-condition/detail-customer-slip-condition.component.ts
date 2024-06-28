import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  ViewChild,
} from '@angular/core';
import { AbstractConditionsComponent } from '../abstract-conditions.component';
import { CustomerDealsDivArray, CustomerDealsDiv } from '@blcloud/bl-datamodel/enum/credit/customer-deals-div';
import { SupplierDealsDivArray, SupplierDealsDiv } from '@blcloud/bl-datamodel/enum/debt/supplier-deals-div';
import { ExportCustomerSlipService } from '../../../../feature/export-customer-slip/export-customer-slip.service';
import {
  SalesSlipSupplierSelect, SalesSlipSupplierSelectMap
} from '@blcloud/bl-datamodel/enum/sales/sales-slip-supplier-select';
import {
  PurchaseSlipTargetPeriodDiv, PurchaseSlipTargetPeriodDivMap
} from '@blcloud/bl-datamodel/enum/purchase/purchase-slip-target-period-div';
import { DatePickerConditionComponent } from '../../components/date-picker-condition/date-picker-condition.component';
import { IExportCustomerSlipConditionInput } from './detail-customer-slip-condition.define';
import { IDropDownInput } from '../../export-page.define';

/**
 * 得意先伝票詳細条件コンポーネント
 */
@Component({
  selector: 'app-detail-customer-slip-condition',
  templateUrl: './detail-customer-slip-condition.component.html',
  styleUrls: ['./detail-customer-slip-condition.component.scss'],
  providers: [],
})
export class DetailCustomerSlipConditionComponent extends AbstractConditionsComponent implements OnInit {
  /** 詳細条件 */
  @Input() detailCustomerCondition: IExportCustomerSlipConditionInput;
  /** 得意先出力サービス */
  @Input() exportCustomerService: ExportCustomerSlipService;
  /** 初期選択プロダクトコード */
  @Input() productCode: string;

  /** 変更イベント */
  @Output() changeEvent: EventEmitter<IExportCustomerSlipConditionInput> = new EventEmitter();
  /** 条件クリアイベント */
  @Output() clearCondition: EventEmitter<IExportCustomerSlipConditionInput> = new EventEmitter();
  /** 取引有無変更イベント */
  @Output() changeSalseCodeEvent: EventEmitter<Event> = new EventEmitter();

  /** 日付入力コンポーネント */
  @ViewChild(DatePickerConditionComponent) datePickerCondition: DatePickerConditionComponent;

  /** 得意先取引区分 */
  public readonly CustomerDealsDivArray = CustomerDealsDivArray;
  /** 仕入先取引区分 */
  public readonly SupplierDealsDivArray = SupplierDealsDivArray;

  /** 対象期間(得意先) */
  public targetPeriodCustomer: IDropDownInput[] = [
    { code: SalesSlipSupplierSelect.UpdateDate, name: SalesSlipSupplierSelectMap[SalesSlipSupplierSelect.BillingCutoffDate] },
    { code: SalesSlipSupplierSelect.BillingCutoffDate, name: SalesSlipSupplierSelectMap[SalesSlipSupplierSelect.SlipDate] }
  ];

  /** 対象期間選択項目 */
  public targetPeriodItems: IDropDownInput[];
  /** 対象期間(仕入先) */
  public targetPeriodSupplier: IDropDownInput[] = [
    { code: PurchaseSlipTargetPeriodDiv.UpdateDate, name: PurchaseSlipTargetPeriodDivMap[PurchaseSlipTargetPeriodDiv.PayCutoffDate] },
    { code: PurchaseSlipTargetPeriodDiv.PayCutoffDate, name: PurchaseSlipTargetPeriodDivMap[PurchaseSlipTargetPeriodDiv.SlipDate] }
  ];

  /** 請求先表示フラグ */
  public billingFlg = true;
  /** 仕入先表示フラグ */
  public SupplierFlg = false;
  /** 対象期間表示フラグ */
  public isShowTargetPeriodFlg = false;
  /** 対象期間活性フラグ */
  public isShowTargetPeriod = false;
  /** 開始日 */
  public startDateDetail: string;
  /** 終了日 */
  public endDateDetail: string;

  /** 詳細画面フラグ */
  public detailDateCode = '1';


  /** @implements */
  ngOnInit() {
    this._isOpened = false;
  }

  /**
   * 変更イベント得意先コード
   * @param $event 得意先コード
   * @param startOrEnd 範囲の開始(ge: GreaterThanEqual) か 終了(le: LessThanEqual)
   */
  public onChangeBillingCode($event, startOrEnd: string) {
    if (startOrEnd === 'ge') {
      this.detailCustomerCondition.billingCodeStart = $event;
    } else {
      this.detailCustomerCondition.billingCodeEnd = $event;
    }
    this.emitValue();
  }

  /**
   * 変更イベント仕入先コード
   * @param $event 仕入先コード
   * @param startOrEnd 範囲の開始(ge: GreaterThanEqual) か 終了(le: LessThanEqual)
   */
  public onChangeSupplierCode($event, startOrEnd: string) {
    if (startOrEnd === 'ge') {
      this.detailCustomerCondition.supplierCdStart = $event;
    } else {
      this.detailCustomerCondition.supplierCdEnd = $event;
    }
    this.emitValue();
  }

  /**
   * 変更イベント締日
   * @param $event 締日
   */
  public onChangeCutoffDay($event) {

    this.detailCustomerCondition.cutoffDay = $event;
    this.emitValue();
  }

  /** 得意先取引有無変更イベント */
  public onChangeCustomerDealsDiv($event) {

    if ($event === CustomerDealsDiv.All) {
      this.isShowTargetPeriodFlg = false;
      this.detailCustomerCondition.customerDealsDiv = $event;
      if (this.datePickerCondition) {
        if (this.datePickerCondition.detailDateCode === '1') {
          this.datePickerCondition.displayStartButton = false;
          this.datePickerCondition.displayEndButton = false;
          this.datePickerCondition.displayStart = false;
          this.datePickerCondition.displayEnd = false;
          this.datePickerCondition.displayEndDate = true;
        }
      }
    } else {
      this.isShowTargetPeriodFlg = true;
      this.detailCustomerCondition.targetPeriod = $event;
      this.detailCustomerCondition.customerDealsDiv = $event;
      if (this.datePickerCondition) {
        this.datePickerCondition.displayStartButton = true;
        this.datePickerCondition.displayEndButton = true;
        if ($event === CustomerDealsDiv.Billing) {
          this.datePickerCondition.displayStart = true;
          this.datePickerCondition.displayEndDate = false;
        } else {
          this.datePickerCondition.displayEndDate = true;
          this.datePickerCondition.displayStart = true;
          this.datePickerCondition.displayEnd = true;
        }
      }
    }
    this.changeSalseCodeEvent.emit($event);
  }

  /** 支払先取引有無変更イベント */
  public onChangeSupplierDealsDiv($event) {
    if ($event === SupplierDealsDiv.All) {
      this.isShowTargetPeriodFlg = false;
      this.detailCustomerCondition.supplierDealsDiv = $event;
      if (this.datePickerCondition) {
        if (this.datePickerCondition.detailDateCode === '1') {
          this.datePickerCondition.displayStartButton = false;
          this.datePickerCondition.displayEndButton = false;
          this.datePickerCondition.displayStart = false;
          this.datePickerCondition.displayEnd = false;
          this.datePickerCondition.displayEndDate = true;
        }
      }
    } else {
      this.isShowTargetPeriodFlg = true;
      this.detailCustomerCondition.targetPeriod = $event;
      this.detailCustomerCondition.supplierDealsDiv = $event;
      if (this.datePickerCondition) {
        this.datePickerCondition.displayStartButton = true;
        this.datePickerCondition.displayEndButton = true;
        if ($event === SupplierDealsDiv.Pay) {
          this.datePickerCondition.displayStart = true;
          this.datePickerCondition.displayEndDate = false;
        } else {
          this.datePickerCondition.displayEndDate = true;
          this.datePickerCondition.displayStart = true;
          this.datePickerCondition.displayEnd = true;
        }
      }
    }
    this.changeSalseCodeEvent.emit($event);
  }

  /**
   * 変更イベント日付
   * @param $event 日付
   */
  public onChangeData() {
    if (this.datePickerCondition) {
      if (this.datePickerCondition.detailDateCode === '1') {
        this.datePickerCondition.startDate = this.startDateDetail;
        this.datePickerCondition.endDate = this.endDateDetail;
      }
    }
  }

  /** 開始日変更イベント */
  onStartDateDetailChange($event: string): void {
    this.detailCustomerCondition.startDateDetail = $event;
  }

  /** 終了日変更イベント */
  onEndDateDetailChange($event: string): void {
    this.detailCustomerCondition.endDateDetail = $event;
  }

  /** 変更イベント発火 */
  emitValue(): void {
    this.changeEvent.emit(this.detailCustomerCondition);
  }

  /** 条件取消ボタンクリックイベント */
  onClickClearButton(): void {
    this.clearCondition.emit();
  }
}
