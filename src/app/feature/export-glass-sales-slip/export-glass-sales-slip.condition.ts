import {
  BlSearchCondition,
  BlConditionType,
  BlSearchConditionManager,
  BlApiQueryParams,
  BlSearchConditionGroup,
  BlSearchConditionDef,
} from '@blcloud/bl-ng-common';
import { DateTimeUtils } from '@blcloud/bl-common';
import { SalesSlipSupplierSelect } from '@blcloud/bl-datamodel/enum/sales/sales-slip-supplier-select';
import {
  isUndefined as _isUndefined,
  isEmpty as _isEmpty,
} from 'lodash';

/** 硝子売上伝票出力条件 */
class ExportGlassSalesSlipCondition extends BlSearchCondition {
  /** @override */
  public setValue(value: any): void {
    if (_isEmpty(value)) {
      super.clear();
    } else {
      super.setValue(value);
    }
  }

  /** @override */
  public setType(type: BlConditionType): void {
    if (_isUndefined(type)) {
      super.clear();
    } else {
      super.setType(type);
    }
  }
}

/**
 * 項目（le ge）設定
 */
abstract class RangeCondition extends BlSearchCondition {
  /** 開始 */
  protected dateS: BlSearchCondition;

  /** 終了 */
  protected dateE: BlSearchCondition;

  constructor(def: BlSearchConditionDef) {
    super(def);

    this.dateS = new BlSearchCondition(def);
    this.dateE = new BlSearchCondition(def);

    this.dateS.setType(BlConditionType.GreaterThanEqual);
    this.dateE.setType(BlConditionType.LessThanEqual);
  }

  /**
   * 開始を取得する
   * @return 開始
   */
  public getValueS(): string | number | (string | number)[] {
    return this.dateS.getValue();
  }

  /**
   * 終了を取得する
   * @return 終了
   */
  public getValueE(): string | number | (string | number)[] {
    return this.dateE.getValue();
  }

  /**
   * 開始の検索条件を取得する
   * @return 開始コンディション
   */
  public getConditionS(): BlSearchCondition {
    return this.dateS;
  }

  /**
   * 終了の検索条件を取得する
   * @return 終了コンディション
   */
  public getConditionE(): BlSearchCondition {
    return this.dateE;
  }

  /**
   * 検索条件を初期化する
   */
  public clear(): void {
    this.dateS.clear();
    this.dateE.clear();
  }

  /**
   * 日付設定
   * @param s 開始日
   * @param e 終了日
   */
  abstract setDate(s: string | number, e: string | number): void;
}

/**
 * プロダクトコード
 */
class ProductCodeCondition extends ExportGlassSalesSlipCondition {
  static readonly KEY = 'productCode';
}

/**
 * テキスト出力パターンコード配列
 */
class ExportPatternCodeListCondition extends ExportGlassSalesSlipCondition {
  static readonly KEY = 'exportPatternCodeList';
}

/**
 * 売上伝票情報出力内容配列
 */
class SalesSlipDivListCondition extends ExportGlassSalesSlipCondition {
  static readonly KEY = 'salesSlipDivList';
}

/**
 *  伝票基準日/更新日時/請求計上日
 */
class ChangeDateCondition extends RangeCondition {
  static readonly SLIP_KEY = 'slipStandardDate';
  static readonly UPDATE_KEY = 'updateDateTime';
  static readonly BILLING_KEY = 'billingRecordingDate';

  constructor(def: BlSearchConditionDef) {
    super(def);
  }

  /**
   * 日付設定
   * @param dateStart 開始日
   * @param dateEnd 終了日
   */
  public setDate(s: string, e: string): void {
    this.dateS.setValue((_isEmpty(s) || DateTimeUtils.initial.iso8601.date === s) ? undefined : s);
    this.dateE.setValue((_isEmpty(e) || DateTimeUtils.initial.iso8601.date === e) ? undefined : e);
  }
}

/**
 * 組織コード 個別、全組織指定
 */
class OrganizationListCondition extends ExportGlassSalesSlipCondition {
  static readonly KEY = 'slipOrganizationCodeList';
}


