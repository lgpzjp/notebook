import { Injectable } from '@angular/core';
import { ExportCustomerVehicleConditionSearch } from './export-customer-vehicle.define';
import {
  BlApiQueryParams,
} from '@blcloud/bl-ng-common';
import { ExportCustomerVehicleConditionManager } from './export-customer-vehicle.condition';
import { ExportConditionInfoResource } from '@blcloud/bl-ng-resource';
import {
  NotificationPushService
} from '@blcloud/bl-ng-common';

/**
 * 検索サービス
 */
@Injectable()
export class ExportCustomerVehicleService {
  constructor(
    public exportCustomerVehicleConditionManager: ExportCustomerVehicleConditionManager,
    private exportConditionInfoResource: ExportConditionInfoResource,
  ) {
  }

  /**
   * 表示用抽出条件を初期化
   */
  initExportCustomerVehicleConditionSearch(): ExportCustomerVehicleConditionSearch {
    return {
      startDate: '',
      endDate: '',
      outputInfo: '1',
      productCode: '',
    };
  }

  /**
   * get file export to download
   * [GET] /exportpatterninfo/all/csv
   * @return list file to download
   */
  public export() {
    const param: BlApiQueryParams = this.exportCustomerVehicleConditionManager.makeQueryParameter();
    return this.exportConditionInfoResource.get<{ notificationPushService: NotificationPushService }>(
      { params: param, entityOptions: { exPath: 'csv' }}
    );
  }

  /**
   * 日付の設定
   * @param s 開始日
   * @param e 終了日
   */
  public setUpdateDateTime(s: string, e: string): void {
    this.exportCustomerVehicleConditionManager.setUpdateDateTime(s, e);
  }

  /**
   * 管理組織
   * @param v 管理組織
   * @param customerInfo mode
   */
  public setOrganizationCode(v: string, customerInfo?: boolean): void {
    this.exportCustomerVehicleConditionManager.setOrganizationCode(v, customerInfo);
  }

  /**
   * 顧客コード
   * @param s start
   * @param e end
   */
  public setCustomerCode(s: string, e: string): void {
    this.exportCustomerVehicleConditionManager.setCustomerCode(s, e);
  }

  /**
   * 顧客フリガナ
   * @param value 顧客フリガナ
   */
  public setCustomerNamekana1(value: string): void {
    this.exportCustomerVehicleConditionManager.setCustomerNameKana1(value);
  }

  /**
   * set mode 出力内容
   * @param v
   */
  public setCustomerInfoMode(v: boolean): void {
    this.exportCustomerVehicleConditionManager.setCustomerInfoMode(v);
  }

  /**
   * プロダクトコード配列を設定する
   * @param productCodes プロダクトコード配列
   */
  public setProductCodes(productCodes: string[]): void {
    this.exportCustomerVehicleConditionManager.setProductCodes(productCodes);
  }

  /**
   * set list テキスト出力情報
   * @param a Array
   */
  public setExportPatternCodeList(a: string[]): void {
    this.exportCustomerVehicleConditionManager.setExportPatternCodeList(a);
  }

  /**
   * clear condition search
   */
  public clear() {
    this.exportCustomerVehicleConditionManager.clear();
  }

  /**
   * set client session Id
   * @param a
   */
  public setClientSessionId(a: string): void {
    this.exportCustomerVehicleConditionManager.setClientSessionId(a);
  }
}
