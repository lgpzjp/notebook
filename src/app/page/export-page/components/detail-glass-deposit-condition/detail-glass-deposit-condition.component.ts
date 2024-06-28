import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  Input,
  OnChanges
} from '@angular/core';
import { AbstractConditionsComponent } from '../abstract-conditions.component';
import { ExportGlassDepositService } from '../../../../feature/export-glass-deposit/export-glass-deposit.service';
import { OutputDivArray } from '@blcloud/bl-datamodel/enum/common/output-div';
import { IExportGlassDepositConditionInput, ExportOrderDivArray } from './detail-glass-deposit-condition.define';


/**
 * 硝子入金情報詳細条件
 */
@Component({
  selector: 'app-detail-glass-deposit-condition',
  templateUrl: './detail-glass-deposit-condition.component.html',
  styleUrls: ['./detail-glass-deposit-condition.component.scss'],
  providers: [ExportGlassDepositService],
})
export class DetailGlassDepositConditionComponent extends AbstractConditionsComponent implements OnInit, OnChanges {
  /** 売上伝票出力条件 */
  @Input() detailDepositCondition: IExportGlassDepositConditionInput;
  /** 変更イベント */
  @Output() changeEvent: EventEmitter<IExportGlassDepositConditionInput> = new EventEmitter();
  /** 顧客変更イベント */
  @Output() changeCustomerSelectEvent: EventEmitter<string> = new EventEmitter();
  /** 条件クリアイベント */
  @Output() clearCondition: EventEmitter<void> = new EventEmitter();

  /** 『出力区分』配列 */
  public OutputDivArray = OutputDivArray;
  /** 『順序区分』の配列 */
  public readonly ExportOrderDivArray = ExportOrderDivArray;

  constructor(
    protected exportGlassDepositService: ExportGlassDepositService
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
   * 変更イベントヘッダ行選択
   * @param $event
   */
  onChangeOutPutHeaderDiv($event: string): void {
    this.detailDepositCondition.outPutHeaderDiv = $event;
  }

  /**
   * 順序区分変更イベントヘッダ行選択
   * @param $event
   */
  onChangeOutPutOrderDiv($event: string): void {
    this.detailDepositCondition.outPutOrderDiv = $event;
  }

  /** 変更イベント発火 */
  emitValue(): void {
    this.changeEvent.emit(this.detailDepositCondition);
  }

  /** 条件取消ボタンクリックイベント */
  onClickClearButton(): void {
    this.clearCondition.emit();
  }

}