/**
 * 組織コード 範囲指定
 */
class OrganizationRangeCondition extends RangeCondition {
  // タブ毎に組織コードKEYを変更する
  static readonly KEY = 'slipOrganizationCode';

  constructor(def?: BlSearchConditionDef) {
    if (def) {
      super(def);
    } else {
      super({ key: OrganizationRangeCondition.KEY });
    }
  }

  /**
   * 設定
   * @param s 開始
   * @param e 終了
   */
  public setDate(s: string, e: string): void {
    this.dateS.setValue(_isEmpty(s) ? undefined : s);
    this.dateE.setValue(_isEmpty(e) ? undefined : e);
  }
}

/**
 * 得意先コード
 */
class CustomerCodeCondition extends RangeCondition {
  static readonly KEY = 'customerCode';

  constructor(def?: BlSearchConditionDef) {
    if (def) {
      super(def);
    } else {
      super({ key: CustomerCodeCondition.KEY });
    }
  }

  /**
   * 得意先コード
   * @param s 開始
   * @param e 終了
   */
  public setDate(s: string, e: string): void {
    this.dateS.setValue(_isEmpty(s) ? undefined : s);
    this.dateE.setValue(_isEmpty(e) ? undefined : e);
  }
}

/**
 * 担当者コード
 */
class PicEmployeeCodeCondition extends RangeCondition {
  static readonly KEY = 'picEmployeeCode';

  constructor(def?: BlSearchConditionDef) {
    if (def) {
      super(def);
    } else {
      super({ key: PicEmployeeCodeCondition.KEY });
    }
  }

  /**
   * 担当者コード
   * @param s 開始
   * @param e 終了
   */
  public setDate(s: string, e: string): void {
    this.dateS.setValue((_isEmpty(s) || DateTimeUtils.initial.iso8601.date === s) ? undefined : s);
    this.dateE.setValue((_isEmpty(e) || DateTimeUtils.initial.iso8601.date === e) ? undefined : e);
  }
}

/**
 * 地区コード
 */
class AreaCdCondition extends RangeCondition {
  static readonly KEY = 'areaCd';

  constructor(def?: BlSearchConditionDef) {
    if (def) {
      super(def);
    } else {
      super({ key: AreaCdCondition.KEY });
    }
  }

  /**
   * 地区コード
   * @param s 地区コード開始
   * @param e 地区コード終了
   */
  public setDate(s: number, e: number): void {
    this.dateS.setValue(_isEmpty(s) ? undefined : s);
    this.dateE.setValue(_isEmpty(e) ? undefined : e);
  }
}

/**
 * 業種コード
 */
class DispBusinessCodeCondition extends RangeCondition {
  static readonly KEY = 'dispBusinessCode';

  constructor(def?: BlSearchConditionDef) {
    if (def) {
      super(def);
    } else {
      super({ key: DispBusinessCodeCondition.KEY });
    }
  }

  /**
   * 業種コード
   * @param s 業種コード開始
   * @param e 業種コード終了
   */
  public setDate(s: number, e: number): void {
    this.dateS.setValue(_isEmpty(s) ? undefined : s);
    this.dateE.setValue(_isEmpty(e) ? undefined : e);
  }
}

/**
 * ヘッダ行
 */
class OutPutHeaderDivCondition extends ExportGlassSalesSlipCondition {
  static readonly KEY = 'outPutHeaderDiv';
}


/**
 * 硝子分類区分種別
 */
class GlassClassDivCondition extends ExportGlassSalesSlipCondition {
  static readonly KEY = 'glassClassDiv';
}

/**
 * 順序
 */
class OutPutOrderDivCondition extends ExportGlassSalesSlipCondition {
  static readonly KEY = 'outPutOrderDiv';
}

/**
 * 締日
 */
class CutoffDayCondition extends ExportGlassSalesSlipCondition {
  static readonly KEY = 'cutoffDay';
}

/**
 * クライアントセッションID
 */
class ClientSessionIdCondition extends ExportGlassSalesSlipCondition {
  static readonly KEY = 'clientSessionId';
}

/**
 * 硝子売上伝票情報出力条件を管理
 */
