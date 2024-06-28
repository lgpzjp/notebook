import { Injectable } from '@angular/core';
import { IExportPurchaseSlipConditionInput } from './export-purchase-slip.define';
import { BlApiQueryParams, NotificationPushService } from '@blcloud/bl-ng-common';
import { ExportPurchaseSlipConditionManager } from './export-purchase-slip.condition';
import { ExportConditionInfoResource } from '@blcloud/bl-ng-resource';
import { DateTimeUtils } from '@blcloud/bl-common';
import { ExportSlipTypeDiv } from '@blcloud/bl-datamodel/enum/output/export-slip-type-div';
import { PurchaseSlipTargetPeriodDiv } from '@blcloud/bl-datamodel/enum/purchase/purchase-slip-target-period-div';

/**
 * 仕入先伝票出力サービス
 */
@Injectable()
export class ExportPurchaseSlipService {

  constructor(
    private exportPurchaseSlipConditionManager: ExportPurchaseSlipConditionManager,
    private exportConditionInfoResource: ExportConditionInfoResource,
  ) { }

  /**
   * 表示用抽出条件を初期化
   */
  initCondition(): IExportPurchaseSlipConditionInput {
    // システム日付を取得
    const today = DateTimeUtils.today();
    // 当日の前月年月日
    const startDate = DateTimeUtils.formatIso(DateTimeUtils.addMonths(today, - 1));
    // 当年月日
    const endDate = DateTimeUtils.formatIso(today);

    return {
      purchase: true,
      arrival: true,
      order: true,
      returning: true,
      withdrawal: false,
      targetPeriod: PurchaseSlipTargetPeriodDiv.SlipDate,
      startDate: startDate,
      endDate: endDate,
      exportInfoType: ExportSlipTypeDiv.Slip,
      organization: '000000',
      productCode: '',
      salseSupplierMgtOrganization: '0',
      salseSupplier: '0',
      picEmployeeCodeStart: '',
      picEmployeeCodeEnd: '',
      payeeCodeStart: '',
      payeeCodeEnd: '',
      cutoffDay: '',
      whCodeStart: '',
      whCodeEnd: '',
      itemMakerCdStart: '',
      itemMakerCdEnd: '',
      partsNumber: '',
      partsName: ''
    };
  }

  /**
   * テキスト出力情報の一覧を設定
   * @param exportPatternCodeList テキスト出力パターンコード配列
   */
  public setExportPatternCode(exportPatternCodeList: string[]): void {
    this.exportPurchaseSlipConditionManager.setExportPatternCode(exportPatternCodeList);
  }

  /**
   * 仕入伝票情報出力内容を設定
   * @param purchaseSlipExportContentList 仕入伝票情報出力内容配列
   */
  public setPurchaseSlipExportContentList(purchaseSlipExportContentList: string[]): void {
    this.exportPurchaseSlipConditionManager.setPurchaseSlipExportContentList(purchaseSlipExportContentList);
  }

  /**
   * 組織コードを設定
   * @param organization 組織コード
   * @param salseSupplierMgtOrganization 組織選択コード
   */
  public setOrganization(organization: string, salseSupplierMgtOrganization: string, productCode: string): void {
    this.exportPurchaseSlipConditionManager.setOrganizationCode(organization, salseSupplierMgtOrganization, productCode);
  }

  /**
   * 担当者コード
   * @param picEmployeeCodeStart 担当者コード開始
   * @param picEmployeeCodeEnd 担当者コード終了
   */
  public setPicEmployeeCode(picEmployeeCodeStart: string, picEmployeeCodeEnd: string): void {
    this.exportPurchaseSlipConditionManager.setPicEmployeeCode(picEmployeeCodeStart, picEmployeeCodeEnd);
  }

  /**
   * 仕入先コードを設定
   * @param payeeCodeStart 仕入先コード開始
   * @param payeeCodeEnd 仕入先コード終了
   * @param salseSupplier 仕入先コード選択
   */
  public setSupplierCd(payeeCodeStart: string, payeeCodeEnd: string, salseSupplier: string): void {
    this.exportPurchaseSlipConditionManager.setSupplierCd(payeeCodeStart, payeeCodeEnd, salseSupplier);
  }

  /**
   * 締日を設定
   * @param cutoffDay
   */
  public setCutoffDay(cutoffDay: string): void {
    this.exportPurchaseSlipConditionManager.setCutoffDay(cutoffDay);
  }

  /**
   * 倉庫コードを設定
   * @param whCodeStart 倉庫コード開始
   * @param whCodeEnd 倉庫コード終了
   */
  public setWhCode(whCodeStart: string, whCodeEnd: string): void {
    this.exportPurchaseSlipConditionManager.setWhCode(whCodeStart, whCodeEnd);
  }

  /**
   * メーカーコードを設定
   * @param itemMakerCdStart メーカーコード開始
   * @param itemMakerCdEnd メーカーコード終了
   */
  public setItemMakerCd(itemMakerCdStart: string, itemMakerCdEnd: string): void {
    this.exportPurchaseSlipConditionManager.setItemMakerCd(itemMakerCdStart, itemMakerCdEnd);
  }

  /**
   * 品番を設定
   * @param partsNumber
   */
  public setPartsNumber(partsNumber: string): void {
    this.exportPurchaseSlipConditionManager.setPartsNumber(partsNumber);
  }

  /**
   * 品名を設定
   * @param partsName
   */
  public setPartsName(partsName: string): void {
    this.exportPurchaseSlipConditionManager.setPartsName(partsName);
  }

  /**
   * 日付の設定
   * @param dateStart 開始日
   * @param dateEnd 終了日
   * @param targetPeriod 対象期間
   */
  public setDate(dateStart: string, dateEnd: string, targetPeriod: string): void {
    this.exportPurchaseSlipConditionManager.setDate(dateStart, dateEnd, targetPeriod);
  }

  /**
   * ダウンロードのファイルを取得
   * [GET] /exportpatterninfo/all/csv
   * @param salseSupplierMgtOrganization 組織選択
   * @return ダウンロードファイルの一覧
   */
  public export(salseSupplierMgtOrganization) {
    const params: BlApiQueryParams = this.exportPurchaseSlipConditionManager.makeQueryParameter(salseSupplierMgtOrganization);
    return this.exportConditionInfoResource.get<{ notificationPushService: NotificationPushService }>(
      { params: params, entityOptions: { exPath: 'csv' } }
    );
  }

  /**
   * 下書きモードを設定する
   * @param v 下書きモード
   */
  public setDocumentMode(v: string): void {
    this.exportPurchaseSlipConditionManager.setDocumentMode(v);
  }

  /**
   * プロダクトコード配列を設定する
   * @param productCodes プロダクトコード配列
   */
  public setProductCodes(productCodes: string[]): void {
    this.exportPurchaseSlipConditionManager.setProductCodes(productCodes);
  }

  /**
   * ユニークIdを設定
   * @param a
   */
  public setClientSessionId(a: string): void {
    this.exportPurchaseSlipConditionManager.setClientSessionId(a);
  }
}
