import {
  isUndefined as _isUndefined,
  isEmpty as _isEmpty,
} from 'lodash';
import {
  BlSearchCondition,
  BlConditionType,
  BlSearchConditionManager,
  BlApiQueryParams,
  BlSearchConditionGroup,
  BlSearchConditionDef,
} from '@blcloud/bl-ng-common';
import { DateTimeUtils } from '@blcloud/bl-common';
import { PurchaseSlipTargetPeriodDiv } from '@blcloud/bl-datamodel/enum/purchase/purchase-slip-target-period-div';

/**
 * 得意先伝票出力条件
 */
class ExportCustomerSlipCondition extends BlSearchCondition {
  /** @override */
  public setValue(v: any): void {
    if (_isUndefined(v)) {
      super.clear();
    } else {
      super.setValue(v);
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
 * 項目（eq）設定
 */
abstract class DateEqCondition extends BlSearchCondition {
  /** 項目（eq） */
  protected dateS: BlSearchCondition;

  constructor(def: BlSearchConditionDef) {
    super(def);
    this.dateS = new BlSearchCondition(def);
    this.dateS.setType(BlConditionType.Equal);
  }

  /**
   * 項目（eq）を取得する
   * @return 項目（eq）
   */
  public getValueS(): string | number | (string | number)[] {
    return this.dateS.getValue();
  }

  /**
   * 項目（eq）の検索条件を取得する
   * @return 項目（eq）コンディション
   */
  public getConditionS(): BlSearchCondition {
    return this.dateS;
  }

  /**
   * 検索条件を初期化する
   */
  public clear(): void {
    this.dateS.clear();
  }

  /**
   * 項目（eq）設定
   * @param s 項目（eq）
   */
  abstract setValue(s: string): void;
}

/**
 * 項目（le ge）設定
 */
abstract class DateCondition extends BlSearchCondition {
  /** 開始日 */
  protected dateS: BlSearchCondition;

  /** 終了日 */
  protected dateE: BlSearchCondition;

  constructor(def: BlSearchConditionDef) {
    super(def);

    this.dateS = new BlSearchCondition(def);
    this.dateE = new BlSearchCondition(def);

    this.dateS.setType(BlConditionType.GreaterThanEqual);
    this.dateE.setType(BlConditionType.LessThanEqual);
  }

  /**
   * 開始日を取得する
   * @return 開始日
   */
  public getValueS(): string | number | (string | number)[] {
    return this.dateS.getValue();
  }

  /**
   * 終了日を取得する
   * @return 終了日
   */
  public getValueE(): string | number | (string | number)[] {
    return this.dateE.getValue();
  }

  /**
   * 開始日の検索条件を取得する
   * @return 開始日コンディション
   */
  public getConditionS(): BlSearchCondition {
    return this.dateS;
  }

  /**
   * 終了日の検索条件を取得する
   * @return 終了日コンディション
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
 *  伝票日付のパラメータを管理
 */
class SlipStandardDateCondition extends DateCondition {
  static readonly KEY = 'slipStandardDate';

  constructor(def?: BlSearchConditionDef) {
    if (def) {
      super(def);
    } else {
      super({ key: SlipStandardDateCondition.KEY });
    }
  }

  /**
   * 日付設定
   * @param s 開始日
   * @param e 終了日
   */
  public setDate(s: string, e: string): void {
    this.dateS.setValue((_isEmpty(s) || DateTimeUtils.initial.iso8601.date === s) ? undefined : s);
    this.dateE.setValue((_isEmpty(e) || DateTimeUtils.initial.iso8601.date === e) ? undefined : e);
  }
}

/**
 * 請求締日のパラメータを管理
 */
class BillingRecordingDateCondition extends DateEqCondition {
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
   * @param s 開始日
   */
  public setValue(s: string): void {
    this.dateS.setValue((_isEmpty(s) || DateTimeUtils.initial.iso8601.date === s) ? undefined : s);
  }
}

/**
 * 支払締日のパラメータを管理
 */
class PayRecordingDateCondition extends DateEqCondition {
  static readonly KEY = 'payRecordingDate';

  constructor(def?: BlSearchConditionDef) {
    if (def) {
      super(def);
    } else {
      super({ key: PayRecordingDateCondition.KEY });
    }
  }

  /**
   * 日付設定
   * @param s 開始日
   */
  public setValue(s: string): void {
    this.dateS.setValue((_isEmpty(s) || DateTimeUtils.initial.iso8601.date === s) ? undefined : s);
  }
}

/**
 * テキスト出力パターンのコード一覧のパラメータを管理
 */
class ExportPatternCodeCondition extends ExportCustomerSlipCondition {
  static readonly KEY = 'exportPatternCodeList';
}

/**
 * プロダクトコード
 */
class ProductCodeCondition extends ExportCustomerSlipCondition {
  static readonly KEY = 'productCode';
}

/**
 * 出力内容を管理
 */
class CustomerExportContentCondition extends ExportCustomerSlipCondition {
  static readonly KEY = 'customerExportContent';
}

/**
 * 対象期間を管理
 */
class UpdateDateTimeCondition extends DateCondition {
  static readonly KEY = 'updateDateTime';

  constructor(def?: BlSearchConditionDef) {
    if (def) {
      super(def);
    } else {
      super({ key: UpdateDateTimeCondition.KEY });
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

  /**
   * 開始日を取得する
   * @return 開始日
   */
  public getValueS(): string | number | (string | number)[] {
    return this.dateS.getValue();
  }

  /**
   * 終了日を取得する
   * @return 終了日
   */
  public getValueE(): string | number | (string | number)[] {
    return this.dateE.getValue();
  }
}

/**
 * 管理組織を管理
 */
class OrganizationCodeCondition extends ExportCustomerSlipCondition {
  static readonly KEY = 'organizationCode';
}

/**
 * clientSessionIdを管理
 */
class ClientSessionIdCondition extends ExportCustomerSlipCondition {
  static readonly KEY = 'clientSessionId';
}

/**
 * 得意先コードを管理
 */
class CustomerCodeCondition extends DateCondition {
  static readonly KEY = 'customerCode';

  constructor(def?: BlSearchConditionDef) {
    if (def) {
      super(def);
    } else {
      super({ key: CustomerCodeCondition.KEY });
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
 * 仕入先コードを管理
 */
class SupplierCdCondition extends DateCondition {
  static readonly KEY = 'supplierCd';

  constructor(def?: BlSearchConditionDef) {
    if (def) {
      super(def);
    } else {
      super({ key: SupplierCdCondition.KEY });
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
 * 締日を管理
 */
class CutoffDayCondition extends DateEqCondition {
  static readonly KEY = 'cutoffDay';

  constructor(def?: BlSearchConditionDef) {
    if (def) {
      super(def);
    } else {
      super({ key: CutoffDayCondition.KEY });
    }
  }

  /**
   * 日付設定
   * @param s 開始日
   */
  public setValue(s: string): void {
    this.dateS.setValue(_isEmpty(s) ? undefined : s);
  }
}

/**
 * 取引有無(得意先)を管理
 */
class CustomerDealsDivCondition extends DateEqCondition {
  static readonly KEY = 'customerDealsDiv';

  constructor(def?: BlSearchConditionDef) {
    if (def) {
      super(def);
    } else {
      super({ key: CustomerDealsDivCondition.KEY });
    }
  }

  /**
   * 日付設定
   * @param s 開始日
   */
  public setValue(s: string): void {
    this.dateS.setValue(_isEmpty(s) ? undefined : s);
  }
}

/**
 * 取引有無(仕入先)を管理
 */
class SupplierDealsDivCondition extends DateEqCondition {
  static readonly KEY = 'supplierDealsDiv';

  constructor(def?: BlSearchConditionDef) {
    if (def) {
      super(def);
    } else {
      super({ key: SupplierDealsDivCondition.KEY });
    }
  }

  /**
   * 日付設定
   * @param s 開始日
   */
  public setValue(s: string): void {
    this.dateS.setValue(_isEmpty(s) ? undefined : s);
  }
}


/**
 * 伝票情報出力条件を管理
 */
export class ExportCustomerSlipConditionManager extends BlSearchConditionManager {
  constructor(
  ) {
    super([
      { type: BlConditionType.In, key: ProductCodeCondition.KEY, classType: ProductCodeCondition },
      { type: BlConditionType.In, key: ExportPatternCodeCondition.KEY, classType: ExportPatternCodeCondition },
      { type: BlConditionType.Equal, key: CustomerExportContentCondition.KEY, classType: CustomerExportContentCondition },
      { key: UpdateDateTimeCondition.KEY, classType: UpdateDateTimeCondition },
      { type: BlConditionType.Equal, key: OrganizationCodeCondition.KEY, classType: OrganizationCodeCondition },
      { key: CustomerCodeCondition.KEY, classType: CustomerCodeCondition },
      { key: SupplierCdCondition.KEY, classType: SupplierCdCondition },
      { type: BlConditionType.Equal, key: CutoffDayCondition.KEY, classType: CutoffDayCondition },
      { type: BlConditionType.Equal, key: CustomerDealsDivCondition.KEY, classType: CustomerDealsDivCondition },
      { type: BlConditionType.Equal, key: SupplierDealsDivCondition.KEY, classType: SupplierDealsDivCondition },
      { key: SlipStandardDateCondition.KEY, classType: SlipStandardDateCondition },
      { key: BillingRecordingDateCondition.KEY, classType: BillingRecordingDateCondition },
      { key: PayRecordingDateCondition.KEY, classType: PayRecordingDateCondition },
      { type: BlConditionType.Equal, key: ClientSessionIdCondition.KEY, classType: ClientSessionIdCondition },
    ]);
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
      ProductCodeCondition.KEY,
      ExportPatternCodeCondition.KEY,
      CustomerExportContentCondition.KEY,
      UpdateDateTimeCondition.KEY,
      OrganizationCodeCondition.KEY,
    );
    const customerCode = <CustomerCodeCondition>(this.conditionMap.get(CustomerCodeCondition.KEY));
    if (customerCode.getValueS()) {
      grp.addCondition(customerCode.getConditionS());
    }
    if (customerCode.getValueE()) {
      grp.addCondition(customerCode.getConditionE());
    }
    const supplierCd = <SupplierCdCondition>(this.conditionMap.get(SupplierCdCondition.KEY));
    if (supplierCd.getValueS()) {
      grp.addCondition(supplierCd.getConditionS());
    }
    if (supplierCd.getValueE()) {
      grp.addCondition(supplierCd.getConditionE());
    }
    const cutoffDay = <CutoffDayCondition>(this.conditionMap.get(CutoffDayCondition.KEY));
    if (cutoffDay.getValueS()) {
      grp.addCondition(cutoffDay.getConditionS());
    }
    const customerDealsDiv = <CustomerDealsDivCondition>(this.conditionMap.get(CustomerDealsDivCondition.KEY));
    if (customerDealsDiv.getValueS()) {
      grp.addCondition(customerDealsDiv.getConditionS());
    }
    const supplierDealsDiv = <SupplierDealsDivCondition>(this.conditionMap.get(SupplierDealsDivCondition.KEY));
    if (supplierDealsDiv.getValueS()) {
      grp.addCondition(supplierDealsDiv.getConditionS());
    }
    const slipStandardDate = <SlipStandardDateCondition>(this.conditionMap.get(SlipStandardDateCondition.KEY));
    if (slipStandardDate.getValueS()) {
      grp.addCondition(slipStandardDate.getConditionS());
    }
    if (slipStandardDate.getValueE()) {
      grp.addCondition(slipStandardDate.getConditionE());
    }
    const billingRecordingDate = <BillingRecordingDateCondition>(this.conditionMap.get(BillingRecordingDateCondition.KEY));
    if (billingRecordingDate.getValueS()) {
      grp.addCondition(billingRecordingDate.getConditionS());
    }
    const payRecordingDate = <PayRecordingDateCondition>(this.conditionMap.get(PayRecordingDateCondition.KEY));
    if (payRecordingDate.getValueS()) {
      grp.addCondition(payRecordingDate.getConditionS());
    }
    const updateDateTime = <UpdateDateTimeCondition>(this.conditionMap.get(UpdateDateTimeCondition.KEY));
    // 更新対象期間 Start
    if (updateDateTime.getValueS() && (updateDateTime.getValueS() !== '1900-01-01')) {
      grp.addCondition(updateDateTime.getConditionS());
    }
    // 更新対象期間 End
    if (updateDateTime.getValueE() && (updateDateTime.getValueE() !== '1900-01-01')) {
      grp.addCondition(updateDateTime.getConditionE());
    }
    grp.addCondition(this.conditionMap.get(ClientSessionIdCondition.KEY));
    const kanas: BlSearchConditionGroup[] = new Array<BlSearchConditionGroup>();
    kanas.push(grp);
    // グループ指定しながら文字列を作成する
    apiQueryParameter.setConditionString(kanas[0].toConditionString());
    return apiQueryParameter;
  }

  /**
   * テキスト出力情報の一覧を取得
   * @param v
   */
  public setExportPatternCode(v: string[]): void {
    (<ExportPatternCodeCondition>(this.conditionMap.get(ExportPatternCodeCondition.KEY))).setValue(v);
  }

/**
* 出力内容を設定
* @param outputInfo 出力内容
*/
  public setCustomerExportContent(outputInfo: string): void {
    (<CustomerExportContentCondition>(this.conditionMap.get(CustomerExportContentCondition.KEY))).setValue(outputInfo);
  }

  /**
   * 管理組織コードを設定
   * @param organizationCode
   */
  public setOrganizationCode(organizationCode: string): void {
    (<OrganizationCodeCondition>(this.conditionMap.get(OrganizationCodeCondition.KEY))).setValue(organizationCode);
  }

  /**
   * 得意先コードを設定
   * @param billingCodeStart 得意先コード開始
   * @param billingCodeEnd 得意先コード終了
   */
  public setCustomerCode(billingCodeStart: string, billingCodeEnd: string): void {
    (<CustomerCodeCondition>(this.conditionMap.get(CustomerCodeCondition.KEY))).setDate(billingCodeStart, billingCodeEnd);
  }

  /**
   * 仕入先コードを設定
   * @param supplierCdStart 仕入先コード開始
   * @param supplierCdEnd 仕入先コード終了
   */
  public setSupplierCd(s: string, e: string): void {
    (<SupplierCdCondition>(this.conditionMap.get(SupplierCdCondition.KEY))).setDate(s, e);
  }

  /**
   * 締日を設定
   * @param cutoffDay
   */
  public setCutoffDay(cutoffDay: string): void {
    (<CutoffDayCondition>(this.conditionMap.get(CutoffDayCondition.KEY))).setValue(cutoffDay);
  }

  /**
   * 取引有無(得意先)を設定
   * @param customerDealsDiv
   */
  public setCustomerDealsDiv(v: string): void {
    (<CustomerDealsDivCondition>(this.conditionMap.get(CustomerDealsDivCondition.KEY))).setValue(v);
  }

  /**
   * 取引有無(仕入先)を設定
   * @param supplierDealsDiv
   */
  public setSupplierDealsDiv(v: string): void {
    (<SupplierDealsDivCondition>(this.conditionMap.get(SupplierDealsDivCondition.KEY))).setValue(v);
  }

  /**
   * 日付の設定
   * @param startDate 開始日
   * @param endDate 終了日
   */
  public setUpdateDateTime(startDate: string, endDate: string): void {
    (<UpdateDateTimeCondition>(this.conditionMap.get(UpdateDateTimeCondition.KEY))).setDate(startDate, endDate);
  }

  /**
   * 日付の設定(詳細画面)
   * @param startDateDetail 開始日
   * @param endDateDetail 終了日
   * @param targetPeriod 対象期間
   * @param outputInfo 出力内容
   */
  public setDate(s: string, e: string, t: string, o: string): void {
    if (o === PurchaseSlipTargetPeriodDiv.SlipDate) {
      if (t === PurchaseSlipTargetPeriodDiv.PayCutoffDate) {
        (<SlipStandardDateCondition>(this.conditionMap.get(SlipStandardDateCondition.KEY))).setDate(s, e);
      } else if (t === PurchaseSlipTargetPeriodDiv.UpdateDate) {
        (<BillingRecordingDateCondition>(this.conditionMap.get(BillingRecordingDateCondition.KEY))).setValue(s);
      }
    } else if (o === PurchaseSlipTargetPeriodDiv.UpdateDate) {
      if (t === PurchaseSlipTargetPeriodDiv.PayCutoffDate) {
        (<SlipStandardDateCondition>(this.conditionMap.get(SlipStandardDateCondition.KEY))).setDate(s, e);
      } else if (t === PurchaseSlipTargetPeriodDiv.UpdateDate) {
        (<PayRecordingDateCondition>(this.conditionMap.get(PayRecordingDateCondition.KEY))).setValue(s);
      }
    }
  }

  /**
   * プロダクトコード配列を設定する
   * @param productCodes プロダクトコード配列
   */
  public setProductCodes(productCodes: string[]): void {
    (<ProductCodeCondition>(this.conditionMap.get(ProductCodeCondition.KEY))).setValue(productCodes);
  }

  /**
   * ユニークIdを設定
   * @param a
   */
  public setClientSessionId(a: string): void {
    (<ClientSessionIdCondition>(this.conditionMap.get(ClientSessionIdCondition.KEY))).setValue(a);
  }
}
