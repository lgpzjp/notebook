import { Injectable } from '@angular/core';
import { ExportStockConditionSearch } from './export-stock.define';
import {
  BlApiQueryParams,
} from '@blcloud/bl-ng-common';
import { ExportStockConditionManager } from './export-stock.condition';
import { ExportConditionInfoResource } from '@blcloud/bl-ng-resource';
import {
  NotificationPushService
} from '@blcloud/bl-ng-common';
import { DateTimeUtils } from '@blcloud/bl-common';
import { StockExportContent } from '@blcloud/bl-datamodel/enum/stock/stock-export-content';

/**
 * 在庫出力サービス
 */
@Injectable()
export class ExportStockService {

  constructor(
    public exportStockConditionManager: ExportStockConditionManager,
    private exportConditionInfoResource: ExportConditionInfoResource,
  ) {
  }

  /**
   * 表示用抽出条件を初期化
   */
  initExportStockConditionSearch(): ExportStockConditionSearch {
    // システム日付を取得
    const today = DateTimeUtils.today();
    // 当日の前月年月日
    const startDate = DateTimeUtils.formatIso(DateTimeUtils.addMonths(today, - 1));
    // 当年月
    const endDate = DateTimeUtils.formatIso(today);

    return {
      startDate: startDate,
      endDate: endDate,
      outputInfo: StockExportContent.Stock,
      productCode: '',
    };
  }

  /**
   * get file export to download
   * [GET] /exportpatterninfo/all/csv
   * @return list file to download
   */
  public export() {
    const param: BlApiQueryParams = this.exportStockConditionManager.makeQueryParameter();
    return this.exportConditionInfoResource.get<{ notificationPushService: NotificationPushService }>(
      { params: param, entityOptions: { exPath: 'csv' }}
    );
  }

  /**
   * set list テキスト出力情報
   * @param exportPatternCodeList テキスト出力情報配列
   */
  public setExportPatternCodeList(exportPatternCodeList: string[]): void {
    this.exportStockConditionManager.setExportPatternCodeList(exportPatternCodeList);
  }

  /**
   * 日付の設定
   * @param updateDateTimeStart 開始日
   * @param updateDateTimeEnd 終了日
   */
  public setUpdateDateTime(updateDateTimeStart: string, updateDateTimeEnd: string): void {
    this.exportStockConditionManager.setUpdateDateTime(updateDateTimeStart, updateDateTimeEnd);
  }

  /**
   * 組織
   * @param whOrganizationCode 組織
   */
  public setWhOrganizationCode(whOrganizationCode: string): void {
    this.exportStockConditionManager.setWhOrganizationCode(whOrganizationCode);
  }

  /**
   * 倉庫コード
   * @param whCodeStart 倉庫コード開始
   * @param whCodeEnd 倉庫コード終了
   */
  public setWhCode(whCodeStart: string, whCodeEnd: string): void {
    this.exportStockConditionManager.setWhCode(whCodeStart, whCodeEnd);
  }

  /**
   * 棚番
   * @param shelfNumStart 棚番開始
   * @param shelfNumEnd 棚番終了
   */
  public setShelfNum(shelfNumStart: string, shelfNumEnd: string): void {
    this.exportStockConditionManager.setShelfNum(shelfNumStart, shelfNumEnd);
  }

  /**
   * 仕入先コード
   * @param supplierCdStart 仕入先コード開始
   * @param supplierCdEnd 仕入先コード終了
   */
  public setSupplierCd(supplierCdStart: string, supplierCdEnd: string): void {
    this.exportStockConditionManager.setSupplierCd(supplierCdStart, supplierCdEnd);
  }

  /**
   * メーカーコード
   * @param itemMakerCdStart メーカーコード開始
   * @param itemMakerCdEnd メーカーコード終了
   */
  public setItemMakerCd(itemMakerCdStart: string, itemMakerCdEnd: string): void {
    this.exportStockConditionManager.setItemMakerCd(itemMakerCdStart, itemMakerCdEnd);
  }

  /**
   * 商品大分類コード
   * @param itemLClassCdStart 商品大分類コード開始
   * @param itemLClassCdEnd 商品大分類コード終了
   */
  public setItemLClassCd(itemLClassCdStart: string, itemLClassCdEnd: string): void {
    this.exportStockConditionManager.setItemLClassCd(itemLClassCdStart, itemLClassCdEnd);
  }

  /**
   * 商品中分類コード
   * @param itemMClassCdStart 商品中分類コード開始
   * @param itemMClassCdEnd 商品中分類コード終了
   */
  public setItemMClassCd(itemMClassCdStart: string, itemMClassCdEnd: string): void {
    this.exportStockConditionManager.setItemMClassCd(itemMClassCdStart, itemMClassCdEnd);
  }

  /**
   * グループコード
   * @param blCdGroupCodeStart グループコード開始
   * @param blCdGroupCodeEnd グループコード終了
   */
  public setBlCdGroupCode(blCdGroupCodeStart: string, blCdGroupCodeEnd: string): void {
    this.exportStockConditionManager.setBlCdGroupCode(blCdGroupCodeStart, blCdGroupCodeEnd);
  }

  /**
   * BLコード
   * @param blPrtsCdStart BLコード開始
   * @param blPrtsCdEnd BLコード終了
   */
  public setBlPrtsCd(blPrtsCdStart: string, blPrtsCdEnd: string): void {
    this.exportStockConditionManager.setBlPrtsCd(blPrtsCdStart, blPrtsCdEnd);
  }

  /**
   * 検索条件商品品番
   * @param searchItemPartsNumber
   */
  public setSearchItemPartsNumber(searchItemPartsNumber: string): void {
    this.exportStockConditionManager.setSearchItemPartsNumber(searchItemPartsNumber);
  }

  /**
   * 検索条件商品名称
   * @param searchItemPartsName
   */
  public setSearchItemPartsName(searchItemPartsName: string): void {
    this.exportStockConditionManager.setSearchItemPartsName(searchItemPartsName);
  }

  /**
   * プロダクトコード配列を設定する
   * @param productCodes プロダクトコード配列
   */
  public setProductCodes(productCodes: string[]): void {
    this.exportStockConditionManager.setProductCodes(productCodes);
  }

  /**
   * ユニークIdを設定
   * @param clientSessionId ユニークId
   */
  public setClientSessionId(clientSessionId: string): void {
    this.exportStockConditionManager.setClientSessionId(clientSessionId);
  }

  /**
   * clear condition search
   */
  public clear() {
    this.exportStockConditionManager.clear();
  }

}
