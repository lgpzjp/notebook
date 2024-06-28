import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  Input,
  OnChanges
} from '@angular/core';
import { AbstractConditionsComponent } from '../abstract-conditions.component';
import { ExportGlassCustomerService } from '../../../../feature/export-glass-customer/export-glass-customer.service';
import { OutputDivArray } from '@blcloud/bl-datamodel/enum/common/output-div';
import { IExportGlassCustomerConditionInput } from './detail-glass-customer-condition.define';


/**
 * 硝子取引先情報詳細条件
 */
@Component({
  selector: 'app-detail-glass-customer-condition',
  templateUrl: './detail-glass-customer-condition.component.html',
  styleUrls: ['./detail-glass-customer-condition.component.scss'],
  providers: [ExportGlassCustomerService],
})
export class DetailGlassCustomerConditionComponent extends AbstractConditionsComponent implements OnInit, OnChanges {
  /** 売上伝票出力条件 */
  @Input() detailCustomerCondition: IExportGlassCustomerConditionInput;
  /** 出力情報タイプ */
  @Input() exportInfoType: string;
  /** 変更イベント */
  @Output() changeEvent: EventEmitter<IExportGlassCustomerConditionInput> = new EventEmitter();
  /** 顧客変更イベント */
  @Output() changeCustomerSelectEvent: EventEmitter<string> = new EventEmitter();
  /** 条件クリアイベント */
  @Output() clearCondition: EventEmitter<void> = new EventEmitter();
  /** 『出力区分』配列 */
  public OutputDivArray = OutputDivArray;

  constructor(
    protected exportGlassCustomerService: ExportGlassCustomerService
  ) {
    super();
  }

  /** @implements */
  ngOnInit() {
    this._isOpened = false;
  }

  /** @implements */
  ngOnChanges() {
    this.emitValue();
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
   * 変更イベントヘッダ行選択
   * @param $event
   */
  onChangeOutPutHeaderDiv($event: string): void {
    this.detailCustomerCondition.outPutHeaderDiv = $event;
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
