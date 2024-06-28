import { Injectable } from '@angular/core';
import { IExportCustomerSlipConditionInput } from './export-customer-slip.define';
import { ExportCustomerSlipConditionManager } from './export-customer-slip.condition';
import { ExportConditionInfoResource } from '@blcloud/bl-ng-resource';
import { DateTimeUtils } from '@blcloud/bl-common';
import { BlApiQueryParams, NotificationPushService } from '@blcloud/bl-ng-common';
import { CustomerExportContent } from '@blcloud/bl-datamodel/enum/customer/customer-export-content';
import { CompanyConst } from '@blcloud/bl-datamodel/const/company';
import { CustomerDealsDiv } from '@blcloud/bl-datamodel/enum/credit/customer-deals-div';
import { SupplierDealsDiv } from '@blcloud/bl-datamodel/enum/debt/supplier-deals-div';

/**
 * 得意先伝票出力サービス
 */
@Injectable()
export class ExportCustomerSlipService {

  constructor(
    private exportCustomerSlipConditionManager: ExportCustomerSlipConditionManager,
    private exportConditionInfoResource: ExportConditionInfoResource,
  ) { }

  /**
   * 表示用抽出条件を初期化
   */
  initCondition(): IExportCustomerSlipConditionInput {
    // システム日付を取得
    const today = DateTimeUtils.today();
    // 当日の前月年月日
    const startDate = DateTimeUtils.formatIso(DateTimeUtils.addMonths(today, - 1));
    // 当年月日
    const endDate = DateTimeUtils.formatIso(today);

    return {
      outputInfo: CustomerExportContent.Customer,
      targetPeriod: undefined,
      startDate: startDate,
      endDate: endDate,
      organizationCode: CompanyConst.ORGANIZATION_CODE_ALL_COMPANY,
      billingCodeStart: '',
      billingCodeEnd: '',
      supplierCdStart: '',
      supplierCdEnd: '',
      cutoffDay: '',
      customerDealsDiv: CustomerDealsDiv.All,
      supplierDealsDiv: SupplierDealsDiv.All,
      startDateDetail: startDate,
      endDateDetail: endDate

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
   * @param billingCodeStart 得意先コード開始
   * @param billingCodeEnd 得意先コード終了
   */
  public setCustomerCode(billingCodeStart: string, billingCodeEnd: string): void {
    this.exportCustomerSlipConditionManager.setCustomerCode(billingCodeStart, billingCodeEnd);
  }

  /**
   * 仕入先コードを設定
   * @param supplierCdStart 仕入先コード開始
   * @param supplierCdEnd 仕入先コード終了
   */
  public setSupplierCd(supplierCdStart: string, supplierCdEnd: string): void {
    this.exportCustomerSlipConditionManager.setSupplierCd(supplierCdStart, supplierCdEnd);
  }

  /**
   * 締日を設定
   * @param cutoffDay
   */
  public setCutoffDay(cutoffDay: string): void {
    this.exportCustomerSlipConditionManager.setCutoffDay(cutoffDay);
  }

  /**
   * 取引有無(得意先)を設定
   * @param customerDealsDiv
   */
  public setCustomerDealsDiv(customerDealsDiv: string): void {
    this.exportCustomerSlipConditionManager.setCustomerDealsDiv(customerDealsDiv);
  }

  /**
   * 取引有無(仕入先)を設定
   * @param supplierDealsDiv
   */
  public setSupplierDealsDiv(supplierDealsDiv: string): void {
    this.exportCustomerSlipConditionManager.setSupplierDealsDiv(supplierDealsDiv);
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
   * 日付の設定(詳細画面)
   * @param startDateDetail 開始日
   * @param endDateDetail 終了日
   * @param targetPeriod 対象期間
   * @param outputInfo 出力内容
   */
  public setDate(startDateDetail: string, endDateDetail: string, targetPeriod: string, outputInfo: string): void {
    this.exportCustomerSlipConditionManager.setDate(startDateDetail, endDateDetail, targetPeriod, outputInfo);
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

