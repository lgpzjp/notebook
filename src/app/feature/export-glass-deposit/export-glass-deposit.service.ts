import { Injectable } from '@angular/core';
import { BlApiQueryParams, NotificationPushService } from '@blcloud/bl-ng-common';
import { ExportConditionInfoResource } from '@blcloud/bl-ng-resource';
import { DateTimeUtils } from '@blcloud/bl-common';
import { ProductCode } from '@blcloud/bl-datamodel/enum/common/product-code';
import { OutputDiv } from '@blcloud/bl-datamodel/enum/common/output-div';
import { ExportGlassDepositConditionManager } from './export-glass-deposit.condition';
import { IExportGlassDepositConditionInput, ExportOrderDiv } from './export-glass-deposit.define';
import { SelectTypeEnum } from './../range-organization/range-organization.define';
import {
  forEach as _forEach,
  isNil as _isNil
} from 'lodash';
import { MaxCSVCountSize } from '../../page/export-page/export-page.define';

/**
 * 硝子入金情報サービス
 */
@Injectable()
export class ExportGlassDepositService {

  constructor(
    private exportGlassDepositConditionManager: ExportGlassDepositConditionManager,
    private exportConditionInfoResource: ExportConditionInfoResource,
  ) {
  }

  /** 初期選択組織コード */
  defaultSelectedOrganizationCode: string;

  /**
   * 表示用抽出条件を初期化
   */
  initCondition(): IExportGlassDepositConditionInput {
    // システム日付を取得
    const today = DateTimeUtils.today();
    // 当日の前月年月日
    const startDate = DateTimeUtils.formatIso(DateTimeUtils.addMonths(today, -1));
    // 当年月日
    const endDate = DateTimeUtils.formatIso(today);

    return {
      exportInfoType: '0',
      startDate: startDate,
      endDate: endDate,
      organization: this.defaultSelectedOrganizationCode,
      productCode: ProductCode.Glass,
      cutoffDay: 0,
      outPutHeaderDiv: OutputDiv.Output,
      outPutOrderDiv: ExportOrderDiv.OrderDiv0,
    };
  }

  /**
   * テキスト出力情報の一覧を設定
   * @param exportPatternCodeList テキスト出力パターンコード配列
   */
  public setExportPatternCodeList(exportPatternCodeList: string[]): void {
    this.exportGlassDepositConditionManager.setExportPatternCodeList(exportPatternCodeList);
  }

  /**
   * 日付の設定
   * @param dateStart 開始日
   * @param dateEnd 終了日
   */
  public setDate(dateStart: string, dateEnd?: string): void {
    this.exportGlassDepositConditionManager.setDate(dateStart, dateEnd);
  }

  /**
   * 締日
   * @param cutoffDay 締日
   */
  public setCutoffDay(cutoffDay: number): void {
    this.exportGlassDepositConditionManager.setCutoffDay(cutoffDay);
  }

  /**
   * 組織コードを設定
   * @param event
   */
  public setOrganizationObject(event: any): void {
    if (event.selectType === SelectTypeEnum.RANGE) {
      this.exportGlassDepositConditionManager.setOrganizationRange(event.organizationCodeFrom, event.organizationCodeTo);
    } else if (event.selectType === SelectTypeEnum.INDIVIDUAL) {
      this.exportGlassDepositConditionManager.setOrganizationList(this.cutOrganizationList(event.organizationList));
    } else if (event.selectType === SelectTypeEnum.ALL_ORGANAIZATION) {
      this.exportGlassDepositConditionManager.setOrganizationList(event.allOrganizationCode);
    }
  }

  /**
   * 組織個別指定リスト 空白箇所削除
   * @param organizationList
   */
  cutOrganizationList(organizationList: string[]): string[] {
    const exportOrganizationList = [];
    _forEach(organizationList, organization => {
      if (!_isNil(organization)) {
        exportOrganizationList.push(organization);
      }
    });
    return exportOrganizationList;
  }

  /**
   * ヘッダ行
   * @param headerSelect ヘッダ行
   */
  public setOutPutHeaderDiv(headerSelect: string): void {
    this.exportGlassDepositConditionManager.setOutPutHeaderDiv(headerSelect);
  }

  /**
   * 順序
   * @param outPutOrderDiv 順序
   */
  public setOutPutOrderDiv(outPutOrderDiv: string): void {
    this.exportGlassDepositConditionManager.setOutPutOrderDiv(outPutOrderDiv);
  }

  /**
   * プロダクトコード配列を設定する
   * @param productCodes プロダクトコード配列
   */
  public setProductCodes(productCodes: string): void {
    this.exportGlassDepositConditionManager.setProductCodes(productCodes);
  }

  /**
   * ユニークIdを設定
   * @param clientSessionId ユニークId
   */
  public setClientSessionId(clientSessionId: string): void {
    this.exportGlassDepositConditionManager.setClientSessionId(clientSessionId);
  }

  /**
   * clear search condition
   */
  public clear() {
    this.exportGlassDepositConditionManager.clear();
  }

  /**
   * ダウンロードのファイルを取得
   * [GET] /exportpatterninfo/all/csv
   * @param isSplit 分割フラグ
   * @return ダウンロードファイルの一覧
   */
  public export(isSplit: boolean) {
    const params: BlApiQueryParams = this.exportGlassDepositConditionManager.makeQueryParameter();
    // 分割フラグが有効の場合はサイズを指定
    if (isSplit) {
      params.setSize(MaxCSVCountSize);
    }
    return this.exportConditionInfoResource.get<{ notificationPushService: NotificationPushService }>(
      { params: params, entityOptions: { exPath: 'csv' } }
    );
  }

  /**
   * 出力件数取得処理
   */
  public getCount() {
    const params: BlApiQueryParams = this.exportGlassDepositConditionManager.makeQueryParameter();
    return this.exportConditionInfoResource.get<{ totalCount: number }>(
      { params: params, entityOptions: { exPath: 'count' } }
    );
  }
}
