import { Injectable } from '@angular/core';
import { ExportDebtConditionSearch } from './export-debt.define';
import {
  BlApiQueryParams,
} from '@blcloud/bl-ng-common';
import { ExportDebtConditionManager } from './export-debt.condition';
import { ExportConditionInfoResource } from '@blcloud/bl-ng-resource';
import {
  NotificationPushService
} from '@blcloud/bl-ng-common';
import { DateTimeOutput, DateTimeUtils } from '@blcloud/bl-common';
import { DebtExportContent } from '@blcloud/bl-datamodel/enum/debt/debt-export-content';

/**
 * 債務出力サービス
 */
@Injectable()
export class ExportDebtService {
  constructor(
    public exportDebtConditionManager: ExportDebtConditionManager,
    private exportConditionInfoResource: ExportConditionInfoResource,
  ) {
  }

  /**
   * 表示用抽出条件を初期化
   */
  initExportDebtConditionSearch(): ExportDebtConditionSearch {
    // システム日付を取得
    const today = DateTimeUtils.today();
    // 当日の前月年月日
    const startDate = DateTimeUtils.format(DateTimeUtils.addMonths(today, - 1), DateTimeOutput.YM);
    // 当年月
    const endDate = DateTimeUtils.format(today, DateTimeOutput.YM);

    return {
      startDate: startDate,
      endDate: endDate,
      outputInfo: DebtExportContent.PayHistory,
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
    const param: BlApiQueryParams = this.exportDebtConditionManager.makeQueryParameter();
    return this.exportConditionInfoResource.get<{ notificationPushService: NotificationPushService }>(
      { params: param, entityOptions: { exPath: 'csv' }}
    );
  }

  /**
   * プロダクトコード配列を設定する
   * @param productCodes プロダクトコード配列
   */
  public setProductCodes(productCodes: string[]): void {
    this.exportDebtConditionManager.setProductCodes(productCodes);
  }

  /**
   * set list テキスト出力情報
   * @param exportPatternCodeList テキスト出力情報配列
   */
  public setExportPatternCodeList(exportPatternCodeList: string[]): void {
    this.exportDebtConditionManager.setExportPatternCodeList(exportPatternCodeList);
  }

  /**
   * 債務情報出力内容配列
   * @param debtExportContentList 債務情報出力内容配列
   */
  public setDebtExportContentList(debtExportContentList: string[]): void {
    this.exportDebtConditionManager.setDebtExportContentList(debtExportContentList);
  }

  /**
   * 支払締年月の設定
   * @param payCutoffYearMonthStart 支払締年月開始
   * @param payCutoffYearMonthEnd 支払締年月終了
   */
  public setPayCutoffYearMonth(payCutoffYearMonthStart: string, payCutoffYearMonthEnd: string): void {
    this.exportDebtConditionManager.setPayCutoffYearMonth(payCutoffYearMonthStart, payCutoffYearMonthEnd);
  }

  /**
   * 計上年月の設定
   * @param recordingYearMonthStart 計上年月開始
   * @param recordingYearMonthEnd 計上年月終了
   */
  public setRecordingYearMonth(recordingYearMonthStart: string, recordingYearMonthEnd: string): void {
    this.exportDebtConditionManager.setRecordingYearMonth(recordingYearMonthStart, recordingYearMonthEnd);
  }

  /**
   * 組織
   * @param payRecordedOrganizationCode 組織
   */
  public setPayRecordedOrganizationCode(payRecordedOrganizationCode: string): void {
    this.exportDebtConditionManager.setPayRecordedOrganizationCode(payRecordedOrganizationCode);
  }

  /**
   * 支払先コード
   * @param payeeCodeStart 支払先コード開始
   * @param payeeCodeEnd 支払先コード終了
   */
  public setPayeeCode(payeeCodeStart: string, payeeCodeEnd: string): void {
    this.exportDebtConditionManager.setPayeeCode(payeeCodeStart, payeeCodeEnd);
  }

  /**
   * 支払先カナ
   * @param payeeNameKanaStart 支払先カナ開始
   * @param payeeNameKanaEnd 支払先カナ終了
   */
  public setPayeeNameKana(payeeNameKanaStart: string, payeeNameKanaEnd: string): void {
    this.exportDebtConditionManager.setPayeeNameKana(payeeNameKanaStart, payeeNameKanaEnd);
  }

  /**
   * 締日
   * @param cutoffDay 締日
   */
  public setCutoffDay(cutoffDay: number): void {
    this.exportDebtConditionManager.setCutoffDay(cutoffDay);
  }

  /**
   * 債務情報出力内容
   * @param payHistoryMode 債務情報出力内容
   */
  public setPayHistoryMode(payHistoryMode: boolean): void {
    this.exportDebtConditionManager.setPayHistoryMode(payHistoryMode);
  }

  /**
   * ユニークIdを設定
   * @param clientSessionId ユニークId
   */
  public setClientSessionId(clientSessionId: string): void {
    this.exportDebtConditionManager.setClientSessionId(clientSessionId);
  }

  /**
   * clear condition search
   */
  public clear() {
    this.exportDebtConditionManager.clear();
  }

}
