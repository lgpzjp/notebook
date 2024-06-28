import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
} from '@angular/core';
import { AbstractConditionsComponent } from '../abstract-conditions.component';
import { IExportStockMoveSlipConditionInput } from './detail-stock-move-slip-condition.define';

/**
 * 在庫移動伝票詳細条件コンポーネント
 */
@Component({
  selector: 'app-detail-stock-move-slip-condition',
  templateUrl: './detail-stock-move-slip-condition.component.html',
  styleUrls: ['./detail-stock-move-slip-condition.component.scss'],
  providers: [],
})
export class DetailStockMoveSlipConditionComponent extends AbstractConditionsComponent implements OnInit {
  /** 詳細条件 */
  @Input() detailStockMoveCondition: IExportStockMoveSlipConditionInput;
  /** 変更イベント */
  @Output() changeEvent: EventEmitter<IExportStockMoveSlipConditionInput> = new EventEmitter();
  /** 条件クリアイベント */
  @Output() clearCondition: EventEmitter<IExportStockMoveSlipConditionInput> = new EventEmitter();

  /** @implements */
  ngOnInit() {
    this._isOpened = false;
  }

  /**
   * 変更イベント出庫倉庫コード
   * @param $event 出庫倉庫コード
   * @param startOrEnd 範囲の開始(ge: GreaterThanEqual) か 終了(le: LessThanEqual)
   */
  public onChangeShippingWhCode($event, startOrEnd: string) {
    if (startOrEnd === 'ge') {
      this.detailStockMoveCondition.shippingWhCodeStart = $event;
    } else {
      this.detailStockMoveCondition.shippingWhCodeEnd = $event;
    }
    this.emitValue();
  }

  /**
   * 変更イベント入庫庫倉コード
   * @param $event 入庫庫倉コード
   * @param startOrEnd 範囲の開始(ge: GreaterThanEqual) か 終了(le: LessThanEqual)
   */
  public onChangeEnteringWhCode($event, startOrEnd: string) {
    if (startOrEnd === 'ge') {
      this.detailStockMoveCondition.enteringWhCodeStart = $event;
    } else {
      this.detailStockMoveCondition.enteringWhCodeEnd = $event;
    }
    this.emitValue();
  }

  /**
   * 変更イベント担当者コード
   * @param $event 担当者コード
   * @param startOrEnd 範囲の開始(ge: GreaterThanEqual) か 終了(le: LessThanEqual)
   */
  public onChangePicEmployeeCode($event, startOrEnd: string) {
    if (startOrEnd === 'ge') {
      this.detailStockMoveCondition.picEmployeeCodeStart = $event;
    } else {
      this.detailStockMoveCondition.picEmployeeCodeEnd = $event;
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
      this.detailStockMoveCondition.itemMakerCdStart = $event;
    } else {
      this.detailStockMoveCondition.itemMakerCdEnd = $event;
    }
    this.emitValue();
  }

  /**
   * 変更イベント品番
   * @param $event 品番
   */
  public onChangePartsNumber($event) {
    this.detailStockMoveCondition.partsNumber = $event;
    this.emitValue();
  }

  /**
   * 変更イベント品名
   * @param $event 品名
   */
  public onChangePartsName($event) {
    this.detailStockMoveCondition.partsName = $event;
    this.emitValue();
  }

  /** 変更イベント発火 */
  emitValue(): void {
    this.changeEvent.emit(this.detailStockMoveCondition);
  }

  /** 条件取消ボタンクリックイベント */
  onClickClearButton(): void {
    this.clearCondition.emit();
  }
}
