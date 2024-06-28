import { Injectable } from '@angular/core';
import { ExportHistoryConditionSearch } from './export-history.define';
import {
  BlApiQueryParams
} from '@blcloud/bl-ng-common';
import { ExportHistoryConditionManager } from './export-history.condition';
import { ExportConditionInfoResource } from '@blcloud/bl-ng-resource';
import { IDownloadContent } from '../../page/export-page/export-page.define';

/**
 * 検索サービス
 */
@Injectable()
export class ExportHistoryService {
  constructor(
    public exportHistoryConditionManager: ExportHistoryConditionManager,
    private exportConditionInfoResource: ExportConditionInfoResource,
  ) {

  }
  /**
   * 表示用抽出条件を初期化
   */
  initExportHistoryConditionSearch(): ExportHistoryConditionSearch {
    return {
      startDate: '',
      endDate: '',
      outputInfo: '5',
      workType: '0',
    };
  }

  /**
   * get file export to download
   * @return list file to download
   */
  public export() {
    const param: BlApiQueryParams = this.exportHistoryConditionManager.makeQueryParameter();
    return this.exportConditionInfoResource.get<{ listFile: IDownloadContent[] }>(
      { params: param, entityOptions: { exPath: 'csv' }}
    );
  }

  /**
   * 日付の設定
   * @param s 開始日
   * @param e 終了日
   * @param draft 下書きモード
   */
  public setDate(s: string, e: string): void {
    this.exportHistoryConditionManager.setDate(s, e);
  }

  /**
   * 顧客コードの設定
   * @param s start code
   * @param e end code
   */
  public setCustomerCode(s: string, e: string): void {
    this.exportHistoryConditionManager.setCustomerCode(s, e);
  }

  /**
   * 顧客フリガナの設定
   * @param value 顧客フリガナ
   */
  public setCustomerNamekana1(value: string): void {
    this.exportHistoryConditionManager.setCustomerNameKana1(value);
  }

  /**
   * set customer infor mode
   * @param v mode
   */
  public setCustomerInfoMode(v: boolean): void {
    this.exportHistoryConditionManager.setCustomerInfoMode(v);
  }

  /**
   * プロダクトコード配列を設定する
   * @param productCodes プロダクトコード配列
   */
  public setProductCodes(productCodes: string[]): void {
    this.exportHistoryConditionManager.setProductCodes(productCodes);
  }

  /**
   * 管理組織
   * @param v 管理組織
   * @param customerInfo mode
   */
  public setOrganizationCode(v: string): void {
    this.exportHistoryConditionManager.setOrganizationCode(v);
  }

  /**
   * clear search condition
   */
  public clear() {
    this.exportHistoryConditionManager.clear();
  }

  /**
   * set list テキスト出力情報
   * @param a Array
   */
  public setExportPatternCodeList(a: string[]): void {
    this.exportHistoryConditionManager.setExportPatternCodeList(a);
  }

  /**
   * set uniqueId
   * @param a
   */
  public setClientSessionId(a: string): void {
    this.exportHistoryConditionManager.setClientSessionId(a);
  }
}
