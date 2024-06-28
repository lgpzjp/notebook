import {
  isUndefined as _isUndefined,
  isEmpty as _isEmpty,
} from 'lodash';
import {
  BlApiQueryParams,
  BlSearchCondition,
  BlSearchConditionManager,
  BlConditionType,
  BlSearchConditionGroup,
  BlSearchConditionDef,
} from '@blcloud/bl-ng-common';
import { DateTimeUtils } from '@blcloud/bl-common';
import { CompanyConst } from '@blcloud/bl-datamodel/const/company';

class ExportCustomerVehicleCondition extends BlSearchCondition {
  /**
   * 検索条件の設定を行う
   * @param v 検索条件値
   */
  public setValue(v: any): void {
    if (_isUndefined(v)) {
      super.clear();
    } else {
      super.setValue(v);
    }
  }
}

/**
 * 出力パターン
 */
class ExportPatternCodeListCondition extends ExportCustomerVehicleCondition {
  static readonly KEY = 'exportPatternCodeList';
}

/**
 * プロダクトコード
 */
class ProductCodeCondition extends ExportCustomerVehicleCondition {
  static readonly KEY = 'productCode';
}

/**
 * 顧客コード
 */
abstract class CustomerCodeContion extends BlSearchCondition {
  protected codeS: BlSearchCondition;
  protected codeE: BlSearchCondition;
  constructor(def: BlSearchConditionDef) {
    super(def);
    this.codeS = new BlSearchCondition(def);
    this.codeE = new BlSearchCondition(def);

    this.codeS.setType(BlConditionType.GreaterThanEqual);
    this.codeE.setType(BlConditionType.LessThanEqual);
  }

  public getValueCodeS(): string | number | (string | number)[] {
    return this.codeS.getValue();
  }

  public getValueCodeE(): string | number | (string | number)[] {
    return this.codeE.getValue();
  }

  public getConditionS(): BlSearchCondition {
    return this.codeS;
  }

  public getConditionE(): BlSearchCondition {
    return this.codeE;
  }

  /**
   * 検索条件を初期化する
   */
  public clear(): void {
    this.codeS.clear();
    this.codeE.clear();
  }

  /**
   * 日付設定
   * @param s 開始日
   * @param e 終了日
   */
  abstract setCustomerCode(s: string, e: string): void;
}

/**
 * 顧客コード
 */
class CustomerInfoCustomerCodeCondition extends CustomerCodeContion {
  static readonly KEY = 'customerCode';

  constructor(def?: BlSearchConditionDef) {
    if (def) {
      super(def);
    } else {
      super({ key: CustomerInfoCustomerCodeCondition.KEY });
    }
  }

  /**
   * 日付設定
   * @param s 開始日
   * @param e 終了日
   */
  public setCustomerCode(s: string, e: string): void {
    this.codeS.setValue((_isEmpty(s)) ? undefined : s);
    this.codeE.setValue((_isEmpty(e)) ? undefined : e);
  }
}

/**
 * 顧客フリガナ
 */
abstract class CustomerNameKana1Contion extends BlSearchCondition {
  protected condition: BlSearchCondition;
  constructor(def: BlSearchConditionDef) {
    super(def);
    this.condition = new BlSearchCondition(def);

    this.condition.setType(BlConditionType.Match);
  }

  public getValue(): string | number | (string | number)[] {
    return this.condition.getValue();
  }

  public getCondition(): BlSearchCondition {
    return this.condition;
  }

  /**
   * 検索条件を初期化する
   */
  public clear(): void {
    this.condition.clear();
  }

  /**
   * 顧客フリガナ設定
   * @param value 顧客フリガナ
   */
  abstract setCustomerNameKana1(value: string): void;
}

/**
 * 顧客フリガナ
 */
class CustomerInfoCustomerNameKana1Condition extends CustomerNameKana1Contion {
  static readonly KEY = 'customerNameKana1';

  constructor(def?: BlSearchConditionDef) {
    if (def) {
      super(def);
    } else {
      super({ key: CustomerInfoCustomerNameKana1Condition.KEY });
    }
  }

  /**
   * 顧客フリガナ設定
   * @param value 顧客フリガナ
   */
  public setCustomerNameKana1(value: string): void {
    this.condition.setValue((_isEmpty(value)) ? undefined : value);
  }
}

/**
 * 日付
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
 * 確定伝票の日付
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
   * 日付設定
   * @param s 開始日
   * @param e 終了日
   */
  public setDate( s: string, e: string ): void {
    this.dateS.setValue((_isEmpty(s) || DateTimeUtils.initial.iso8601.date === s) ? undefined : s + 'T00:00:00');
    this.dateE.setValue((_isEmpty(e) || DateTimeUtils.initial.iso8601.date === e) ? undefined : e + 'T23:59:59');
  }
}

/**
 * 管理組織
 */
class CustomerManageOrganizationCodeCondition extends ExportCustomerVehicleCondition {
  static readonly KEY = 'customerManageOrganizationCode';
}

/**
 * 管理組織
 */
class VehicleMgtOrgCodeCondition extends ExportCustomerVehicleCondition {
  static readonly KEY = 'vehicleMgtOrgCode';
}

/**
 * clients session id
 */
class ClientSessionIdCondition extends ExportCustomerVehicleCondition {
  static readonly KEY = 'clientSessionId';
}

