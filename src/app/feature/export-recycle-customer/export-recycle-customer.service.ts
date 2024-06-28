import { Injectable } from '@angular/core';
import { ExportConditionInfoResource } from '@blcloud/bl-ng-resource';
import { DateTimeUtils } from '@blcloud/bl-common';
import { BlApiQueryParams, NotificationPushService } from '@blcloud/bl-ng-common';
import { CustomerExportContent } from '@blcloud/bl-datamodel/enum/customer/customer-export-content';
import { CompanyConst } from '@blcloud/bl-datamodel/const/company';
import { IExportRecycleCustomerConditionInput } from './export-recycle-customer.define';
import { ExportRecycleCustomerConditionManager } from './export-recycle-customer.condition';

/**
 * リサイクル取引先出力サービス
 */
@Injectable()
export class ExportRecycleCustomerService {

  constructor(
    private exportCustomerSlipConditionManager: ExportRecycleCustomerConditionManager,
    private exportConditionInfoResource: ExportConditionInfoResource,
  ) { }

  /**
   * 表示用抽出条件を初期化
   */
  initCondition(): IExportRecycleCustomerConditionInput {
    // システム日付を取得
    const today = DateTimeUtils.today();
    // 当日の前月年月日
    const startDate = DateTimeUtils.formatIso(DateTimeUtils.addMonths(today, - 1));
    // 当年月日
    const endDate = DateTimeUtils.formatIso(today);

    return {
      outputInfo: CustomerExportContent.Customer,
      startDate: startDate,
      endDate: endDate,
      organizationCode: CompanyConst.ORGANIZATION_CODE_ALL_COMPANY,
      customerCodeStart: '',
      customerCodeEnd: '',
    };
  }

  /**
   * テキスト出力情報の一覧を設定
   * @param a Array
   */
  public setExportPatternCode(v: string[]): void {
    this.exportCustomerSlipConditionManager.setExportPatternCode(v);
  }

  /**
　 * 出力内容を設定
   * @param outputInfo 出力内容
   */
  public setCustomerExportContent(outputInfo: string): void {
    this.exportCustomerSlipConditionManager.setCustomerExportContent(outputInfo);
  }

  /**
   * 管理組織コードを設定
   * @param organizationCode
   */
  public setOrganizationCode(organizationCode: string): void {
    this.exportCustomerSlipConditionManager.setOrganizationCode(organizationCode);
  }

  /**
   * 得意先コードを設定
   * @param customerCodeStart 得意先コード開始
   * @param customerCodeEnd 得意先コード終了
   */
  public setCustomerCode(customerCodeStart: string, customerCodeEnd: string): void {
    this.exportCustomerSlipConditionManager.setCustomerCode(customerCodeStart, customerCodeEnd);
  }

  /**
   * 日付の設定
   * @param startDate 開始日
   * @param endDate 終了日
   */
  public setUpdateDateTime(startDate: string, endDate: string): void {
    this.exportCustomerSlipConditionManager.setUpdateDateTime(startDate, endDate);
  }

  /**
   * ダウンロードのファイルを取得
   * [GET] /exportpatterninfo/all/csv
   * @return ダウンロードファイルの一覧
   */
  public export() {
    const params: BlApiQueryParams = this.exportCustomerSlipConditionManager.makeQueryParameter();
    return this.exportConditionInfoResource.get<{ notificationPushService: NotificationPushService }>(
      { params: params, entityOptions: { exPath: 'csv' } }
    );
  }

  /**
   * プロダクトコード配列を設定する
   * @param productCodes プロダクトコード配列
   */
  public setProductCodes(productCodes: string[]): void {
    this.exportCustomerSlipConditionManager.setProductCodes(productCodes);
  }

  /**
   * ユニークIdを設定
   * @param a
   */
  public setClientSessionId(a: string): void {
    this.exportCustomerSlipConditionManager.setClientSessionId(a);
  }
}

