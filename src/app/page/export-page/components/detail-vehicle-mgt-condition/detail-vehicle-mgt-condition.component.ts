import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
} from '@angular/core';
import { AbstractConditionsComponent } from '../abstract-conditions.component';
import { VehicleStockBackorderDivArray, VehicleStockBackorderDiv } from '@blcloud/bl-datamodel/enum/stock/vehicle-stock-backorder-div';
import { IExportVehicleMgtConditionInput } from './detail-vehicle-mgt-condition.define';

/**
 * 車両管理詳細条件コンポーネント
 */
@Component({
  selector: 'app-detail-vehicle-mgt-condition',
  templateUrl: './detail-vehicle-mgt-condition.component.html',
  styleUrls: ['./detail-vehicle-mgt-condition.component.scss'],
})
export class DetailVehicleMgtConditionComponent extends AbstractConditionsComponent implements OnInit {
  /** 詳細条件 */
  @Input() detailVehicleMgtCondition: IExportVehicleMgtConditionInput;

  /** 変更イベント */
  @Output() changeEvent: EventEmitter<IExportVehicleMgtConditionInput> = new EventEmitter();
  /** 条件クリアイベント */
  @Output() clearCondition: EventEmitter<IExportVehicleMgtConditionInput> = new EventEmitter();
  /** 在庫取寄区分変更イベント */
  @Output() changeSalseCodeEvent: EventEmitter<Event> = new EventEmitter();

  /** 詳細表示フラグ */
  public showDetailFlg = true;
  /** 倉庫コード活性フラグ */
  public showWhCodeFlg = true;

  /** 車両情報在庫取寄区分配列 */
  public readonly VehicleStockBackorderDivArray = VehicleStockBackorderDivArray;

  /** @implements */
  ngOnInit() {
    this._isOpened = false;
  }

  /**
   * 変更イベント得意先コード
   * @param $event 得意先コード
   * @param startOrEnd 範囲の開始(ge: GreaterThanEqual) か 終了(le: LessThanEqual)
   */
  public onChangeCustomerCode($event, startOrEnd: string) {
    if (startOrEnd === 'ge') {
      this.detailVehicleMgtCondition.customerCodeStart = $event;
    } else {
      this.detailVehicleMgtCondition.customerCodeEnd = $event;
    }
    this.emitValue();
  }

  /**
   * 変更イベント管理番号
   * @param $event 管理番号
   */
  public onChangeCustVcleManageGroupCode($event) {
    this.detailVehicleMgtCondition.custVcleManageGroupCode = $event;
    this.emitValue();
  }

  /**
   * 変更イベント型式
   * @param $event 型式
   */
  public onChangeFullModel($event) {
    this.detailVehicleMgtCondition.fullModel = $event;
    this.emitValue();
  }

  /**
   * 変更イベント車両備考
   * @param $event 車両備考
   */
  public onChangeVcleRemarksName($event) {
    this.detailVehicleMgtCondition.vcleRemarksName = $event;
    this.emitValue();
  }

  /**
   * 変更イベントグループコード
   * @param $event グループコード
   * @param startOrEnd 範囲の開始(ge: GreaterThanEqual) か 終了(le: LessThanEqual)
   */
  public onChangeBlCdGroupCode($event, startOrEnd: string) {
    if (startOrEnd === 'ge') {
      this.detailVehicleMgtCondition.blCdGroupCodeStart = $event;
    } else {
      this.detailVehicleMgtCondition.blCdGroupCodeEnd = $event;
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
      this.detailVehicleMgtCondition.blPrtsCdStart = String($event);
    } else {
      this.detailVehicleMgtCondition.blPrtsCdEnd = String($event);
    }
    this.emitValue();
  }

  /**
   * 変更イベント品番
   * @param $event 品番
   */
  public onChangePartsNumber($event) {
    this.detailVehicleMgtCondition.partsNumber = $event;
    this.emitValue();
  }

  /**
   * 変更イベント品名
   * @param $event 品名
   */
  public onChangePartsName($event) {
    this.detailVehicleMgtCondition.partsName = $event;
    this.emitValue();
  }

  /**
   * 変更イベント在庫取寄
   * @param $event 在庫取寄
   */
  public onChangeCustomerDealsDiv($event) {

    if ($event === VehicleStockBackorderDiv.Backorder) {
      this.detailVehicleMgtCondition.whCodeStart = '';
      this.detailVehicleMgtCondition.whCodeEnd = '';
      this.showWhCodeFlg = false;
    } else {
      this.showWhCodeFlg = true;
    }
    this.detailVehicleMgtCondition.vehicleStockBackorderDiv = $event;
    this.changeSalseCodeEvent.emit($event);
  }

  /**
   * 変更イベント倉庫コード
   * @param $event 倉庫コード
   * @param startOrEnd 範囲の開始(ge: GreaterThanEqual) か 終了(le: LessThanEqual)
   */
  public onChangeWhCode($event, startOrEnd: string) {
    if (startOrEnd === 'ge') {
      this.detailVehicleMgtCondition.whCodeStart = $event;
    } else {
      this.detailVehicleMgtCondition.whCodeEnd = $event;
    }
    this.emitValue();
  }

  /** 変更イベント発火 */
  emitValue(): void {
    this.changeEvent.emit(this.detailVehicleMgtCondition);
  }

  /** 条件取消ボタンクリックイベント */
  onClickClearButton(): void {
    this.clearCondition.emit();
  }
}
