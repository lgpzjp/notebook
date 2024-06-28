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
import { CompanyConst } from '@blcloud/bl-datamodel/const/company';

class ExportSlipCondition extends BlSearchCondition {
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

  public setType(type: BlConditionType): void {
    if (_isUndefined(type)) {
      super.clear();
    } else {
      super.setType(type);
    }
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
 * 更新日付のパラメータを管理
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
  public setDate(s: string, e: string): void {
    this.dateS.setValue((_isEmpty(s) || DateTimeUtils.initial.iso8601.date === s) ? undefined : s + 'T00:00:00');
    this.dateE.setValue((_isEmpty(e) || DateTimeUtils.initial.iso8601.date === e) ? undefined : e + 'T23:59:59');
  }
}

/**
 * テキスト出力パターンのコード一覧のパラメータを管理
 */
class ExportPatternCodeCondition extends ExportSlipCondition {
  static readonly KEY = 'exportPatternCodeList';
}


/**
 * プロダクトコードを管理
 */
class ProductCodeCondition extends ExportSlipCondition {
  static readonly KEY = 'productCode';
}

/**
 * 出力内容を管理
 */
class ExportTargetSlipKindListCondition extends ExportSlipCondition {
  static readonly KEY = 'exportTargetSlipKindList';
}

/**
 * salseRecordedResultsOrganizationCode を管理
 */
class SalseRecordedResultsOrganizationCodeCondition extends ExportSlipCondition {
  static readonly KEY = 'salseRecordedResultsOrganizationCode';
}

/**
 * salseRecordedBillingsOrganizationCode を管理
 */
class SalseRecordedBillingsOrganizationCodeCondition extends ExportSlipCondition {
  static readonly KEY = 'salseRecordedBillingsOrganizationCode';
}

/**
 * 顧客・車両情報出力を管理
 */
class CustomerVehicleExportDivCondition extends ExportSlipCondition {
  static readonly KEY = 'customerVehicleExportDiv';
}

/**
 * clientSessionIdを管理
 */
class ClientSessionIdCondition extends ExportSlipCondition {
  static readonly KEY = 'clientSessionId';
}

/**
 * 伝票情報出力条件を管理
 */
export class ExportSlipConditionManager extends BlSearchConditionManager {
  private documentMode = true;
  constructor(
  ) {
    super([
      { type: BlConditionType.In, key: ExportPatternCodeCondition.KEY, classType: ExportPatternCodeCondition },
      { type: BlConditionType.In, key: ProductCodeCondition.KEY, classType: ProductCodeCondition },
      { type: BlConditionType.In, key: ExportTargetSlipKindListCondition.KEY, classType: ExportTargetSlipKindListCondition },
      { key: SlipStandardDateCondition.KEY, classType: SlipStandardDateCondition },
      { key: UpdateDateTimeCondition.KEY, classType: UpdateDateTimeCondition },
      {
        type: BlConditionType.Equal, key: SalseRecordedResultsOrganizationCodeCondition.KEY,
        classType: SalseRecordedResultsOrganizationCodeCondition
      },
      { type: BlConditionType.Equal, key: CustomerVehicleExportDivCondition.KEY, classType: CustomerVehicleExportDivCondition },
      { type: BlConditionType.Equal, key: ClientSessionIdCondition.KEY, classType: ClientSessionIdCondition },
      {
        type: BlConditionType.Equal, key: SalseRecordedBillingsOrganizationCodeCondition.KEY,
        classType: SalseRecordedBillingsOrganizationCodeCondition
      },
    ]);
  }

  /**
   * 下書きモードを設定する
   * @param v 下書きモード
   */
  public setDocumentMode(v: boolean): void {
    this.documentMode = v;
  }

  /**
   * 下書きモードを取得する
   * @return 下書きモード
   */
  public getDocumentMode(): boolean {
    return this.documentMode;
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
      ExportPatternCodeCondition.KEY,
      ProductCodeCondition.KEY,
      ExportTargetSlipKindListCondition.KEY,
      CustomerVehicleExportDivCondition.KEY,
      SalseRecordedResultsOrganizationCodeCondition.KEY,
      SalseRecordedBillingsOrganizationCodeCondition.KEY,
    );
    const date = this.getDocumentMode()
      ? <SlipStandardDateCondition>(this.conditionMap.get(SlipStandardDateCondition.KEY))
      : <UpdateDateTimeCondition>(this.conditionMap.get(UpdateDateTimeCondition.KEY));
    if (date.getValueS()) {
      grp.addCondition(date.getConditionS());
    }
    if (date.getValueE()) {
      grp.addCondition(date.getConditionE());
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
   * プロダクトコード配列を設定する
   * @param productCodes プロダクトコード配列
   */
  public setProductCodes(productCodes: string[]): void {
    (<ProductCodeCondition>(this.conditionMap.get(ProductCodeCondition.KEY))).setValue(productCodes);
  }

  /**
   * 出力内容を設定
   * @param v
   */
  public setSlipKind(v: string[]): void {
    (<ExportTargetSlipKindListCondition>(this.conditionMap.get(ExportTargetSlipKindListCondition.KEY))).setValue(v);
  }

  /**
   * 管理組織を設定
   * @param v
   */
  public setSalseRecordedResultsOrganizationCode(v: string): void {
    if (CompanyConst.ORGANIZATION_CODE_ALL_COMPANY !== v) {
      (<SalseRecordedResultsOrganizationCodeCondition>
        (this.conditionMap.get(SalseRecordedResultsOrganizationCodeCondition.KEY))).setValue(v);
    } else {
      (<SalseRecordedResultsOrganizationCodeCondition>
        (this.conditionMap.get(SalseRecordedResultsOrganizationCodeCondition.KEY))).setValue('');
    }
  }

  /**
   * 管理組織を設定
   * @param v
   */
  public setSalseRecordedBillingsOrganizationCode(v: string): void {
    if (CompanyConst.ORGANIZATION_CODE_ALL_COMPANY !== v) {
      (<SalseRecordedBillingsOrganizationCodeCondition>(this.conditionMap.get(
        SalseRecordedBillingsOrganizationCodeCondition.KEY))).setValue(v);
    } else {
      (<SalseRecordedBillingsOrganizationCodeCondition>(this.conditionMap.get(
        SalseRecordedBillingsOrganizationCodeCondition.KEY))).setValue('');
    }
  }

  /**
   * 顧客・車両情報の出力を設定
   * @param n
   */
  public setExportCustomerVehicle(n: number): void {
    (<CustomerVehicleExportDivCondition>(this.conditionMap.get(CustomerVehicleExportDivCondition.KEY))).setValue(n);
  }

  /**
   * 日付を設定
   * @param s 開始日
   * @param e 終了日
   * @param documentMode 伝票日付あるいは更新日付を設定する条件
   */
  public setDate(s: string, e: string, documentMode?: boolean): void {
    if (documentMode) {
      (<SlipStandardDateCondition>(this.conditionMap.get(SlipStandardDateCondition.KEY))).setDate(s, e);
    } else {
      (<UpdateDateTimeCondition>(this.conditionMap.get(UpdateDateTimeCondition.KEY))).setDate(s, e);
    }
  }

  /**
   * ユニークIdを設定
   * @param a
   */
  public setClientSessionId(a: string): void {
    (<ClientSessionIdCondition>(this.conditionMap.get(ClientSessionIdCondition.KEY))).setValue(a);
  }
}
