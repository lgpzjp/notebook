import { Injectable } from '@angular/core';
import { IExportSalesSlipConditionInput } from './export-sales-slip.define';
import { BlApiQueryParams, NotificationPushService } from '@blcloud/bl-ng-common';
import { ExportSalesSlipConditionManager } from './export-sales-slip.condition';
import { ExportConditionInfoResource } from '@blcloud/bl-ng-resource';
import { ExportSlipTypeDiv } from '@blcloud/bl-datamodel/enum/output/export-slip-type-div';
import {
  SalesSlipSupplierSelect
} from '@blcloud/bl-datamodel/enum/sales/sales-slip-supplier-select';
import {
  SalesSlipOrganizationSelect
} from '@blcloud/bl-datamodel/enum/sales/sales-slip-organization-select';
import {
  SalesSlipTargetPeriodDiv
} from '@blcloud/bl-datamodel/enum/sales/sales-slip-target-period-div';
import { DateTimeUtils } from '@blcloud/bl-common';
import { ProductCode } from '@blcloud/bl-datamodel/enum/common/product-code';
import { CompanyConst } from '@blcloud/bl-datamodel/const/company';

/**
 * 売上伝票出力サービス
 */
@Injectable()
export class ExportSalesSlipService {

  constructor(
    private exportSalesSlipConditionManager: ExportSalesSlipConditionManager,
    private exportConditionInfoResource: ExportConditionInfoResource,
  ) { }

  /**
   * 表示用抽出条件を初期化
   */
  initCondition(): IExportSalesSlipConditionInput {
    // システム日付を取得
    const today = DateTimeUtils.today();
    // 当日の前月年月日
    const startDate = DateTimeUtils.formatIso(DateTimeUtils.addMonths(today, - 1));
    // 当年月日
    const endDate = DateTimeUtils.formatIso(today);

    return {
      sales: true,
      estimate: true,
      order: true,
      loan: true,
      deposit: false,
      targetPeriod: SalesSlipSupplierSelect.SlipDate,
      startDate: startDate,
      endDate: endDate,
      exportInfoType: ExportSlipTypeDiv.Slip,
      organization: CompanyConst.ORGANIZATION_CODE_ALL_COMPANY,
      productCode: ProductCode.Partsman,
      picEmployeeCodeS: undefined,
      picEmployeeCodeE: undefined,
      organizationSelect: SalesSlipOrganizationSelect.SalesOrganization,
      customerSelect: SalesSlipTargetPeriodDiv.Customer,
      billingCodeS: undefined,
      billingCodeE: undefined,
      cutoffDay: undefined,
      whCodeS: '',
      whCodeE: '',
      itemMakerCdS: undefined,
      itemMakerCdE: undefined,
      searchItemPartsNumber: '',
      searchItemPartsName: ''
    };
  }

  /**
   * テキスト出力情報の一覧を設定
   * @param exportPatternCodeList テキスト出力パターンコード配列
   */
  public setExportPatternCodeList(exportPatternCodeList: string[]): void {
    this.exportSalesSlipConditionManager.setExportPatternCodeList(exportPatternCodeList);
  }

  /**
   * 売上伝票情報出力内容を設定
   * @param salesSlipExportContentList 売上伝票情報出力内容配列
   */
  public setSalesSlipExportContentList(salesSlipExportContentList: string[]): void {
    this.exportSalesSlipConditionManager.setSalesSlipExportContentList(salesSlipExportContentList);
  }

  /**
   * 対象期間を設定
   * @param targetPeriod 対象期間
   */
  public setTargetPeriod(targetPeriod: string): void {
    this.exportSalesSlipConditionManager.setTargetPeriod(targetPeriod);
  }

  /**
   * 日付の設定
   * @param dateStart 開始日
   * @param dateEnd 終了日
   * @param targetPeriod 対象期間
   */
  public setDate(dateStart: string, dateEnd?: string, targetPeriod?: string): void {
    this.exportSalesSlipConditionManager.setDate(dateStart, dateEnd, targetPeriod);
  }

  /**
   * 顧客管理組織コードを設定
   * @param customerManageOrganizationCode 顧客管理組織コード
   */
  public setCustomerManageOrganizationCode(customerManageOrganizationCode: string): void {
    this.exportSalesSlipConditionManager.setCustomerManageOrganizationCode(customerManageOrganizationCode);
  }