export class ExportGlassSalesSlipConditionManager extends BlSearchConditionManager {
  /** 対象期間 */
  private targetPeriod = SalesSlipSupplierSelect.SlipDate;

  constructor() {
    super([
      { type: BlConditionType.In, key: ExportPatternCodeListCondition.KEY, classType: ExportPatternCodeListCondition },
      { type: BlConditionType.In, key: SalesSlipDivListCondition.KEY, classType: SalesSlipDivListCondition },
      { key: ChangeDateCondition.SLIP_KEY, classType: ChangeDateCondition },
      { key: ChangeDateCondition.UPDATE_KEY, classType: ChangeDateCondition },
      { key: ChangeDateCondition.BILLING_KEY, classType: ChangeDateCondition },
      { type: BlConditionType.In, key: OrganizationListCondition.KEY, classType: OrganizationListCondition },
      { key: OrganizationRangeCondition.KEY, classType: OrganizationRangeCondition },
      { key: CustomerCodeCondition.KEY, classType: CustomerCodeCondition },
      { key: PicEmployeeCodeCondition.KEY, classType: PicEmployeeCodeCondition },
      { key: AreaCdCondition.KEY, classType: AreaCdCondition },
      { key: DispBusinessCodeCondition.KEY, classType: DispBusinessCodeCondition },
      { type: BlConditionType.Equal, key: OutPutHeaderDivCondition.KEY, classType: OutPutHeaderDivCondition },
      { key: CutoffDayCondition.KEY, classType: CutoffDayCondition },
      { key: GlassClassDivCondition.KEY, classType: GlassClassDivCondition },
      { key: OutPutOrderDivCondition.KEY, classType: OutPutOrderDivCondition },
      { key: ProductCodeCondition.KEY, classType: ProductCodeCondition },
      { type: BlConditionType.Equal, key: ClientSessionIdCondition.KEY, classType: ClientSessionIdCondition },
    ]);
  }

  /**
   * 対象期間を設定する
   * @param targetPeriod 対象期間
   */
  public setTargetPeriod(targetPeriod: string): void {
    this.targetPeriod = targetPeriod;
  }

  /**
   * 対象期間を取得する
   * @return 対象期間
   */
  public getTargetPeriod(): string {
    return this.targetPeriod;
  }

  /**
   * 検索条件を初期化する
   */
  public clear(): void {
    this.conditionMap.forEach(condition => {
      condition.clear();
    });
  }

