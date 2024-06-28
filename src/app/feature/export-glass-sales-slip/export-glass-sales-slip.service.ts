import { Injectable } from '@angular/core';
import { BlApiQueryParams, NotificationPushService } from '@blcloud/bl-ng-common';
import { ExportConditionInfoResource } from '@blcloud/bl-ng-resource';
import { ExportSlipTypeDiv } from '@blcloud/bl-datamodel/enum/output/export-slip-type-div';
import { SalesSlipSupplierSelect } from '@blcloud/bl-datamodel/enum/sales/sales-slip-supplier-select';
import { DateTimeUtils } from '@blcloud/bl-common';
import { ProductCode } from '@blcloud/bl-datamodel/enum/common/product-code';
import { OutputDiv } from '@blcloud/bl-datamodel/enum/common/output-div';
import { ExportPartsWorkDiv, ExportOrderDiv, StatisticalAnalysisMaxCSVCountSize } from './export-glass-sales-slip.define';
import { ExportGlassSalesSlipConditionManager } from './export-glass-sales-slip.condition';
import { IExportGlassSalesSlipConditionInput } from './export-glass-sales-slip.define';
import { SelectTypeEnum } from './../range-organization/range-organization.define';
import {
  forEach as _forEach,
  isNil as _isNil
} from 'lodash';
import { MaxCSVCountSize } from '../../page/export-page/export-page.define';

/**
 * 売上伝票出力サービス
 */
@Injectable()
export class ExportGlassSalesSlipService {

  constructor(
    private exportSalesSlipConditionManager: ExportGlassSalesSlipConditionManager,
    private exportConditionInfoResource: ExportConditionInfoResource,
  ) {
  }

  /** 初期選択組織コード */
  defaultSelectedOrganizationCode: string;

