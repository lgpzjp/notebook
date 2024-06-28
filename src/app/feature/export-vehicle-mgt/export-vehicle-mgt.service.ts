import { Injectable } from '@angular/core';
import { IExportVehicleMgtConditionInput } from './export-vehicle-mgt.define';
import { ExportVehicleMgtConditionManager } from './export-vehicle-mgt.condition';
import { ExportConditionInfoResource } from '@blcloud/bl-ng-resource';
import { DateTimeUtils } from '@blcloud/bl-common';
import { BlApiQueryParams, NotificationPushService } from '@blcloud/bl-ng-common';

/**
 * 車両管理出力サービス
 */
@Injectable()
export class ExportVehicleMgtService {

  constructor(
    private exportVehicleMgtConditionManager: ExportVehicleMgtConditionManager,
    private exportConditionInfoResource: ExportConditionInfoResource,
  ) { }

  /**
   * 表示用抽出条件を初期化
   */
  initCondition(): IExportVehicleMgtConditionInput {
    // システム日付を取得
    const today = DateTimeUtils.today();
    // 当日の前月年月日
    const startDate = DateTimeUtils.formatIso(DateTimeUtils.addMonths(today, - 1));
    // 当年月日
    const endDate = DateTimeUtils.formatIso(today);

    return {
      outputInfo: '0',
      targetPeriod: '',
      startDate: startDate,
      endDate: endDate,
      exportInfoType: '0',
      organizationCode: '000000',
      customerCodeStart: '',
      customerCodeEnd: '',
      custVcleManageGroupCode: '',
      fullModel: '',
      vcleRemarksName: '',
      blCdGroupCodeStart: '',
      blCdGroupCodeEnd: '',
      blPrtsCdStart: '',
      blPrtsCdEnd: '',
      partsNumber: '',
      partsName: '',
      vehicleStockBackorderDiv: '0',
      whCodeStart: '',
      whCodeEnd: ''

    };
  }

 /**
  * テキスト出力情報の一覧を設定
  * @param a Array
  */
  public setExportPatternCode(v: string[]): void {
    this.exportVehicleMgtConditionManager.setExportPatternCode(v);
  }

 /**
  * 出力内容を設定
  * @param outputInfo
  */
  public setVehicleExportContent(outputInfo: string): void {
    this.exportVehicleMgtConditionManager.setVehicleExportContent(outputInfo);
  }

  /**
   * 組織コードを設定
   * @param organizationCode
   */
  public setOrganizationCode(organizationCode: string): void {
    this.exportVehicleMgtConditionManager.setOrganizationCode(organizationCode);
  }

  /**
   * 得意先コードを設定
   * @param customerCodeStart 得意先コード開始
   * @param customerCodeEnd 得意先コード終了
   */
  public setCustomerCode(customerCodeStart: string, customerCodeEnd: string): void {
    this.exportVehicleMgtConditionManager.setCustomerCode(customerCodeStart, customerCodeEnd);
  }

  /**
   * 管理番号を設定
   * @param custVcleManageGroupCode
   */
  public setCustVcleManageGroupCode(custVcleManageGroupCode: string): void {
    this.exportVehicleMgtConditionManager.setCustVcleManageGroupCode(custVcleManageGroupCode);
  }

  /**
   * 型式を設定
   * @param fullModel
   */
  public setFullModel(fullModel: string): void {
    this.exportVehicleMgtConditionManager.setFullModel(fullModel);
  }

  /**
   * 車両備考を設定
   * @param vcleRemarksName
   */
  public setVcleRemarksName(vcleRemarksName: string): void {
    this.exportVehicleMgtConditionManager.setVcleRemarksName(vcleRemarksName);
  }

  /**
   * グループコードを設定
   * @param blCdGroupCodeStart グループコード開始
   * @param blCdGroupCodeEnd グループコード終了
   */
  public setBlCdGroupCode(blCdGroupCodeStart: string, blCdGroupCodeEnd: string): void {
    this.exportVehicleMgtConditionManager.setBlCdGroupCode(blCdGroupCodeStart, blCdGroupCodeEnd);
  }

  /**
   * BLコードを設定
   * @param blPrtsCdStart BLコード開始
   * @param blPrtsCdEnd BLコード終了
   */
  public setBlPrtsCd(blPrtsCdStart: string, blPrtsCdEnd: string): void {
    this.exportVehicleMgtConditionManager.setBlPrtsCd(blPrtsCdStart, blPrtsCdEnd);
  }

  /**
   * 品番を設定
   * @param partsNumber
   */
  public setPartsNumber(partsNumber: string): void {
    this.exportVehicleMgtConditionManager.setPartsNumber(partsNumber);
  }

  /**
   * 品名を設定
   * @param partsName
   */
  public setPartsName(partsName: string): void {
    this.exportVehicleMgtConditionManager.setPartsName(partsName);
  }

  /**
   * 在庫取寄区を設定
   * @param vehicleStockBackorderDiv
   */
  public setVehicleStockBackorderDiv(vehicleStockBackorderDiv: string): void {
    this.exportVehicleMgtConditionManager.setVehicleStockBackorderDiv(vehicleStockBackorderDiv);
  }

  /**
   * 倉庫コードを設定
   * @param whCodeStart 倉庫コード開始
   * @param whCodeEnd 倉庫コード開始
   */
  public setWhCode(whCodeStart: string, whCodeEnd: string): void {
    this.exportVehicleMgtConditionManager.setWhCode(whCodeStart, whCodeEnd);
  }

  /**
   * 日付の設定
   * @param startDate 開始日
   * @param endDate 終了日
   * @param targetPeriod 対象期間
   */
  public setDate(startDate: string, endDate: string, targetPeriod: string): void {
    this.exportVehicleMgtConditionManager.setDate(startDate, endDate, targetPeriod);
  }

  /**
   * ダウンロードのファイルを取得
   * [GET] /exportpatterninfo/all/csv
   * @return ダウンロードファイルの一覧
   */
  public export() {
    const params: BlApiQueryParams = this.exportVehicleMgtConditionManager.makeQueryParameter();
    return this.exportConditionInfoResource.get<{ notificationPushService: NotificationPushService }>(
      { params: params, entityOptions: { exPath: 'csv' } }
    );
  }

  /**
   * プロダクトコード配列を設定する
   * @param productCodes プロダクトコード配列
   */
  public setProductCodes(productCodes: string[]): void {
    this.exportVehicleMgtConditionManager.setProductCodes(productCodes);
  }

  /**
   * ユニークIdを設定
   * @param a
   */
  public setClientSessionId(a: string): void {
    this.exportVehicleMgtConditionManager.setClientSessionId(a);
  }
}