  /**
   * クエリ生成
   * @return BlApiQueryParams
   */
  public makeQueryParameter(): BlApiQueryParams {
    const apiQueryParameter = new BlApiQueryParams();
    const grp: BlSearchConditionGroup = this.and(
      ExportPatternCodeListCondition.KEY,
      SalesSlipDivListCondition.KEY,
      ChangeDateCondition.SLIP_KEY,
      ChangeDateCondition.UPDATE_KEY,
      ChangeDateCondition.BILLING_KEY,
      OrganizationListCondition.KEY,
      OrganizationRangeCondition.KEY,
      CustomerCodeCondition.KEY,
      PicEmployeeCodeCondition.KEY,
      DispBusinessCodeCondition.KEY,
      AreaCdCondition.KEY,
      OutPutHeaderDivCondition.KEY,
      CutoffDayCondition.KEY,
      GlassClassDivCondition.KEY,
      OutPutOrderDivCondition.KEY,
      ProductCodeCondition.KEY,
      ClientSessionIdCondition.KEY,
    );
    const slipDate = <ChangeDateCondition>(this.conditionMap.get(ChangeDateCondition.SLIP_KEY));
    const updateDate = <ChangeDateCondition>(this.conditionMap.get(ChangeDateCondition.UPDATE_KEY));
    const billingDate = <ChangeDateCondition>(this.conditionMap.get(ChangeDateCondition.BILLING_KEY));
    // 伝票日付
    if (slipDate.getValueS()) {
      grp.addCondition(slipDate.getConditionS());
    }
    if (slipDate.getValueE()) {
      grp.addCondition(slipDate.getConditionE());
    }

    // 更新日付
    if (updateDate.getValueS()) {
      grp.addCondition(updateDate.getConditionS());
    }
    if (updateDate.getValueE()) {
      grp.addCondition(updateDate.getConditionE());
    }

    // 請求締日
    if (billingDate.getValueS()) {
      grp.addCondition(billingDate.getConditionS());
    }
    if (billingDate.getValueE()) {
      grp.addCondition(billingDate.getConditionE());
    }

    // 組織範囲
    const organizationRange = <OrganizationRangeCondition>(this.conditionMap.get(OrganizationRangeCondition.KEY));
    if (organizationRange.getValueS()) {
      grp.addCondition(organizationRange.getConditionS());
    }
    if (organizationRange.getValueE()) {
      grp.addCondition(organizationRange.getConditionE());
    }

    const customerCode = <CustomerCodeCondition>(this.conditionMap.get(CustomerCodeCondition.KEY));
    if (customerCode.getValueS()) {
      grp.addCondition(customerCode.getConditionS());
    }
    if (customerCode.getValueE()) {
      grp.addCondition(customerCode.getConditionE());
    }

    const picEmployeeCode = <PicEmployeeCodeCondition>(this.conditionMap.get(PicEmployeeCodeCondition.KEY));
    if (picEmployeeCode.getValueS()) {
      grp.addCondition(picEmployeeCode.getConditionS());
    }
    if (picEmployeeCode.getValueE()) {
      grp.addCondition(picEmployeeCode.getConditionE());
    }

    const dispBusinessCode = <DispBusinessCodeCondition>(this.conditionMap.get(DispBusinessCodeCondition.KEY));
    if (dispBusinessCode.getValueS()) {
      grp.addCondition(dispBusinessCode.getConditionS());
    }
    if (dispBusinessCode.getValueE()) {
      grp.addCondition(dispBusinessCode.getConditionE());
    }

    const areaCd = <AreaCdCondition>(this.conditionMap.get(AreaCdCondition.KEY));
    if (areaCd.getValueS()) {
      grp.addCondition(areaCd.getConditionS());
    }
    if (areaCd.getValueE()) {
      grp.addCondition(areaCd.getConditionE());
    }

    const kanas: BlSearchConditionGroup[] = new Array<BlSearchConditionGroup>();
    kanas.push(grp);
    // グループ指定しながら文字列を作成する
    apiQueryParameter.setConditionString(kanas[0].toConditionString());
    this.clear();
    return apiQueryParameter;
  }

  /**
   * テキスト出力情報の一覧を取得
   * @param exportPatternCodeList テキスト出力情報配列
   */
  public setExportPatternCodeList(exportPatternCodeList: string[]): void {
    (<ExportPatternCodeListCondition>(this.conditionMap.get(ExportPatternCodeListCondition.KEY))).setValue(exportPatternCodeList);
  }

  /**
   * 硝子商売上伝票区分を設定
   * @param salesSlipDivList 硝子商売上伝票区分
   */
  public setSalesSlipDivList(salesSlipDivList: string[]): void {
    (<SalesSlipDivListCondition>(this.conditionMap.get(SalesSlipDivListCondition.KEY)))
      .setValue(salesSlipDivList);
  }

  /**
   * 日付を設定
   * @param dateStart 開始日
   * @param dateEnd 終了日
   * @param targetPeriod 対象期間
   */
  public setDate(dateStart: string, dateEnd: string, targetPeriod: string): void {
    if (targetPeriod === SalesSlipSupplierSelect.SlipDate) {
      (<ChangeDateCondition>(this.conditionMap.get(ChangeDateCondition.SLIP_KEY))).setDate(dateStart, dateEnd);
    } else if (targetPeriod === SalesSlipSupplierSelect.UpdateDate) {
      (<ChangeDateCondition>(this.conditionMap.get(ChangeDateCondition.UPDATE_KEY))).setDate(dateStart, dateEnd);
    } else {
      (<ChangeDateCondition>(this.conditionMap.get(ChangeDateCondition.BILLING_KEY))).setDate(dateStart, dateEnd);
    }
  }