  /**
   * 表示用抽出条件を初期化
   */
  initCondition(): IExportGlassSalesSlipConditionInput {
    // システム日付を取得
    const today = DateTimeUtils.today();
    // 当日の前月年月日
    const startDate = DateTimeUtils.formatIso(DateTimeUtils.addMonths(today, -1));
    // 当年月日
    const endDate = DateTimeUtils.formatIso(today);

    return {
      creditSales: true,
      creditReturned: true,
      cashSales: true,
      cashReturned: true,
      claim: false,
      direction: false,
      temporarySave: false,
      targetPeriod: SalesSlipSupplierSelect.SlipDate,
      startDate: startDate,
      endDate: endDate,
      exportInfoType: ExportSlipTypeDiv.Slip,
      organization: this.defaultSelectedOrganizationCode,
      productCode: ProductCode.Glass,
      picEmployeeCodeS: null,
      picEmployeeCodeE: null,
      areaCdS: null,
      areaCdE: null,
      outPutHeaderDiv: OutputDiv.Output,
      dispBusinessCodeS: null,
      dispBusinessCodeE: null,
      cutoffDay: 0,
      glassClassDiv: ExportPartsWorkDiv.All,
      outPutOrderDiv: ExportOrderDiv.OrderDiv0,
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
   * @param salesSlipDivList 売上伝票情報出力内容配列
   */
  public setSalesSlipDivList(salesSlipDivList: string[]): void {
    this.exportSalesSlipConditionManager.setSalesSlipDivList(salesSlipDivList);
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
   */
  public setDate(dateStart: string, dateEnd: string, targetPeriod: string): void {
    this.exportSalesSlipConditionManager.setDate(dateStart, dateEnd, targetPeriod);
  }

  /**
   * 組織コードを設定
   * @param event
   */
  public setOrganizationObject(event: any): void {
    if (event.selectType === SelectTypeEnum.RANGE) {
      this.exportSalesSlipConditionManager.setOrganizationRange(event.organizationCodeFrom, event.organizationCodeTo);
    } else if (event.selectType === SelectTypeEnum.INDIVIDUAL) {
      this.exportSalesSlipConditionManager.setOrganizationList(this.cutOrganizationList(event.organizationList));
    } else if (event.selectType === SelectTypeEnum.ALL_ORGANAIZATION) {
      this.exportSalesSlipConditionManager.setOrganizationList(event.allOrganizationCode);
    }
  }

  /**
   * 組織個別指定リスト 空白箇所削除
   * @param organizationList
   */
  cutOrganizationList(organizationList: string[]): string[] {
    const exportOrganizationList = [];
    _forEach(organizationList, organization => {
      if (!_isNil(organization)) {
        exportOrganizationList.push(organization);
      }
    });
    return exportOrganizationList;
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
   * 担当者コード
   * @param picEmployeeCodeStart 担当者コード開始
   * @param picEmployeeCodeEnd 担当者コード終了
   */
  public setPicEmployeeCode(picEmployeeCodeStart: string, picEmployeeCodeEnd: string): void {
    this.exportSalesSlipConditionManager.setPicEmployeeCode(picEmployeeCodeStart, picEmployeeCodeEnd);
  }

  /**
   * 地区コード
   * @param areaCodeStart 地区コード開始
   * @param areaCodeEnd 地区コード終了
   */
  public setAreaCd(areaCodeStart: number, areaCodeEnd: number): void {
    this.exportSalesSlipConditionManager.setAreaCd(areaCodeStart, areaCodeEnd);
  }

  /**
   * 業種コード
   * @param dispBusinessCodeS 業種コード開始
   * @param dispBusinessCodeE 業種コード終了
   */
  public setDispBusinessCode(dispBusinessCodeS: number, dispBusinessCodeE: number): void {
    this.exportSalesSlipConditionManager.setDispBusinessCode(dispBusinessCodeS, dispBusinessCodeE);
  }

  /**
   * ヘッダ行
   * @param headerSelect ヘッダ行
   */
  public setOutPutHeaderDiv(headerSelect: string): void {
    this.exportSalesSlipConditionManager.setOutPutHeaderDiv(headerSelect);
  }

  /**
   * 部品作業区分
   * @param partWarkSelect 部品作業区分
   */
  public setGlassClassDiv(partWarkSelect: string): void {
    this.exportSalesSlipConditionManager.setGlassClassDiv(partWarkSelect);
  }

  /**
   * 順序
   * @param outPutOrderDiv 順序
   */
  public setOutPutOrderDiv(outPutOrderDiv: string): void {
    this.exportSalesSlipConditionManager.setOutPutOrderDiv(outPutOrderDiv);
  }

  /**
   * 締日
   * @param cutoffDay 締日
   */
  public setCutoffDay(cutoffDay: string): void {
    this.exportSalesSlipConditionManager.setCutoffDay(cutoffDay);
  }

  /**
   * プロダクトコード配列を設定する
   * @param productCodes プロダクトコード配列
   */
  public setProductCodes(productCodes: string): void {
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
   * @param isSplit 分割フラグ
   * @param isStatisticalAnalysis 統計分析タイプフラグ
   * @return ダウンロードファイルの一覧
   */
  public export(isSplit: boolean, isStatisticalAnalysis: boolean) {
    const params: BlApiQueryParams = this.exportSalesSlipConditionManager.makeQueryParameter();
    // 分割フラグが有効の場合はサイズを指定
    if (isSplit) {
      // 統計分析タイプの場合は最大件数を変更
      params.setSize(isStatisticalAnalysis ? StatisticalAnalysisMaxCSVCountSize : MaxCSVCountSize);
    }
    return this.exportConditionInfoResource.get<{ notificationPushService: NotificationPushService }>(
      { params: params, entityOptions: { exPath: 'csv' } }
    );
  }

  /**
   * 出力件数取得処理
   */
  public getCount() {
    const params: BlApiQueryParams = this.exportSalesSlipConditionManager.makeQueryParameter();
    return this.exportConditionInfoResource.get<{ totalCount: number }>(
      { params: params, entityOptions: { exPath: 'count' } }
    );
  }

}
