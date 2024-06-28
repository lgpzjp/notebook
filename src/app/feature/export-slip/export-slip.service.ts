import { Injectable } from '@angular/core';
import { IExportSlipConditionInput, IDropDownInput } from './export-slip.define';
import { BlApiQueryParams, NotificationPushService } from '@blcloud/bl-ng-common';
import { ExportSlipConditionManager } from './export-slip.condition';
import { ExportConditionInfoResource } from '@blcloud/bl-ng-resource';
import { OrganizationCtrlDiv } from '@blcloud/bl-datamodel/enum/company/organization-ctrl-div';

/**
 * 検索サービス
 */
@Injectable()
export class ExportSlipService {

  constructor(
    private exportSlipConditionManager: ExportSlipConditionManager,
    private exportConditionInfoResource: ExportConditionInfoResource,
  ) { }

  /**
   * 表示用抽出条件を初期化
   */
  initCondition(): IExportSlipConditionInput {
    return {
      slipKindQuotation: true,
      slipKindDirections: false,
      invoice: true,
      targetPeriod: '1',
      startDate: '',
      endDate: '',
      exportInfoType: '0',
      productCode: '1',
      salseRecordedOrganization: OrganizationCtrlDiv.BillingAdd,
      exportCustomerVehicle: false
    };
  }

  /**
   * init 対象期間
   */
  initTargetPeriodItems(): IDropDownInput[] {
    return [{ code: '1', name: '伝票日付' }, { code: '2', name: '更新日付' }];
  }

  /**
 * テキスト出力情報の一覧を設定
 * @param a Array
 */
  public setExportPatternCode(v: string[]): void {
    this.exportSlipConditionManager.setExportPatternCode(v);
  }

  /**
   * プロダクトコード配列を設定する
   * @param productCodes プロダクトコード配列
   */
  public setProductCodes(productCodes: string[]): void {
    this.exportSlipConditionManager.setProductCodes(productCodes);
  }

  /**
* 伝票タイプを設定
* @param a array (配列)
*/
  public setSlipKind(a: string[]): void {
    this.exportSlipConditionManager.setSlipKind(a);
  }

  /**
   * 売上実績計上組織コードを設定
   * @param v string
   */
  public setSalseRecordedResultsOrganizationCode(v: string): void {
    this.exportSlipConditionManager.setSalseRecordedResultsOrganizationCode(v);
  }

  /**
   * 売上請求計上組織コードを設定
   * @param v string
   */
  public setSalseRecordedBillingsOrganizationCode(v: string): void {
    this.exportSlipConditionManager.setSalseRecordedBillingsOrganizationCode(v);
  }

  /**
   * 顧客車両出力を設定
   * @param n number
   */
  public setExportCustomerVehicle(n: number): void {
    this.exportSlipConditionManager.setExportCustomerVehicle(n);
  }

  /**
   * 日付の設定
   * @param s 開始日
   * @param e 終了日
   * @param draft 下書きモード
   */
  public setDate(s: string, e: string, documentMode?: boolean): void {
    this.exportSlipConditionManager.setDate(s, e, documentMode);
  }

  /**
   * ダウンロードのファイルを取得
   * [GET] /exportpatterninfo/all/csv
   * @return ダウンロードファイルの一覧
   */
  public export() {
    const params: BlApiQueryParams = this.exportSlipConditionManager.makeQueryParameter();
    return this.exportConditionInfoResource.get<{ notificationPushService: NotificationPushService }>(
      { params: params, entityOptions: { exPath: 'csv' } }
    );
  }

  public setDocumentMode(v: boolean): void {
    this.exportSlipConditionManager.setDocumentMode(v);
  }

  /**
   * ユニークIdを設定
   * @param a
   */
  public setClientSessionId(a: string): void {
    this.exportSlipConditionManager.setClientSessionId(a);
  }
}

