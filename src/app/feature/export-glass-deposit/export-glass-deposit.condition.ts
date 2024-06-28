
import {
  BlSearchCondition,
  BlConditionType,
  BlSearchConditionManager,
  BlApiQueryParams,
  BlSearchConditionGroup,
  BlSearchConditionDef,
} from '@blcloud/bl-ng-common';
import { DateTimeUtils } from '@blcloud/bl-common';
import {
  SalesSlipSupplierSelect
} from '@blcloud/bl-datamodel/enum/sales/sales-slip-supplier-select';
import {
  isUndefined as _isUndefined,
  isEmpty as _isEmpty,
} from 'lodash';

/** 硝子入金情報出力条件 */
class ExportGlassDepositCondition extends BlSearchCondition {
  /** @override */
  public setValue(value: any): void {
    if (_isUndefined(value)) {
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
  abstract setDate(s: string, e: string): void;
}

/**
 * プロダクトコード
 */
class ProductCodeCondition extends ExportGlassDepositCondition {
  static readonly KEY = 'productCode';
}

/**
 * テキスト出力パターンコード配列
 */
class ExportPatternCodeListCondition extends ExportGlassDepositCondition {
  static readonly KEY = 'exportPatternCodeList';
}

/**
 *  請求計上日
 */
class BillingRecordingDateCondition extends RangeCondition {
  static readonly KEY = 'billingRecordingDate';

  constructor(def?: BlSearchConditionDef) {
    if (def) {
      super(def);
    } else {
      super({ key: BillingRecordingDateCondition.KEY });
    }
  }

  /**
   * 日付設定
   * @param dateStart 開始日
   * @param dateEnd 終了日
   */
  public setDate(dateStart: string, dateEnd: string): void {
    this.dateS.setValue((_isEmpty(dateStart) || DateTimeUtils.initial.iso8601.date === dateStart) ? undefined : dateStart);
    this.dateE.setValue((_isEmpty(dateEnd) || DateTimeUtils.initial.iso8601.date === dateEnd) ? undefined : dateEnd);
  }
}

/**
 * 締日
 */
class CutoffDayCondition extends ExportGlassDepositCondition {
  static readonly KEY = 'cutoffDay';
}

/**
 * 組織コード 個別、全組織指定
 */
class OrganizationListCondition extends ExportGlassDepositCondition {
  static readonly KEY = 'depositSlipMgtOrgCodeList';
}

/**
 * 組織コード 範囲指定
 */
class OrganizationRangeCondition extends RangeCondition {
  // タブ毎に組織コードKEYを変更する
  static readonly KEY = 'depositSlipMgtOrgCode';

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
 * ヘッダ行
 */
class OutPutHeaderDivCondition extends ExportGlassDepositCondition {
  static readonly KEY = 'outPutHeaderDiv';
}

/**
 * 順序
 */
class OutPutOrderDivCondition extends ExportGlassDepositCondition {
  static readonly KEY = 'outPutOrderDiv';
}

/**
 * クライアントセッションID
 */
class ClientSessionIdCondition extends ExportGlassDepositCondition {
  static readonly KEY = 'clientSessionId';
}

/**
 * 硝子入金情報出力条件を管理
 */
export class ExportGlassDepositConditionManager extends BlSearchConditionManager {
  /** 対象期間 */
  private targetPeriod = SalesSlipSupplierSelect.SlipDate;

  constructor() {
    super([
      { type: BlConditionType.In, key: ExportPatternCodeListCondition.KEY, classType: ExportPatternCodeListCondition },
      { key: BillingRecordingDateCondition.KEY, classType: BillingRecordingDateCondition },
      { type: BlConditionType.Equal, key: CutoffDayCondition.KEY, classType: CutoffDayCondition },
      { type: BlConditionType.In, key: OrganizationListCondition.KEY, classType: OrganizationListCondition },
      { key: OrganizationRangeCondition.KEY, classType: OrganizationRangeCondition },
      { type: BlConditionType.Equal, key: OutPutHeaderDivCondition.KEY, classType: OutPutHeaderDivCondition },
      { type: BlConditionType.Equal, key: OutPutOrderDivCondition.KEY, classType: OutPutOrderDivCondition },
      { type: BlConditionType.Equal, key: ProductCodeCondition.KEY, classType: ProductCodeCondition },
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
      BillingRecordingDateCondition.KEY,
      CutoffDayCondition.KEY,
      OrganizationListCondition.KEY,
      OrganizationRangeCondition.KEY,
      OutPutHeaderDivCondition.KEY,
      OutPutOrderDivCondition.KEY,
      ProductCodeCondition.KEY,
      ClientSessionIdCondition.KEY,
    );
    const date = <BillingRecordingDateCondition>(this.conditionMap.get(BillingRecordingDateCondition.KEY));
    if (date.getValueS()) {
      grp.addCondition(date.getConditionS());
    }
    if (date.getValueE()) {
      grp.addCondition(date.getConditionE());
    }

    // 組織範囲
    const organizationRange = <OrganizationRangeCondition>(this.conditionMap.get(OrganizationRangeCondition.KEY));
    if (organizationRange.getValueS()) {
      grp.addCondition(organizationRange.getConditionS());
    }
    if (organizationRange.getValueE()) {
      grp.addCondition(organizationRange.getConditionE());
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
   * 日付を設定
   * @param dateStart 開始日
   * @param dateEnd 終了日
   */
  public setDate(dateStart: string, dateEnd?: string): void {
    // 請求計上日
    (<BillingRecordingDateCondition>(this.conditionMap.get(BillingRecordingDateCondition.KEY))).setDate(dateStart, dateEnd);
  }

  /**
   * 締日
   * @param cutoffDay 締日
   */
  public setCutoffDay(cutoffDay: number): void {
    (<CutoffDayCondition>(this.conditionMap.get(CutoffDayCondition.KEY))).setValue(cutoffDay);
  }

  /**
   * ヘッダ行の設定
   * @param outPutHeaderDiv ヘッダ行
   */
  public setOutPutHeaderDiv(outPutHeaderDiv: string): void {
    (<OutPutHeaderDivCondition>(this.conditionMap.get(OutPutHeaderDivCondition.KEY))).setValue(outPutHeaderDiv)
  }

  /**
   * 順序の設定
   * @param outPutOrderDiv 順序
   */
  public setOutPutOrderDiv(outPutOrderDiv: string): void {
    (<OutPutOrderDivCondition>(this.conditionMap.get(OutPutOrderDivCondition.KEY))).setValue(outPutOrderDiv)
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
