import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
} from '@angular/core';
import { AbstractConditionsComponent } from '../abstract-conditions.component';

@Component({
  selector: 'app-detail-customer-condition',
  templateUrl: './detail-customer-condition.component.html',
  styleUrls: ['./detail-customer-condition.component.scss'],
  providers: [],
})
export class DetailCustomerConditionComponent extends AbstractConditionsComponent implements OnInit {
  @Output() changeEvent: EventEmitter<IDetailCustomerCondition> = new EventEmitter();
  @Output() clearCondition: EventEmitter<IDetailCustomerCondition> = new EventEmitter();
  @Input() detailCustomerCondition: IDetailCustomerCondition;

  ngOnInit() {
    this._isOpened = false;
    this.clear();
  }

  clear(): void {
    this.detailCustomerCondition = {
      customerCodeS: '',
      customerCodeE: '',
      customerNameKana1: ''
    };
    this.changeEvent.emit(this.detailCustomerCondition);
  }

  /**
   * 変更イベント顧客コード
   * @param $event 顧客コード
   * @param key geかleかのタイプ
   */
  public onChangeCustomerCode($event, key: string) {
    if (key === 'ge') {
      this.detailCustomerCondition.customerCodeS = $event;
    } else {
      this.detailCustomerCondition.customerCodeE = $event;
    }
    this.emitValue();
  }

  /**
   * 変更イベント顧客フリガナ
   * @param value 顧客フリガナ
   */
  public onChangeCustomerNameKana1(value: string) {
    this.detailCustomerCondition.customerNameKana1 = value;
    this.emitValue();
  }

  emitValue(): void {
    this.changeEvent.emit(this.detailCustomerCondition);
  }

  clearSearch(): void {
    this.clearCondition.emit();
  }
}

export interface IDetailCustomerCondition {
  customerCodeS: string;
  customerCodeE: string;
  customerNameKana1: string;
}
