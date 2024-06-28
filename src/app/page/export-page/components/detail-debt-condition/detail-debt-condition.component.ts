import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
} from '@angular/core';
import { AbstractConditionsComponent } from '../abstract-conditions.component';
import { IDetailDebtCondition } from './detail-debt-condition.define';

/**
 * 債務詳細条件コンポーネント
 */
@Component({
  selector: 'app-detail-debt-condition',
  templateUrl: './detail-debt-condition.component.html',
  styleUrls: ['./detail-debt-condition.component.scss'],
  providers: [],
})
export class DetailDebtConditionComponent extends AbstractConditionsComponent implements OnInit {
  /** 詳細条件 */
  @Input() detailDebtCondition: IDetailDebtCondition;
  /** 変更イベント */
  @Output() changeEvent: EventEmitter<IDetailDebtCondition> = new EventEmitter();
  /** 条件クリアイベント */
  @Output() clearCondition: EventEmitter<IDetailDebtCondition> = new EventEmitter();

  /** @implements */
  ngOnInit() {
    this._isOpened = false;
    this.clear();
  }

  /** クリア */
  clear(): void {
    this.detailDebtCondition = {
      payeeCodeS: '',
      payeeCodeE: '',
      payeeNameKanaS: '',
      payeeNameKanaE: ''
    };
    this.changeEvent.emit(this.detailDebtCondition);
  }

  /**
   * 変更イベント支払先コード
   * @param $event 支払先コード
   * @param startOrEnd 範囲の開始(ge: GreaterThanEqual) か 終了(le: LessThanEqual)
   */
  public onChangePayeeCode($event, startOrEnd: string) {
    if (startOrEnd === 'ge') {
      this.detailDebtCondition.payeeCodeS = $event;
    } else {
      this.detailDebtCondition.payeeCodeE = $event;
    }
    this.emitValue();
  }

  /**
   * 変更イベント支払先カナ
   * @param $event 支払先カナ
   * @param startOrEnd 範囲の開始(ge: GreaterThanEqual) か 終了(le: LessThanEqual)
   */
  public onChangePayeeNameKana($event, startOrEnd: string) {
    if (startOrEnd === 'ge') {
      this.detailDebtCondition.payeeNameKanaS = $event;
    } else {
      this.detailDebtCondition.payeeNameKanaE = $event;
    }
    this.emitValue();
  }

  /** 変更イベント発火 */
  emitValue(): void {
    this.changeEvent.emit(this.detailDebtCondition);
  }

  /** 条件取消ボタンクリックイベント */
  onClickClearButton(): void {
    this.clearCondition.emit();
  }
}
