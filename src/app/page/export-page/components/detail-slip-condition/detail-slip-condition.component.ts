import {
  Component,
  OnInit,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { AbstractConditionsComponent } from '../abstract-conditions.component';

@Component({
  selector: 'app-detail-slip-condition',
  templateUrl: './detail-slip-condition.component.html',
  styleUrls: ['./detail-slip-condition.component.scss'],
  providers: [],
})
export class DetailSlipConditionComponent extends AbstractConditionsComponent implements OnInit {
  @Output() changeExportCustomerVehicleEvent: EventEmitter<Event> = new EventEmitter();
  @Output() clearCondition: EventEmitter<Event> = new EventEmitter();
  @Input() public condition: IExportSlipConditionInput;
  public exportCustomerVehicleOption = {
    value: 1, checked: false
  };

  ngOnInit() {
    this._isOpened = false;
  }

  /**
   * event onchange 顧客・車両情報
   * @param $event
   */
  onChangeCustomerVehicleOption($event: Event): void {
    this.changeExportCustomerVehicleEvent.emit($event);
  }

  onClickClearCondition(): void {
    this.clearCondition.emit();
  }
}

interface IExportSlipConditionInput {
  /**
   * 見積書
   */
  slipKindQuotation: boolean;
  /**
   * 指示書
   */
  slipKindDirections: boolean;
  /**
   * 納品書
   */
  invoice: boolean;
  /**
   * 対象期間
   */
  targetPeriod: string;
  /**
   * 開始日の条件
   */
  startDate: string;
  /**
   * 終了日の条件
   */
  endDate: string;
  /**
   * 作業タイプ
   */
  exportInfoType: string;
  /**
   * 管理組織
   */
  organization: string;
  /**
   * プロダクトコード
   */
  productCode: string;
  /**
   * 拠点選択
   */
  salseRecordedOrganization: string;
  /**
   * 顧客・車両情報
   */
  exportCustomerVehicle: boolean;
}
