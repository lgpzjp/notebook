import { AfterViewInit, Component, Injector } from '@angular/core';
import { of as RxOf } from 'rxjs/observable/of';
import { catchError } from 'rxjs/operators';

import { IGenericExportInstruction } from '@blcloud/bl-datamodel/entity/output/generic-export-instruction';
import { ProductCode } from '@blcloud/bl-datamodel/enum/common/product-code';
import { ExportInfoDiv, ExportInfoDivArray, ExportInfoDivMap } from '@blcloud/bl-datamodel/enum/output/export-info-div';
import { ExportInfoTabDiv } from '@blcloud/bl-datamodel/enum/output/export-info-tab-div';
import { LogicalDeleteDiv } from '@blcloud/bl-datamodel/enum/common/logical-delete-div';
import { FunctionCategoryDiv } from '@blcloud/bl-datamodel/enum/bizcmn/function-category-div';
import { OpeDiv } from '@blcloud/bl-datamodel/enum/bizcmn/ope-div';
import { IOpeHistory } from '@blcloud/bl-datamodel';
import { OpeHistoryResource } from '@blcloud/bl-ng-resource';
import { cloneDeep as _cloneDeep } from 'lodash';

import { AbstractExportPanel } from '../abstract-export-panel.component';
import { Observable } from 'rxjs/Observable';
import { ExportSettingInfoPanelDivArray, IExportGlassSettingInfoPanelConditionInput } from './export-glass-setting-info.define';
import { OutputDiv } from '@blcloud/bl-datamodel/enum/common/output-div';
import { IExportGlassExportSearchInfo } from '../../export-request-page.define';

/**
 * 売上データ出力コンテナコンポーネント
 */
@Component({
  selector: 'app-export-glass-setting-info-panel',
  templateUrl: 'export-glass-setting-info-panel.component.html',
  styleUrls: ['export-glass-setting-info-panel.component.scss']
})
export class ExportGlassSettingInfoPanelComponent extends AbstractExportPanel implements AfterViewInit {

  /** 出力情報タブ区分 */
  exportInfoTabDiv = ExportInfoTabDiv.GlassSettingInfo;

  /** 出力情報区分 */
  exportInfoDiv = ExportInfoDiv.CnctSetting;

  /** 出力情報名称 */
  exportInfoName = ExportInfoDivMap[ExportInfoDiv.CnctSetting];

  /** 出力タイプ */
  ExportSettingInfoDivArray = ExportSettingInfoPanelDivArray;

  _SearchInfo: IExportGlassExportSearchInfo = {};

  /** 出力情報項目リスト */
  _exportInfoItems = ExportInfoDivArray.filter(info =>
    info.value === ExportInfoDiv.CnctSetting
    || info.value === ExportInfoDiv.VehicleGlueSetting
    || info.value === ExportInfoDiv.GlassVehicleModelMemoInfo
    || info.value === ExportInfoDiv.GlassMemoInfo
  );

  /** 詳細情報出力条件 */
  public exportCondition: IExportGlassSettingInfoPanelConditionInput = {
    exportPatternCode: ExportSettingInfoPanelDivArray[0].value,
    productCode: ProductCode.Glass,
    outPutHeaderDiv: OutputDiv.Output,
  };

  ngAfterViewInit(): void {
    super.ngAfterViewInit();
    const element = <HTMLElement>document.getElementById('exportPatternInfo');
    if (element) {
      element.style.display = 'none';
    }
  }

  constructor(
    injector: Injector,
    private opeHistoryResource: OpeHistoryResource
  ) {
    super(injector);
  }

  /**
   * 条件を初期化します。
   */
  protected initCondition(): void {
    // 出力内容
    this.exportInfoDiv = ExportInfoDiv.CnctSetting;
    this.exportInfoName = ExportInfoDivMap[ExportInfoDiv.CnctSetting];
    this.exportCondition.exportPatternCode = ExportSettingInfoPanelDivArray[0].value;
  }

  /**
   * クエリパラメータを生成します。
   */
  protected makeGenericExportInstruction(): IGenericExportInstruction {

    // CSVヘッダー出力区分
    this._SearchInfo.outPutHeaderDiv = OutputDiv.Output;
    return _cloneDeep({
      exportInfoTabDiv: this.exportInfoTabDiv,
      exportInfoDiv: this.exportInfoDiv,
      extractConditionString: JSON.stringify(this._SearchInfo),
      exportPatternCode: Number(this.exportCondition.exportPatternCode)
    });
  }

  /**
   * 操作履歴ログを登録します。
   */
  protected postOperationHistoryLog() {
    const entity: IOpeHistory = {
      productCode: ProductCode.Glass,
      logicalDeleteDiv: LogicalDeleteDiv.Valid,
      functionCategoryDiv: FunctionCategoryDiv.Entry,
      blTenantId: this.loginUser.blTenantId,
      organizationCode: this.loginUser.organizationCode,
      organizationName: this.loginUser.organizationName,
      createEmployeeCode: this.loginUser.employeeCode,
      createEmployeeName: this.loginUser.employeeName,
      opeHistoryFunctionName: 'データ出力',
      opeDiv: OpeDiv.NotPrint,
      opeHistoryDtlValueList: [`出力データ：${this.exportInfoName}`],
    };

    this.opeHistoryResource.post<IOpeHistory>(entity).pipe(
      catchError(() => {
        return RxOf(null);
      })
    ).subscribe();
  }

  /**
     * 出力内容を検証します。
     * 検証OKの場合はnullを返却します。
     * @returns 検証結果メッセージ
     */
  protected validate(): Observable<any> {
    return RxOf({ message: '', childElement: null });
  }

  /**
   * 出力情報変更イベントハンドラ
   * @param exportPatternCode 出力区分
   */
  onChangeExportInfo(exportPatternCode: string) {
    switch (exportPatternCode) {
      case ExportSettingInfoPanelDivArray[0].value:
        this.exportInfoDiv = ExportInfoDiv.CnctSetting;
        break;
      case ExportSettingInfoPanelDivArray[1].value:
        this.exportInfoDiv = ExportInfoDiv.VehicleGlueSetting;
        break;
      case ExportSettingInfoPanelDivArray[2].value:
        this.exportInfoDiv = ExportInfoDiv.GlassVehicleModelMemoInfo;
        break;
      case ExportSettingInfoPanelDivArray[3].value:
        this.exportInfoDiv = ExportInfoDiv.GlassMemoInfo;
        break;
    }
    this.exportInfoName = ExportInfoDivMap[this.exportInfoDiv];
  }

}
