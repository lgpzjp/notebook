import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
} from '@angular/core';
import { AbstractConditionsComponent } from '../abstract-conditions.component';
import { IExportRecycleCustomerConditionInput } from './detail-recycle-customer-condition.define';

/**
 * リサイクル取引先情報詳細条件コンポーネント
 */
@Component({
  selector: 'app-detail-recycle-customer-condition',
  templateUrl: './detail-recycle-customer-condition.component.html',
  styleUrls: ['./detail-recycle-customer-condition.component.scss'],
  providers: [],
})
export class DetailRecycleCustomerConditionComponent extends AbstractConditionsComponent implements OnInit {

  /** 詳細条件 */
  @Input() detailCondition: IExportRecycleCustomerConditionInput;
  /** 初期選択プロダクトコード */
  @Input() productCode: string;

  /** 変更イベント */
  @Output() changeEvent = new EventEmitter<IExportRecycleCustomerConditionInput>();
  /** 条件クリアイベント */
  @Output() clearCondition = new EventEmitter<IExportRecycleCustomerConditionInput>();

  /** @implements */
  ngOnInit() {
    this._isOpened = false;
  }

  /**
   * 変更イベント得意先コード
   * @param customerCode 得意先コード
   * @param startOrEnd 範囲の開始(ge: GreaterThanEqual) か 終了(le: LessThanEqual)
   */
  public onChangeCustomerCode(customerCode: string, startOrEnd: string) {
    if (startOrEnd === 'ge') {
      this.detailCondition.customerCodeStart = customerCode;
    } else {
      this.detailCondition.customerCodeEnd = customerCode;
    }
    this.emitValue();
  }

  /** 変更イベント発火 */
  emitValue(): void {
    this.changeEvent.emit(this.detailCondition);
  }

  /** 条件取消ボタンクリックイベント */
  onClickClearButton(): void {
    this.clearCondition.emit();
  }
}
