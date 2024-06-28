import { Injectable } from '@angular/core';
import { ExportCreditConditionSearch } from './export-credit.define';
import {
  BlApiQueryParams,
} from '@blcloud/bl-ng-common';
import { ExportCreditConditionManager } from './export-credit.condition';
import { ExportConditionInfoResource } from '@blcloud/bl-ng-resource';
import {
  NotificationPushService
} from '@blcloud/bl-ng-common';
import { DateTimeOutput, DateTimeUtils } from '@blcloud/bl-common';
import { CreditExportContent } from '@blcloud/bl-datamodel/enum/credit/credit-export-content';

/**
 * 入金請求出力サービス
 */
@Injectable()
export class ExportCreditService {
  constructor(
    public exportCreditConditionManager: ExportCreditConditionManager,
    private exportConditionInfoResource: ExportConditionInfoResource,
  ) {
  }

  /**
   * 表示用抽出条件を初期化
   */
  initExportCreditConditionSearch(): ExportCreditConditionSearch {
    // システム日付を取得
    const today = DateTimeUtils.today();
    // 当日の前月年月日
    const startDate = DateTimeUtils.format(DateTimeUtils.addMonths(today, - 1), DateTimeOutput.YM);
    // 当年月
    const endDate = DateTimeUtils.format(today, DateTimeOutput.YM);

    return {
      startDate: startDate,
      endDate: endDate,
      outputInfo: CreditExportContent.BillingHistory,
      productCode: '',
      cutoffDay: 31,
    };
  }

  /**
   * get file export to download
   * [GET] /exportpatterninfo/all/csv
   * @return list file to download
   */
  public export() {
    const param: BlApiQueryParams = this.exportCreditConditionManager.makeQueryParameter();
    return this.exportConditionInfoResource.get<{ notificationPushService: NotificationPushService }>(
      { params: param, entityOptions: { exPath: 'csv' }}
    );
  }

  /**
   * プロダクトコード配列を設定する
   * @param productCodes プロダクトコード配列
   */
  public setProductCodes(productCodes: string[]): void {
    this.exportCreditConditionManager.setProductCodes(productCodes);
  }

  /**
   * set list テキスト出力情報
   * @param exportPatternCodeList テキスト出力情報配列
   */
  public setExportPatternCodeList(exportPatternCodeList: string[]): void {
    this.exportCreditConditionManager.setExportPatternCodeList(exportPatternCodeList);
  }

  /**
   * 債権情報出力内容配列
   * @param creditExportContent 債権情報出力内容
   */
  public setCreditExportContent(creditExportContent: string[]): void {
    this.exportCreditConditionManager.setCreditExportContent(creditExportContent);
  }

  /**
   * 請求年月の設定
   * @param billingYearMonthStart 請求年月開始
   * @param billingYearMonthEnd 請求年月終了
   */
  public setBillingYearMonth(billingYearMonthStart: string, billingYearMonthEnd: string): void {
    this.exportCreditConditionManager.setBillingYearMonth(billingYearMonthStart, billingYearMonthEnd);
  }

  /**
   * 計上年月の設定
   * @param recordingYearMonthStart 計上年月開始
   * @param recordingYearMonthEnd 計上年月終了
   */
  public setRecordingYearMonth(recordingYearMonthStart: string, recordingYearMonthEnd: string): void {
    this.exportCreditConditionManager.setRecordingYearMonth(recordingYearMonthStart, recordingYearMonthEnd);
  }

  /**
   * 組織
   * @param organizationCode 組織
   */
  public setOrganizationCode(organizationCode: string): void {
    this.exportCreditConditionManager.setOrganizationCode(organizationCode);
  }

  /**
   * 請求先コード
   * @param billingCodeStart 請求先コード開始
   * @param billingCodeEnd 請求先コード終了
   */
  public setBillingCode(billingCodeStart: string, billingCodeEnd: string): void {
    this.exportCreditConditionManager.setBillingCode(billingCodeStart, billingCodeEnd);
  }

  /**
   * 請求先カナ
   * @param billingNameKanaStart 請求先カナ開始
   * @param billingNameKanaEnd 請求先カナ終了
   */
  public setBillingNameKana(billingNameKanaStart: string, billingNameKanaEnd: string): void {
    this.exportCreditConditionManager.setBillingNameKana(billingNameKanaStart, billingNameKanaEnd);
  }

  /**
   * 締日
   * @param cutoffDay 締日
   */
  public setCutoffDay(cutoffDay: number): void {
    this.exportCreditConditionManager.setCutoffDay(cutoffDay);
  }

  /**
   * 債権情報出力内容
   * @param billingHistoryMode 債権情報出力内容
   */
  public setBillingHistoryMode(billingHistoryMode: boolean): void {
    this.exportCreditConditionManager.setBillingHistoryMode(billingHistoryMode);
  }

  /**
   * ユニークIdを設定
   * @param clientSessionId ユニークId
   */
  public setClientSessionId(clientSessionId: string): void {
    this.exportCreditConditionManager.setClientSessionId(clientSessionId);
  }

  /**
   * clear condition search
   */
  public clear() {
    this.exportCreditConditionManager.clear();
  }

}
