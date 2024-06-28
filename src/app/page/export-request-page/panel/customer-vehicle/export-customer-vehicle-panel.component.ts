import { Component, Injector } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of as RxOf } from 'rxjs/observable/of';
import { cloneDeep as _cloneDeep } from 'lodash';

import { DateTimeUtils } from '@blcloud/bl-common';
import { IGenericExportInstruction } from '@blcloud/bl-datamodel/entity/output/generic-export-instruction';
import { ExportInfoDiv, ExportInfoDivArray, ExportInfoDivMap } from '@blcloud/bl-datamodel/enum/output/export-info-div';
import { ExportInfoTabDiv } from '@blcloud/bl-datamodel/enum/output/export-info-tab-div';
import { WithAllCompanyDiv } from '@blcloud/bl-ng-share-module';

import { AbstractExportPanel } from '../abstract-export-panel.component';

/**
 * 出力パネル共通コンテナコンポーネント
 */
@Component({
  selector: 'app-export-customer-vehicle-panel',
  templateUrl: 'export-customer-vehicle-panel.component.html',
  styleUrls: ['export-customer-vehicle-panel.component.scss']
})
export class ExportCustomerVehiclePanelComponent extends AbstractExportPanel {
  /** 出力情報タブ区分 */
  exportInfoTabDiv = ExportInfoTabDiv.CustomerVehicle;

  /** 出力情報区分 */
  exportInfoDiv = ExportInfoDiv.Customer;

  /** 出力情報名称 */
  exportInfoName = ExportInfoDivMap[ExportInfoDiv.Customer];

  /** 組織選択表示モード */
  organizationSelectMode = WithAllCompanyDiv.AllCompany;

  /** 出力情報項目リスト */
  _exportInfoItems = ExportInfoDivArray.filter(info => info.value === ExportInfoDiv.Customer || info.value === ExportInfoDiv.Vehicle);

  /** 更新日開始 */
  _updateDateStart = null;

  /** 更新日終了 */
  _updateDateEnd = null;

  /** 顧客コード開始 */
  _customerCodeStart = '';

  /** 顧客コード終了 */
  _customerCodeEnd = '';

  /** 顧客フリガナ */
  _customerKana = '';

  /** 出力情報区分定義 */
  readonly ExportInfoDiv = ExportInfoDiv;

  constructor(injector: Injector) {
    super(injector);
  }

  /**
   * 条件を初期化します。
   */
  protected initCondition(): void {
    // 出力内容
    this.exportInfoDiv = ExportInfoDiv.Customer;
    this.exportInfoName = ExportInfoDivMap[ExportInfoDiv.Customer];

    // 更新期間
    this._updateDateStart = DateTimeUtils.initial.iso8601.date;
    this._updateDateEnd = DateTimeUtils.initial.iso8601.date;

    if (this.exportInfoDiv === ExportInfoDiv.Customer) {
      // 顧客コード
      this._customerCodeStart = '';
      this._customerCodeEnd = '';
      // 顧客フリガナ
      this._customerKana = '';
    }
  }

  /**
   * 出力内容を検証します。
   * 検証OKの場合はnullを返却します。
   * @returns 検証結果メッセージ
   */
  protected validate(): Observable<any> {
    let observer = { message: '', childElement: null };
    if (this._updateDateStart === DateTimeUtils.initial.iso8601.date || this._updateDateEnd === DateTimeUtils.initial.iso8601.date) {
      observer = { message: '更新期間を入力してください。', childElement: null };
    }

    if (this._updateDateStart > this._updateDateEnd) {
      observer = { message: '更新期間の範囲指定に誤りがあります。', childElement: null };
    }
    return RxOf(observer);
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

  /**
   * 出力情報変更イベントハンドラ
   * @param exportInfoDiv 出力情報区分
   */
  onChangeExportInfo(exportInfoDiv: string) {
    this.exportInfoDiv = exportInfoDiv;
    this.exportInfoName = ExportInfoDivMap[exportInfoDiv];
  }

}
