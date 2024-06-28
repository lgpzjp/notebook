import { Injectable } from '@angular/core';
import { IExportStockMoveSlipConditionInput } from './export-stock-move-slip.define';
import { ExportStockMoveSlipConditionManager } from './export-stock-move-slip.condition';
import { ExportConditionInfoResource } from '@blcloud/bl-ng-resource';
import { DateTimeUtils } from '@blcloud/bl-common';
import { BlApiQueryParams, NotificationPushService } from '@blcloud/bl-ng-common';

/**
 * 在庫移動伝票サービス
 */
@Injectable()
export class ExportStockMoveSlipService {

  constructor(
    private exportStockMoveSlipConditionManager: ExportStockMoveSlipConditionManager,
    private exportConditionInfoResource: ExportConditionInfoResource,
  ) { }

  /**
   * 表示用抽出条件を初期化
   */
  initCondition(): IExportStockMoveSlipConditionInput {
    // システム日付を取得
    const today = DateTimeUtils.today();
    // 当日の前月年月日
    const startDate = DateTimeUtils.formatIso(DateTimeUtils.addMonths(today, - 1));
    // 当年月日
    const endDate = DateTimeUtils.formatIso(today);

    return {
      shipping: true,
      nonArrival: true,
      arrived: true,
      shipment: true,
      entering: true,
      targetPeriod: '0',
      startDate: startDate,
      endDate: endDate,
      shippingOrganizationCode: '000000',
      enteringOrganizationCode: '000000',
      shippingWhCodeStart: '',
      shippingWhCodeEnd: '',
      enteringWhCodeStart: '',
      enteringWhCodeEnd: '',
      picEmployeeCodeStart: '',
      picEmployeeCodeEnd: '',
      itemMakerCdStart: '',
      itemMakerCdEnd: '',
      partsNumber: '',
      partsName: ''

    };
  }

  /**
   * init 対象期間
   */
  initTargetPeriodItems() {
    return [{ code: '0', name: '出荷日付' }, { code: '1', name: '入荷日付' }, { code: '2', name: '更新日付' }];
  }

  /**
   * テキスト出力情報の一覧を設定
   * @param a Array
   */
  public setExportPatternCode(v: string[]): void {
    this.exportStockMoveSlipConditionManager.setExportPatternCode(v);
  }

  /**
   * 出力内容を設定
   * @param a stockMoveExportContentList 出力内容配列
   */
  public setStockMoveExportContentList(stockMoveExportContentList: string[]): void {
    this.exportStockMoveSlipConditionManager.setStockMoveExportContentList(stockMoveExportContentList);
  }

  /**
   * 対象期間
   * @param v
   */
  public setTargetPeriod(v: string): void {
    this.exportStockMoveSlipConditionManager.setTargetPeriod(v);
  }

  /**
   * 出庫組織コードを設定
   * @param shippingOrganizationCode
   */
  public setShippingOrganizationCode(shippingOrganizationCode: string): void {
    this.exportStockMoveSlipConditionManager.setShippingOrganizationCode(shippingOrganizationCode);
  }

  /**
   * 入庫組織コードを設定
   * @param enteringOrganizationCode
   */
  public setEnteringOrganizationCode(enteringOrganizationCode: string): void {
    this.exportStockMoveSlipConditionManager.setEnteringOrganizationCode(enteringOrganizationCode);
  }

  /**
   * 出庫倉庫コードを設定
   * @param sshippingWhCodeStart 出庫倉庫コード開始
   * @param sshippingWhCodeEnd 出庫倉庫コード終了
   */
  public setShippingWhCode(sshippingWhCodeStart: string, sshippingWhCodeEnd: string): void {
    this.exportStockMoveSlipConditionManager.setShippingWhCode(sshippingWhCodeStart, sshippingWhCodeEnd);
  }

  /**
   * 入庫倉庫コードを設定
   * @param enteringWhCodeStart 入庫倉庫コード開始picEmployeeCodeStart
   * @param enteringWhCodeEnd 入庫倉庫コード終了
   */
  public setEnteringWhCode(enteringWhCodeStart: string, enteringWhCodeEnd: string): void {
    this.exportStockMoveSlipConditionManager.setEnteringWhCode(enteringWhCodeStart, enteringWhCodeEnd);
  }

  /**
   * 担当者コードを設定
   * @param picEmployeeCodeStart 担当者コード開始itemMakerCdStart
   * @param picEmployeeCodeEnd 担当者コード終了
   */
  public setPicEmployeeCode(picEmployeeCodeStart: string, picEmployeeCodeEnd: string): void {
    this.exportStockMoveSlipConditionManager.setPicEmployeeCode(picEmployeeCodeStart, picEmployeeCodeEnd);
  }

  /**
   * メーカーコードを設定
   * @param itemMakerCdStart メーカーコード開始
   * @param itemMakerCdEnd メーカーコード終了
   */
  public setItemMakerCd(s: string, e: string): void {
    this.exportStockMoveSlipConditionManager.setItemMakerCd(s, e);
  }

  /**
   * 品番を設定
   * @param partsNumber
   */
  public setPartsNumber(partsNumber: string): void {
    this.exportStockMoveSlipConditionManager.setPartsNumber(partsNumber);
  }

  /**
   * 品名を設定
   * @param partsName
   */
  public setPartsName(partsName: string): void {
    this.exportStockMoveSlipConditionManager.setPartsName(partsName);
  }

  /**
   * 日付の設定
   * @param startDate 開始日
   * @param endDate 終了日
   * @param targetPeriod 対象期間
   */
  public setDate(startDate: string, endDate: string, targetPeriod: string): void {
    this.exportStockMoveSlipConditionManager.setDate(startDate, endDate, targetPeriod);
  }

  /**
   * ダウンロードのファイルを取得
   * [GET] /exportpatterninfo/all/csv
   * @return ダウンロードファイルの一覧
   */
  public export() {
    const params: BlApiQueryParams = this.exportStockMoveSlipConditionManager.makeQueryParameter();
    return this.exportConditionInfoResource.get<{ notificationPushService: NotificationPushService }>(
      { params: params, entityOptions: { exPath: 'csv' } }
    );
  }

  /**
   * プロダクトコード配列を設定する
   * @param productCodes プロダクトコード配列
   */
  public setProductCodes(productCodes: string[]): void {
    this.exportStockMoveSlipConditionManager.setProductCodes(productCodes);
  }

  /**
   * ユニークIdを設定
   * @param a
   */
  public setClientSessionId(a: string): void {
    this.exportStockMoveSlipConditionManager.setClientSessionId(a);
  }
}
