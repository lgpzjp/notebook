import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
} from '@angular/core';
import { AbstractConditionsComponent } from '../abstract-conditions.component';
import { PurchaseSlipOrganizationSelectArray } from '@blcloud/bl-datamodel/enum/purchase/purchase-slip-organization-select';
import { PurchaseSlipSupplierSelectArray } from '@blcloud/bl-datamodel/enum/purchase/purchase-slip-supplier-select';
import { IExportPurchaseSlipConditionInput } from './detail-purchase-slip-condition.define';

/**
 * 仕入伝票詳細条件コンポーネント
 */
@Component({
  selector: 'app-detail-purchase-slip-condition',
  templateUrl: './detail-purchase-slip-condition.component.html',
  styleUrls: ['./detail-purchase-slip-condition.component.scss'],
})
export class DetailPurchaseSlipConditionComponent extends AbstractConditionsComponent implements OnInit {
  /** 顧客詳細条件 */
  @Input() detailCustomerCondition: IExportPurchaseSlipConditionInput;

  /** 変更イベント */
  @Output() changeEvent: EventEmitter<IExportPurchaseSlipConditionInput> = new EventEmitter();
  /** 条件クリアイベント */
  @Output() clearCondition: EventEmitter<IExportPurchaseSlipConditionInput> = new EventEmitter();
  /** 組織変更イベント */
  @Output() changeSalseRecordedOrganizationEvent: EventEmitter<Event> = new EventEmitter();

  /** 顧客情報表示有無 */
  public isShowCustomerInfo  = true;
  /** 詳細条件表示有無 */
  public showDetailFlg = true;

  /** 仕入伝票情報組織選択配列 */
  public readonly purchaseSlipOrganizationSelectArray = PurchaseSlipOrganizationSelectArray;
  /** 入伝票情報仕入先選択配列 */
  public readonly purchaseSlipSupplierSelectArray = PurchaseSlipSupplierSelectArray;

  /** 初期化 */
  ngOnInit() {
    this._isOpened = false;
  }

  /**
   * 組織変更イベント
   * @param $event
   */
  onChangeOrganizationCtrlDivs($event): void {
    this.changeSalseRecordedOrganizationEvent.emit($event);
  }

  /**
   * 変更イベント担当者コード
   * @param $event 担当者コード
   * @param startOrEnd 範囲の開始(ge: GreaterThanEqual) か 終了(le: LessThanEqual)
   */
  public onChangePicEmployeeCode($event, startOrEnd: string) {
    if (startOrEnd === 'ge') {
      this.detailCustomerCondition.picEmployeeCodeStart = $event;
    } else {
      this.detailCustomerCondition.picEmployeeCodeEnd = $event;
    }
    this.emitValue();
  }

  /**
   * 変更イベント仕入先コード
   * @param $event 仕入先コード
   * @param startOrEnd 範囲の開始(ge: GreaterThanEqual) か 終了(le: LessThanEqual)
   */
  public onChangePayeeCode($event, startOrEnd: string) {
    if (startOrEnd === 'ge') {
      this.detailCustomerCondition.payeeCodeStart = $event;
    } else {
      this.detailCustomerCondition.payeeCodeEnd = $event;
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

  /**
   * 変更イベント倉庫コード
   * @param $event 倉庫コード
   * @param startOrEnd 範囲の開始(ge: GreaterThanEqual) か 終了(le: LessThanEqual)
   */
  public onChangeWhCode($event, startOrEnd: string) {
    if (startOrEnd === 'ge') {
      this.detailCustomerCondition.whCodeStart = $event;
    } else {
      this.detailCustomerCondition.whCodeEnd = $event;
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
      this.detailCustomerCondition.itemMakerCdStart = $event;
    } else {
      this.detailCustomerCondition.itemMakerCdEnd = $event;
    }
    this.emitValue();
  }

  /**
   * 変更イベント品番
   * @param $event 品番
   */
  public onChangePartsNumber($event) {
    this.detailCustomerCondition.partsNumber = $event;
    this.emitValue();
  }

  /**
   * 変更イベント品名
   * @param $event 品名
   */
  public onChangePartsName($event) {
    this.detailCustomerCondition.partsName = $event;
    this.emitValue();
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
