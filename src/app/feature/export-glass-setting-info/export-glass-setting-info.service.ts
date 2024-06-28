import { Injectable } from '@angular/core';
import { BlApiQueryParams, NotificationPushService } from '@blcloud/bl-ng-common';
import { ExportConditionInfoResource } from '@blcloud/bl-ng-resource';
import { ProductCode } from '@blcloud/bl-datamodel/enum/common/product-code';
import { OutputDiv } from '@blcloud/bl-datamodel/enum/common/output-div';
import { ExportGlassSettingInfoConditionManager } from './export-glass-setting-info.condition';
import { IExportGlassSettingInfoConditionInput } from './export-glass-setting-info.define';
import { MaxCSVCountSize } from '../../page/export-page/export-page.define';

/**
 * 硝子取引先情報サービス
 */
@Injectable()
export class ExportGlassSettingInfoService {

  constructor(
    private exportGlassSettingInfoConditionManager: ExportGlassSettingInfoConditionManager,
    private exportConditionInfoResource: ExportConditionInfoResource,
  ) {
  }

  /**
   * 表示用抽出条件を初期化
   */
  initCondition(): IExportGlassSettingInfoConditionInput {
    return {
      exportPatternCode: '93',
      productCode: ProductCode.Glass,
      outPutHeaderDiv: OutputDiv.Output,
    };
  }

  /**
   * テキスト出力情報の一覧を設定
   * @param exportPatternCodeList テキスト出力パターンコード配列
   */
  public setExportPatternCodeList(exportPatternCodeList: string[]): void {
    this.exportGlassSettingInfoConditionManager.setExportPatternCodeList(exportPatternCodeList);
  }

  /**
   * ヘッダ行
   * @param headerSelect ヘッダ行
   */
  public setOutPutHeaderDiv(headerSelect: string): void {
    this.exportGlassSettingInfoConditionManager.setOutPutHeaderDiv(headerSelect);
  }

  /**
   * プロダクトコード配列を設定する
   * @param productCodes プロダクトコード配列
   */
  public setProductCodes(productCodes: string): void {
    this.exportGlassSettingInfoConditionManager.setProductCodes(productCodes);
  }

  /**
   * ユニークIdを設定
   * @param clientSessionId ユニークId
   */
  public setClientSessionId(clientSessionId: string): void {
    this.exportGlassSettingInfoConditionManager.setClientSessionId(clientSessionId);
  }

  /**
   * clear search condition
   */
  public clear() {
    this.exportGlassSettingInfoConditionManager.clear();
  }

  /**
   * ダウンロードのファイルを取得
   * [GET] /exportpatterninfo/all/csv
   * @param isSplit 分割フラグ
   * @return ダウンロードファイルの一覧
   */
  public export(isSplit: boolean) {
    const params: BlApiQueryParams = this.exportGlassSettingInfoConditionManager.makeQueryParameter();
    // 分割フラグが有効の場合はサイズを指定
    if (isSplit) {
      params.setSize(MaxCSVCountSize);
    }
    return this.exportConditionInfoResource.get<{ notificationPushService: NotificationPushService }>(
      { params: params, entityOptions: { exPath: 'csv' } }
    );
  }
}