  /**
   * 得意先コードの設定
   * @param customerCodeStart 得意先コード開始
   * @param customerCodeEnd 得意先コード終了
   */
  public setCustomerCode(customerCodeStart: string, customerCodeEnd: string): void {
    (<CustomerCodeCondition>(this.conditionMap.get(CustomerCodeCondition.KEY))).setDate(customerCodeStart, customerCodeEnd);
  }

  /**
   * 担当者コードの設定
   * @param employeeCodeStart 担当者コード開始
   * @param employeeCodeEnd 担当者コード終了
   */
  public setPicEmployeeCode(employeeCodeStart: string, employeeCodeEnd: string): void {
    (<PicEmployeeCodeCondition>(this.conditionMap.get(PicEmployeeCodeCondition.KEY))).setDate(employeeCodeStart, employeeCodeEnd);
  }

  /**
   * 業種コードの設定
   * @param dispBusinessCodeS 業種コード開始
   * @param dispBusinessCodeE 業種コード終了
   */
  public setDispBusinessCode(dispBusinessCodeS: number, dispBusinessCodeE: number): void {
    (<DispBusinessCodeCondition>(this.conditionMap.get(DispBusinessCodeCondition.KEY))).setDate(dispBusinessCodeS, dispBusinessCodeE);
  }

  /**
   * 地区コードの設定
   * @param areaCodeStart 地区コード開始
   * @param areaCodeEnd 地区コード終了
   */
  public setAreaCd(areaCodeStart: number, areaCodeEnd: number): void {
    (<AreaCdCondition>(this.conditionMap.get(AreaCdCondition.KEY))).setDate(areaCodeStart, areaCodeEnd);
  }

  /**
   * ヘッダ行の設定
   * @param outPutHeaderDiv ヘッダ行
   */
  public setOutPutHeaderDiv(outPutHeaderDiv: string): void {
    (<OutPutHeaderDivCondition>(this.conditionMap.get(OutPutHeaderDivCondition.KEY))).setValue(outPutHeaderDiv);
  }

  /**
   * 部品作業区分の設定
   * @param glassClassDiv 部品作業区分
   */
  public setGlassClassDiv(glassClassDiv: string): void {
    (<GlassClassDivCondition>(this.conditionMap.get(GlassClassDivCondition.KEY))).setValue(glassClassDiv);
  }

  /**
   * 順序の設定
   * @param outPutOrderDiv 順序
   */
  public setOutPutOrderDiv(outPutOrderDiv: string): void {
    (<OutPutOrderDivCondition>(this.conditionMap.get(OutPutOrderDivCondition.KEY))).setValue(outPutOrderDiv);
  }

  /**
   * 締日
   * @param cutoffDay 締日
   */
  public setCutoffDay(cutoffDay: string): void {
    (<CutoffDayCondition>(this.conditionMap.get(CutoffDayCondition.KEY))).setValue(cutoffDay);
  }

  /**
   * ユニークIdを設定
   * @param clientSessionId ユニークId
   */
  public setClientSessionId(clientSessionId: string): void {
    (<ClientSessionIdCondition>(this.conditionMap.get(ClientSessionIdCondition.KEY))).setValue(clientSessionId);
  }

  /**
   * プロダクトコード配列を設定する
   * @param productCodes プロダクトコード配列
   */
  public setProductCodes(productCodes: string): void {
    (<ProductCodeCondition>(this.conditionMap.get(ProductCodeCondition.KEY))).setValue(productCodes);
  }

  /**
   * 組織の範囲設定
   * @param organizationStart 組織開始
   * @param organizationEnd 組織終了
   */
  public setOrganizationRange(organizationStart: string, organizationEnd: string): void {
    (<OrganizationRangeCondition>(this.conditionMap.get(OrganizationRangeCondition.KEY))).setDate(organizationStart, organizationEnd);
  }

  /**
   * 組織の個別、全組織設定
   * @param allOrganization 組織個別リスト
   */
  public setOrganizationList(allOrganization: string[]): void {
    (<OrganizationListCondition>(this.conditionMap.get(OrganizationListCondition.KEY))).setValue(allOrganization);
  }

}
