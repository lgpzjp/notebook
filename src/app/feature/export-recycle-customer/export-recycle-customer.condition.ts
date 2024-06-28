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

/**
 * リサイクル取引先出力条件
 */
class ExportRecycleCustomerCondition extends BlSearchCondition {
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
 * テキスト出力パターンのコード一覧のパラメータを管理
 */
class ExportPatternCodeCondition extends ExportRecycleCustomerCondition {
  static readonly KEY = 'exportPatternCodeList';
}

/**
 * プロダクトコード
 */
class ProductCodeCondition extends ExportRecycleCustomerCondition {
  static readonly KEY = 'productCode';
}

/**
 * 出力内容を管理
 */
class CustomerExportContentCondition extends ExportRecycleCustomerCondition {
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
class OrganizationCodeCondition extends ExportRecycleCustomerCondition {
  static readonly KEY = 'organizationCode';
}

/**
 * clientSessionIdを管理
 */
class ClientSessionIdCondition extends ExportRecycleCustomerCondition {
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
 * 出力条件を管理
 */
export class ExportRecycleCustomerConditionManager extends BlSearchConditionManager {
  constructor(
  ) {
    super([
      { type: BlConditionType.In, key: ProductCodeCondition.KEY, classType: ProductCodeCondition },
      { type: BlConditionType.In, key: ExportPatternCodeCondition.KEY, classType: ExportPatternCodeCondition },
      { type: BlConditionType.Equal, key: CustomerExportContentCondition.KEY, classType: CustomerExportContentCondition },
      { key: UpdateDateTimeCondition.KEY, classType: UpdateDateTimeCondition },
      { type: BlConditionType.Equal, key: OrganizationCodeCondition.KEY, classType: OrganizationCodeCondition },
      { key: CustomerCodeCondition.KEY, classType: CustomerCodeCondition },
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
   * @param customerCodeStart 得意先コード開始
   * @param customerCodeEnd 得意先コード終了
   */
  public setCustomerCode(customerCodeStart: string, customerCodeEnd: string): void {
    (<CustomerCodeCondition>(this.conditionMap.get(CustomerCodeCondition.KEY))).setDate(customerCodeStart, customerCodeEnd);
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
