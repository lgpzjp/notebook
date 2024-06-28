import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
} from '@angular/core';
import { AbstractConditionsComponent } from '../abstract-conditions.component';
import { IDetailCreditCondition } from './detail-credit-condition.define';

/**
 * 入金請求詳細条件コンポーネント
 */
@Component({
  selector: 'app-detail-credit-condition',
  templateUrl: './detail-credit-condition.component.html',
  styleUrls: ['./detail-credit-condition.component.scss'],
})
export class DetailCreditConditionComponent extends AbstractConditionsComponent implements OnInit {
  /** 詳細条件 */
  @Input() detailCreditCondition: IDetailCreditCondition;

  /** 変更イベント */
  @Output() changeEvent: EventEmitter<IDetailCreditCondition> = new EventEmitter();
  /** 条件クリアイベント */
  @Output() clearCondition: EventEmitter<IDetailCreditCondition> = new EventEmitter();

  /** @implements */
  ngOnInit() {
    this._isOpened = false;
    this.clear();
  }

  /** クリア */
  clear(): void {
    this.detailCreditCondition = {
      billingCodeS: '',
      billingCodeE: '',
      billingNameKanaS: '',
      billingNameKanaE: ''
    };
    this.changeEvent.emit(this.detailCreditCondition);
  }

  /**
   * 変更イベント請求先コード
   * @param $event 請求先コード
   * @param startOrEnd 範囲の開始(ge: GreaterThanEqual) か 終了(le: LessThanEqual)
   */
  public onChangeBillingCode($event, startOrEnd: string) {
    if (startOrEnd === 'ge') {
      this.detailCreditCondition.billingCodeS = $event;
    } else {
      this.detailCreditCondition.billingCodeE = $event;
    }
    this.emitValue();
  }

  /**
   * 変更イベント請求先カナ
   * @param $event 請求先カナ
   * @param startOrEnd 範囲の開始(ge: GreaterThanEqual) か 終了(le: LessThanEqual)
   */
  public onChangeBillingNameKana($event, startOrEnd: string) {
    if (startOrEnd === 'ge') {
      this.detailCreditCondition.billingNameKanaS = $event;
    } else {
      this.detailCreditCondition.billingNameKanaE = $event;
    }
    this.emitValue();
  }

  /** 変更イベント発火 */
  emitValue(): void {
    this.changeEvent.emit(this.detailCreditCondition);
  }

  /** 条件取消ボタンクリックイベント */
  onClickClearButton(): void {
    this.clearCondition.emit();
  }
}