  /**
   * 請求組織コードを設定
   * @param demandOrganizationCode string
   */
  public setDemandOrganizationCode(demandOrganizationCode: string): void {
    this.exportSalesSlipConditionManager.setDemandOrganizationCode(demandOrganizationCode);
  }

  /**
   * 伝票管理組織コードを設定
   * @param demandOrganizationCode string
   */
  public setSlipOrganizationCode(slipOrganizationCode: string): void {
    this.exportSalesSlipConditionManager.setSlipOrganizationCode(slipOrganizationCode);
  }

  /**
   * 担当者コード
   * @param picEmployeeCodeStart 担当者コード開始
   * @param picEmployeeCodeEnd 担当者コード終了
   */
  public setPicEmployeeCode(picEmployeeCodeStart: string, picEmployeeCodeEnd: string): void {
    this.exportSalesSlipConditionManager.setPicEmployeeCode(picEmployeeCodeStart, picEmployeeCodeEnd);
  }

  /**
   * 得意先コード
   * @param customerCodeStart 得意先コード開始
   * @param customerCodeEnd 得意先コード終了
   */
  public setCustomerCode(customerCodeStart: string, customerCodeEnd: string): void {
    this.exportSalesSlipConditionManager.setCustomerCode(customerCodeStart, customerCodeEnd);
  }

  /**
   * 請求先コード
   * @param billingCodeStart 請求先コード開始
   * @param billingCodeEnd 請求先コード終了
   */
  public setBillingCode(billingCodeStart: string, billingCodeEnd: string): void {
    this.exportSalesSlipConditionManager.setBillingCode(billingCodeStart, billingCodeEnd);
  }

  /**
   * 締日
   * @param cutoffDay 締日
   */
  public setCutoffDay(cutoffDay: string): void {
    this.exportSalesSlipConditionManager.setCutoffDay(cutoffDay);
  }

  /**
   * 倉庫コード
   * @param whCodeStart 倉庫コード開始
   * @param whCodeEnd 倉庫コード終了
   */
  public setWhCode(whCodeStart: string, whCodeEnd: string): void {
    this.exportSalesSlipConditionManager.setWhCode(whCodeStart, whCodeEnd);
  }

  /**
   * 商品メーカーコード
   * @param itemMakerCdStart 商品メーカーコード開始
   * @param itemMakerCdEnd 商品メーカーコード終了
   */
  public setItemMakerCd(itemMakerCdStart: string, itemMakerCdEnd: string): void {
    this.exportSalesSlipConditionManager.setItemMakerCd(itemMakerCdStart, itemMakerCdEnd);
  }

  /**
   * 検索条件商品品番
   * @param itemPartsNumber 検索条件商品品番
   */
  public setSearchItemPartsNumber(itemPartsNumber: string): void {
    this.exportSalesSlipConditionManager.setSearchItemPartsNumber(itemPartsNumber);
  }

  /**
   * 検索条件商品名称
   * @param itemPartsName 検索条件商品名称
   */
  public setSearchItemPartsName(itemPartsName: string): void {
    this.exportSalesSlipConditionManager.setSearchItemPartsName(itemPartsName);
  }

  /**
   * プロダクトコード配列を設定する
   * @param productCodes プロダクトコード配列
   */
  public setProductCodes(productCodes: string[]): void {
    this.exportSalesSlipConditionManager.setProductCodes(productCodes);
  }

  /**
   * ユニークIdを設定
   * @param clientSessionId ユニークId
   */
  public setClientSessionId(clientSessionId: string): void {
    this.exportSalesSlipConditionManager.setClientSessionId(clientSessionId);
  }

  /**
   * clear search condition
   */
  public clear() {
    this.exportSalesSlipConditionManager.clear();
  }

  /**
   * ダウンロードのファイルを取得
   * [GET] /exportpatterninfo/all/csv
   * @return ダウンロードファイルの一覧
   */
  public export() {
    const params: BlApiQueryParams = this.exportSalesSlipConditionManager.makeQueryParameter();
    return this.exportConditionInfoResource.get<{ notificationPushService: NotificationPushService }>(
      { params: params, entityOptions: { exPath: 'csv' } }
    );
  }

}
