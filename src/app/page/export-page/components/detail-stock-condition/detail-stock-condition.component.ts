import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
} from '@angular/core';
import { AbstractConditionsComponent } from '../abstract-conditions.component';
import { IDetailStockCondition } from './detail-stock-condition.define';

/**
 * 在庫詳細条件コンポーネント
 */
@Component({
  selector: 'app-detail-stock-condition',
  templateUrl: './detail-stock-condition.component.html',
  styleUrls: ['./detail-stock-condition.component.scss'],
  providers: [],
})
export class DetailStockConditionComponent extends AbstractConditionsComponent implements OnInit {
  /** 詳細条件 */
  @Input() detailStockCondition: IDetailStockCondition;
  /** 変更イベント */
  @Output() changeEvent: EventEmitter<IDetailStockCondition> = new EventEmitter();
  /** 条件クリアイベント */
  @Output() clearCondition: EventEmitter<IDetailStockCondition> = new EventEmitter();

  /** @implements */
  ngOnInit() {
    this._isOpened = false;
    this.clear();
  }

  /** クリア */
  clear(): void {
    this.detailStockCondition = {
      whCodeS: '',
      whCodeE: '',
      shelfNumS: '',
      shelfNumE: '',
      supplierCdS: '',
      supplierCdE: '',
      itemMakerCdS: '',
      itemMakerCdE: '',
      itemLClassCdS: '',
      itemLClassCdE: '',
      itemMClassCdS: '',
      itemMClassCdE: '',
      blCdGroupCodeS: '',
      blCdGroupCodeE: '',
      blPrtsCdS: '',
      blPrtsCdE: '',
      searchItemPartsNumber: '',
      searchItemPartsName: ''
    };
    this.changeEvent.emit(this.detailStockCondition);
  }

  /**
   * 変更イベント倉庫コード
   * @param $event 倉庫コード
   * @param startOrEnd 範囲の開始(ge: GreaterThanEqual) か 終了(le: LessThanEqual)
   */
  public onChangeWhCode($event, startOrEnd: string) {
    if (startOrEnd === 'ge') {
      this.detailStockCondition.whCodeS = $event;
    } else {
      this.detailStockCondition.whCodeE = $event;
    }
    this.emitValue();
  }

  /**
   * 変更イベント棚番
   * @param $event 棚番
   * @param startOrEnd 範囲の開始(ge: GreaterThanEqual) か 終了(le: LessThanEqual)
   */
  public onChangeShelfNum($event, startOrEnd: string) {
    if (startOrEnd === 'ge') {
      this.detailStockCondition.shelfNumS = $event;
    } else {
      this.detailStockCondition.shelfNumE = $event;
    }
    this.emitValue();
  }

  /**
   * 変更イベント仕入先コード
   * @param $event 仕入先コード
   * @param startOrEnd 範囲の開始(ge: GreaterThanEqual) か 終了(le: LessThanEqual)
   */
  public onChangeSupplierCd($event, startOrEnd: string) {
    if (startOrEnd === 'ge') {
      this.detailStockCondition.supplierCdS = $event;
    } else {
      this.detailStockCondition.supplierCdE = $event;
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
      this.detailStockCondition.itemMakerCdS = $event;
    } else {
      this.detailStockCondition.itemMakerCdE = $event;
    }
    this.emitValue();
  }

  /**
   * 変更イベント商品大分類コード
   * @param $event 商品大分類コード
   * @param startOrEnd 範囲の開始(ge: GreaterThanEqual) か 終了(le: LessThanEqual)
   */
  public onChangeItemLClassCd($event, startOrEnd: string) {
    if (startOrEnd === 'ge') {
      this.detailStockCondition.itemLClassCdS = $event;
    } else {
      this.detailStockCondition.itemLClassCdE = $event;
    }
    this.emitValue();
  }

  /**
   * 変更イベント商品中分類コード
   * @param $event 商品中分類コード
   * @param startOrEnd 範囲の開始(ge: GreaterThanEqual) か 終了(le: LessThanEqual)
   */
  public onChangeItemMClassCd($event, startOrEnd: string) {
    if (startOrEnd === 'ge') {
      this.detailStockCondition.itemMClassCdS = $event;
    } else {
      this.detailStockCondition.itemMClassCdE = $event;
    }
    this.emitValue();
  }

  /**
   * 変更イベントグループコード
   * @param $event グループコード
   * @param startOrEnd 範囲の開始(ge: GreaterThanEqual) か 終了(le: LessThanEqual)
   */
  public onChangeBlCdGroupCode($event, startOrEnd: string) {
    if (startOrEnd === 'ge') {
      this.detailStockCondition.blCdGroupCodeS = $event;
    } else {
      this.detailStockCondition.blCdGroupCodeE = $event;
    }
    this.emitValue();
  }

  /**
   * 変更イベントBLコード
   * @param $event BLコード
   * @param startOrEnd 範囲の開始(ge: GreaterThanEqual) か 終了(le: LessThanEqual)
   */
  public onChangeBlPrtsCd($event, startOrEnd: string) {
    if (startOrEnd === 'ge') {
      this.detailStockCondition.blPrtsCdS = $event;
    } else {
      this.detailStockCondition.blPrtsCdE = $event;
    }
    this.emitValue();
  }

  /** 変更イベント発火 */
  emitValue(): void {
    this.changeEvent.emit(this.detailStockCondition);
  }

  /** 条件取消ボタンクリックイベント */
  onClickClearButton(): void {
    this.clearCondition.emit();
  }
}
