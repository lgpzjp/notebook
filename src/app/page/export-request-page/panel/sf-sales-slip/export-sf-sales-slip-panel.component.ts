import { Component, Injector } from '@angular/core';
import { IGenericExportInstruction } from '@blcloud/bl-datamodel/entity/output/generic-export-instruction';
import { ExportInfoDiv, ExportInfoDivMap } from '@blcloud/bl-datamodel/enum/output/export-info-div';
import { ExportInfoTabDiv } from '@blcloud/bl-datamodel/enum/output/export-info-tab-div';
import { cloneDeep as _cloneDeep } from 'lodash';
import { AbstractExportPanel } from '../abstract-export-panel.component';

/**
 * 出力パネル共通コンテナコンポーネント
 */
@Component({
  selector: 'app-export-sf-sales-slip-panel',
  templateUrl: 'export-sf-sales-slip-panel.component.html',
  styleUrls: ['export-sf-sales-slip-panel.component.scss']
})
export class ExportSfSalesSlipPanelComponent extends AbstractExportPanel {

  /** 出力情報タブ区分 */
  exportInfoTabDiv = ExportInfoTabDiv.Slip;

  /** 出力情報区分 */
  exportInfoDiv = ExportInfoDiv.Slip;

  /** 出力情報名称 */
  exportInfoName = ExportInfoDivMap[ExportInfoDiv.Slip];

  constructor(injector: Injector) {
    super(injector);
  }

  /**
   * 条件を初期化します。
   */
  protected initCondition(): void {
  }

  /**
   * クエリパラメータを生成します。
   */
  protected makeGenericExportInstruction(): IGenericExportInstruction {
    return _cloneDeep({
      exportInfoTabDiv: this.exportInfoTabDiv,
      exportInfoDiv: this.exportInfoDiv,
      extractConditionString: '',
      exportPatternCode: this.exportPatternCode
    });
  }

}