/**  他の条件項目設定  */
/**  検索条件  */
export class ExportCustomerVehicleConditionManager extends BlSearchConditionManager {
  private customerInfoMode = true;
  constructor(
  ) {
    super([
      { type: BlConditionType.In, key: ExportPatternCodeListCondition.KEY, classType: ExportPatternCodeListCondition },
      { type: BlConditionType.In, key: ProductCodeCondition.KEY, classType: ProductCodeCondition },
      { key: UpdateDateTimeCondition.KEY, classType: UpdateDateTimeCondition },
      { type: BlConditionType.Equal, key: CustomerManageOrganizationCodeCondition.KEY, classType: CustomerManageOrganizationCodeCondition },
      { type: BlConditionType.Equal, key: VehicleMgtOrgCodeCondition.KEY, classType: VehicleMgtOrgCodeCondition },
      { key: CustomerInfoCustomerCodeCondition.KEY, classType: CustomerInfoCustomerCodeCondition },
      { key: CustomerInfoCustomerNameKana1Condition.KEY, classType: CustomerInfoCustomerNameKana1Condition },
      { type: BlConditionType.Equal, key: ClientSessionIdCondition.KEY, classType: ClientSessionIdCondition },
    ]);
  }

  /**
   * set mode
   * @param v mode
   */
  public setCustomerInfoMode(v: boolean): void {
    this.customerInfoMode = v;
  }

  /**
   * 下書きモードを取得する
   * @return 下書きモード
   */
  public getCustomerInfoMode(): boolean {
    return this.customerInfoMode;
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
   * @param size 結果取得件数
   * @param position 結果取得位置
   * @return BlApiQueryParams
   */
  public makeQueryParameter(): BlApiQueryParams {
    const apiQueryParameter = new BlApiQueryParams();
    const grp: BlSearchConditionGroup = this.and(
      ProductCodeCondition.KEY,
      ExportPatternCodeListCondition.KEY,
      ClientSessionIdCondition.KEY
    );
    const date = <UpdateDateTimeCondition>(this.conditionMap.get(UpdateDateTimeCondition.KEY));
    if (this.getCustomerInfoMode()) {
      grp.addCondition(this.conditionMap.get(CustomerManageOrganizationCodeCondition.KEY));
      const code = <CustomerInfoCustomerCodeCondition>(this.conditionMap.get(CustomerInfoCustomerCodeCondition.KEY));
      if (code.getValueCodeS()) {
        grp.addCondition(code.getConditionS());
      }
      if (code.getValueCodeE()) {
        grp.addCondition(code.getConditionE());
      }
      const kana = <CustomerInfoCustomerNameKana1Condition>(this.conditionMap.get(CustomerInfoCustomerNameKana1Condition.KEY));
      if (kana.getValue()) {
        grp.addCondition(kana.getCondition());
      }
    } else {
      grp.addCondition(this.conditionMap.get(VehicleMgtOrgCodeCondition.KEY));
    }
    if (date.getValueS()) {
      grp.addCondition(date.getConditionS());
    }
    if (date.getValueE()) {
      grp.addCondition(date.getConditionE());
    }
    const kanas: BlSearchConditionGroup[] = new Array<BlSearchConditionGroup>();
    kanas.push(grp);
    // グループ指定しながら文字列を作成する
    apiQueryParameter.setConditionString(kanas[0].toConditionString());
    return apiQueryParameter;
  }

  /**
   * 顧客コードの設定
   * @param v 顧客コード
   */
  public setCustomerCode(s: string, e: string): void {
    (<CustomerInfoCustomerCodeCondition>(this.conditionMap.get(CustomerInfoCustomerCodeCondition.KEY))).setCustomerCode(s, e);
  }

  /**
   * 顧客フリガナの設定
   * @param value 顧客フリガナ
   */
  public setCustomerNameKana1(value: string): void {
    (<CustomerInfoCustomerNameKana1Condition>(this.conditionMap.get(
      CustomerInfoCustomerNameKana1Condition.KEY))).setCustomerNameKana1(value);
  }

  /**
   * 日付の設定
   * @param s 開始日
   * @param e 終了日
   * @param draft 下書き状態
   */
  public setUpdateDateTime(s: string, e: string): void {
    (<UpdateDateTimeCondition>(this.conditionMap.get(UpdateDateTimeCondition.KEY))).setDate(s, e);
  }

  /**
   * 管理組織
   * @param v 管理組織
   * @param customerInfoMode customerInfo Mode
   */
  public setOrganizationCode(v: string, customerInfoMode?: boolean): void {
    if (CompanyConst.ORGANIZATION_CODE_ALL_COMPANY !== v) {
      if (customerInfoMode) {
        (<CustomerManageOrganizationCodeCondition>(this.conditionMap.get(CustomerManageOrganizationCodeCondition.KEY))).setValue(v);
      } else {
        (<VehicleMgtOrgCodeCondition>(this.conditionMap.get(VehicleMgtOrgCodeCondition.KEY))).setValue(v);
      }
    } else {
      if (customerInfoMode) {
        (<CustomerManageOrganizationCodeCondition>(this.conditionMap.get(CustomerManageOrganizationCodeCondition.KEY))).setValue('');
      } else {
        (<VehicleMgtOrgCodeCondition>(this.conditionMap.get(VehicleMgtOrgCodeCondition.KEY))).setValue('');
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
   * テキスト出力情報の一覧を設定
   * @param a Array
   */
  public setExportPatternCodeList(a: string[]): void {
    (<ExportPatternCodeListCondition>(this.conditionMap.get(ExportPatternCodeListCondition.KEY))).setValue(a);
  }

  /**
   * set clientSessionId
   * @param a
   */
  public setClientSessionId(a: string): void {
    (<ClientSessionIdCondition>(this.conditionMap.get(ClientSessionIdCondition.KEY))).setValue(a);
  }
}
