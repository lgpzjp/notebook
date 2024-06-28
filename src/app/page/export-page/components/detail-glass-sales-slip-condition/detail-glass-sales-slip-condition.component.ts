import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  Input,
  OnChanges
} from '@angular/core';
import { AbstractConditionsComponent } from '../abstract-conditions.component';
import { ExportSlipTypeDiv } from '@blcloud/bl-datamodel/enum/output/export-slip-type-div';
import { ExportGlassSalesSlipService } from '../../../../feature/export-glass-sales-slip/export-glass-sales-slip.service';
import { OutputDivArray } from '@blcloud/bl-datamodel/enum/common/output-div';
import { SalesSlipTargetPeriodDivArray } from '@blcloud/bl-datamodel/enum/sales/sales-slip-target-period-div';
import { IExportGlassSalesSlipConditionInput, ExportPartsWorkDivArray, ExportOrderDivArray } from './detail-glass-sales-slip-condition.define';


/**
 * 硝子売上伝票詳細条件
 */
@Component({
  selector: 'app-detail-glass-sales-slip-condition',
  templateUrl: './detail-glass-sales-slip-condition.component.html',
  styleUrls: ['./detail-glass-sales-slip-condition.component.scss'],
  providers: [ExportGlassSalesSlipService],
})
export class DetailGlassSalesSlipConditionComponent extends AbstractConditionsComponent implements OnInit, OnChanges {
  /** 売上伝票出力条件 */
  @Input() detailSalesSlipCondition: IExportGlassSalesSlipConditionInput;

  /** 出力情報タイプ */
  @Input() exportInfoType: string;
  /** 変更イベント */
  @Output() changeEvent: EventEmitter<IExportGlassSalesSlipConditionInput> = new EventEmitter();
  /** 顧客変更イベント */
  @Output() changeCustomerSelectEvent: EventEmitter<string> = new EventEmitter();
  /** 条件クリアイベント */
  @Output() clearCondition: EventEmitter<void> = new EventEmitter();

  /** 『出力区分』配列 */
  public readonly OutputDivArray = OutputDivArray;
  /** 『出力伝票タイプ区分』配列 */
  public readonly ExportSlipTypeDiv = ExportSlipTypeDiv;
  /** 『売上伝票情報得意先選択』配列 */
  public readonly SalesSlipTargetPeriodDivArray = SalesSlipTargetPeriodDivArray;
  /** 『部品作業区分』配列 */
  public readonly ExportPartsWorkDivArray = ExportPartsWorkDivArray;
  /** 『順序区分』の配列 */
  public readonly ExportOrderDivArray = ExportOrderDivArray;

  constructor(
    protected exportGlassSalesSlipService: ExportGlassSalesSlipService
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
    this.detailSalesSlipCondition.outPutHeaderDiv = $event;
  }

  /**
   * 部品作業区分変更イベントヘッダ行選択
   * @param $event
   */
  onChangeGlassClassDiv($event: string): void {
    this.detailSalesSlipCondition.glassClassDiv = $event;
  }

  /**
   * 順序区分変更イベントヘッダ行選択
   * @param $event
   */
  onChangeOutPutOrderDiv($event: string): void {
    this.detailSalesSlipCondition.outPutOrderDiv = $event;
  }

  /**
   * 変更イベント得意先コード
   * @param $event 得意先コード
   * @param startOrEnd 範囲の開始(ge: GreaterThanEqual) か 終了(le: LessThanEqual)
   */
  public onChangeCustomerCode($event, startOrEnd: string) {
    if (startOrEnd === 'ge') {
      this.detailSalesSlipCondition.customerCodeS = $event;
    } else {
      this.detailSalesSlipCondition.customerCodeE = $event;
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
      this.detailSalesSlipCondition.picEmployeeCodeS = $event;
    } else {
      this.detailSalesSlipCondition.picEmployeeCodeE = $event;
    }
    this.emitValue();
  }

  /**
   * 変更イベント地区コード
   * @param $event 地区コード
   * @param startOrEnd 範囲の開始(ge: GreaterThanEqual) か 終了(le: LessThanEqual)
   */
  public onChangeAreaCode($event, startOrEnd: string) {
    if (startOrEnd === 'ge') {
      this.detailSalesSlipCondition.areaCdS = $event;
    } else {
      this.detailSalesSlipCondition.areaCdE = $event;
    }
    this.emitValue();
  }

  /**
   * 変更イベント業種コード
   * @param $event 業種コード
   * @param startOrEnd 範囲の開始(ge: GreaterThanEqual) か 終了(le: LessThanEqual)
   */
  public onChangeDispBusinessCode($event, startOrEnd: string) {
    if (startOrEnd === 'ge') {
      this.detailSalesSlipCondition.dispBusinessCodeS = $event;
    } else {
      this.detailSalesSlipCondition.dispBusinessCodeE = $event;
    }
    this.emitValue();
  }

  /** 変更イベント発火 */
  emitValue(): void {
    this.changeEvent.emit(this.detailSalesSlipCondition);
  }

  /** 条件取消ボタンクリックイベント */
  onClickClearButton(): void {
    this.clearCondition.emit();
  }

}
