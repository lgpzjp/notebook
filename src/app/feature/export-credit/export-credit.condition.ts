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

/**
 * 入金請求出力条件
 */
class ExportCreditCondition extends BlSearchCondition {
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
 * プロダクトコード
 */
class ProductCodeCondition extends ExportCreditCondition {
  static readonly KEY = 'productCode';
}

/**
 * 出力パターン
 */
class ExportPatternCodeListCondition extends ExportCreditCondition {
  static readonly KEY = 'exportPatternCodeList';
}

/**
 * 債権情報出力内容配列
 */
class CreditExportContentCondition extends ExportCreditCondition {
  static readonly KEY = 'creditExportContent';
}

/**
 * 請求年月
 */
abstract class BillingYearMonthContion extends BlSearchCondition {
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
   * 請求年月
   * @param billingYearMonthStart 請求年月開始
   * @param billingYearMonthEnd 請求年月終了
   */
  abstract setBillingYearMonth(billingYearMonthStart: string, billingYearMonthEnd: string): void;
}

/**
 * 請求年月
 */
class BillingYearMonthCondition extends BillingYearMonthContion {
  static readonly KEY = 'billingYearMonth';

  constructor(def?: BlSearchConditionDef) {
    if (def) {
      super(def);
    } else {
      super({ key: BillingYearMonthCondition.KEY });
    }
  }

  /**
   * 請求年月
   * @param billingYearMonthStart 開始
   * @param billingYearMonthEnd 終了
   */
  public setBillingYearMonth(billingYearMonthStart: string, billingYearMonthEnd: string): void {
    this.codeS.setValue((_isEmpty(billingYearMonthStart)) ? undefined : billingYearMonthStart);
    this.codeE.setValue((_isEmpty(billingYearMonthEnd)) ? undefined : billingYearMonthEnd);
  }
}

/**
 * 計上年月
 */
abstract class RecordingYearMonthContion extends BlSearchCondition {
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
   * 計上年月
   * @param recordingYearMonthStart 計上年月開始
   * @param recordingYearMonthEnd 計上年月終了
   */
  abstract setRecordingYearMonth(recordingYearMonthStart: string, recordingYearMonthEnd: string): void;
}

/**
 * 計上年月
 */
class RecordingYearMonthCondition extends RecordingYearMonthContion {
  static readonly KEY = 'recordingYearMonth';

  constructor(def?: BlSearchConditionDef) {
    if (def) {
      super(def);
    } else {
      super({ key: RecordingYearMonthCondition.KEY });
    }
  }

  /**
   * 計上年月
   * @param recordingYearMonthStart 計上年月開始
   * @param recordingYearMonthEnd 計上年月終了
   */
  public setRecordingYearMonth(recordingYearMonthStart: string, recordingYearMonthEnd: string): void {
    this.codeS.setValue((_isEmpty(recordingYearMonthStart)) ? undefined : recordingYearMonthStart);
    this.codeE.setValue((_isEmpty(recordingYearMonthEnd)) ? undefined : recordingYearMonthEnd);
  }
}

/**
 * 組織コード
 */
class OrganizationCodeCondition extends ExportCreditCondition {
  static readonly KEY = 'billingRecordedsOrganizationCode';
}

/**
 * 請求先コード
 */
abstract class BillingCodeContion extends BlSearchCondition {
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
   * 請求先コード設定
   * @param billingCodeStart 請求先コード開始
   * @param billingCodeEnd 請求先コード終了
   */
  abstract setBillingCode(billingCodeStart: string, billingCodeEnd: string): void;
}

/**
 * 請求先コード
 */
class BillingCodeCondition extends BillingCodeContion {
  static readonly KEY = 'billingCode';

  constructor(def?: BlSearchConditionDef) {
    if (def) {
      super(def);
    } else {
      super({ key: BillingCodeCondition.KEY });
    }
  }

  /**
   * 請求先コード設定
   * @param billingCodeStart 請求先コード開始
   * @param billingCodeEnd 請求先コード終了
   */
  public setBillingCode(billingCodeStart: string, billingCodeEnd: string): void {
    this.codeS.setValue((_isEmpty(billingCodeStart)) ? undefined : billingCodeStart);
    this.codeE.setValue((_isEmpty(billingCodeEnd)) ? undefined : billingCodeEnd);
  }
}

/**
 * 請求先カナ
 */
abstract class BillingNameKanaContion extends BlSearchCondition {
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
   * 請求先カナ
   * @param billingNameKanaStart 請求先カナ開始
   * @param billingNameKanaEnd 請求先カナ終了
   */
  abstract setBillingNameKana(billingNameKanaStart: string, billingNameKanaEnd: string): void;
}

/**
 * 請求先カナ
 */
class BillingNameKanaCondition extends BillingNameKanaContion {
  static readonly KEY = 'billingNameKana';

  constructor(def?: BlSearchConditionDef) {
    if (def) {
      super(def);
    } else {
      super({ key: BillingNameKanaCondition.KEY });
    }
  }

  /**
   * 請求先カナ
   * @param billingNameKanaStart 請求先カナ開始
   * @param billingNameKanaEnd 請求先カナ終了
   */
  public setBillingNameKana(billingNameKanaStart: string, billingNameKanaEnd: string): void {
    this.codeS.setValue((_isEmpty(billingNameKanaStart)) ? undefined : billingNameKanaStart);
    this.codeE.setValue((_isEmpty(billingNameKanaEnd)) ? undefined : billingNameKanaEnd);
  }
}

/**
 * 締日
 */
class CutoffDayCondition extends ExportCreditCondition {
  static readonly KEY = 'cutoffDay';
}

/**
 * clients session id
 */
class ClientSessionIdCondition extends ExportCreditCondition {
  static readonly KEY = 'clientSessionId';
}

/**  他の条件項目設定  */
/**  検索条件  */
export class ExportCreditConditionManager extends BlSearchConditionManager {
  private billingHistoryMode = true;
  constructor(
  ) {
    super([
      // QueryStrings ID = 1
      { type: BlConditionType.In, key: ExportPatternCodeListCondition.KEY, classType: ExportPatternCodeListCondition },
      // QueryStrings ID = 2
      { type: BlConditionType.In, key: CreditExportContentCondition.KEY, classType: CreditExportContentCondition },
      // QueryStrings ID = 3～4
      { key: BillingYearMonthCondition.KEY, classType: BillingYearMonthCondition },
      // QueryStrings ID = 5～6
      { key: RecordingYearMonthCondition.KEY, classType: RecordingYearMonthCondition },
      // QueryStrings ID = 7
      { type: BlConditionType.Equal, key: OrganizationCodeCondition.KEY, classType: OrganizationCodeCondition },
      // QueryStrings ID = 8～9
      { key: BillingCodeCondition.KEY, classType: BillingCodeCondition },
      // QueryStrings ID = 10～11
      { key: BillingNameKanaCondition.KEY, classType: BillingNameKanaCondition },
      // QueryStrings ID = 12
      { key: CutoffDayCondition.KEY, classType: CutoffDayCondition },
      // QueryStrings ID = 13
      { type: BlConditionType.In, key: ProductCodeCondition.KEY, classType: ProductCodeCondition },
      // QueryStrings ID = 14
      { type: BlConditionType.Equal, key: ClientSessionIdCondition.KEY, classType: ClientSessionIdCondition },
    ]);
  }

  /**
   * 債権情報出力内容
   * @param billingHistoryMode 債権情報出力内容
   */
  public setBillingHistoryMode(billingHistoryMode: boolean): void {
    this.billingHistoryMode = billingHistoryMode;
  }

  /**
   * 下書きモードを取得する
   * @return 下書きモード
   */
  public getBillingHistoryMode(): boolean {
    return this.billingHistoryMode;
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
      // QueryStrings ID = 1
      ExportPatternCodeListCondition.KEY,
      // QueryStrings ID = 2
      CreditExportContentCondition.KEY,
      // QueryStrings ID = 7
      OrganizationCodeCondition.KEY,
      // QueryStrings ID = 13
      ProductCodeCondition.KEY,
      // QueryStrings ID = 14
      ClientSessionIdCondition.KEY
    );
    if (this.getBillingHistoryMode()) {
      // QueryStrings ID = 3～4
      const billingYearMonth = <BillingYearMonthCondition>(this.conditionMap.get(BillingYearMonthCondition.KEY));
      if (billingYearMonth.getValueCodeS()) {
        grp.addCondition(billingYearMonth.getConditionS());
      }
      if (billingYearMonth.getValueCodeE()) {
        grp.addCondition(billingYearMonth.getConditionE());
      }
      // QueryStrings ID = 12
      grp.addCondition(this.conditionMap.get(CutoffDayCondition.KEY));
    } else {
      // QueryStrings ID = 5～6
      const recordingYearMonth = <RecordingYearMonthCondition>(this.conditionMap.get(RecordingYearMonthCondition.KEY));
      if (recordingYearMonth.getValueCodeS()) {
        grp.addCondition(recordingYearMonth.getConditionS());
      }
      if (recordingYearMonth.getValueCodeE()) {
        grp.addCondition(recordingYearMonth.getConditionE());
      }
    }
    // QueryStrings ID = 8～9
    const code = <BillingCodeCondition>(this.conditionMap.get(BillingCodeCondition.KEY));
    if (code.getValueCodeS()) {
      grp.addCondition(code.getConditionS());
    }
    if (code.getValueCodeE()) {
      grp.addCondition(code.getConditionE());
    }
    // QueryStrings ID = 10～11
    const billingNameKana = <BillingNameKanaCondition>(this.conditionMap.get(BillingNameKanaCondition.KEY));
    if (billingNameKana.getValueCodeS()) {
      grp.addCondition(billingNameKana.getConditionS());
    }
    if (billingNameKana.getValueCodeE()) {
      grp.addCondition(billingNameKana.getConditionE());
    }
    const kanas: BlSearchConditionGroup[] = new Array<BlSearchConditionGroup>();
    kanas.push(grp);
    // グループ指定しながら文字列を作成する
    apiQueryParameter.setConditionString(kanas[0].toConditionString());
    return apiQueryParameter;
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
   * @param exportPatternCodeList テキスト出力情報配列
   */
  public setExportPatternCodeList(exportPatternCodeList: string[]): void {
    (<ExportPatternCodeListCondition>(this.conditionMap.get(ExportPatternCodeListCondition.KEY))).setValue(exportPatternCodeList);
  }

  /**
   * 債権情報出力内容配列
   * @param creditExportContent 債権情報出力内容配列
   */
  public setCreditExportContent(creditExportContent: string[]): void {
    (<CreditExportContentCondition>(this.conditionMap.get(CreditExportContentCondition.KEY))).setValue(creditExportContent);
  }

  /**
   * 請求年月の設定
   * @param billingYearMonthStart 請求年月開始
   * @param billingYearMonthEnd 請求年月終了
   */
  public setBillingYearMonth(billingYearMonthStart: string, billingYearMonthEnd: string): void {
    (<BillingYearMonthCondition>(this.conditionMap.get(BillingYearMonthCondition.KEY)))
        .setBillingYearMonth(billingYearMonthStart, billingYearMonthEnd);
  }

  /**
   * 計上年月の設定
   * @param recordingYearMonthStart 計上年月開始
   * @param recordingYearMonthEnd 計上年月終了
   */
  public setRecordingYearMonth(recordingYearMonthStart: string, recordingYearMonthEnd: string): void {
    (<RecordingYearMonthCondition>(this.conditionMap.get(RecordingYearMonthCondition.KEY)))
        .setRecordingYearMonth(recordingYearMonthStart, recordingYearMonthEnd);
  }

  /**
   * 組織
   * @param organizationCode 組織
   */
  public setOrganizationCode(organizationCode: string): void {
    (<OrganizationCodeCondition>(this.conditionMap.get(OrganizationCodeCondition.KEY))).setValue(organizationCode);
  }

  /**
   * 請求先コードの設定
   * @param billingCodeStart 請求先コード開始
   * @param billingCodeEnd 請求先コード終了
   */
  public setBillingCode(billingCodeStart: string, billingCodeEnd: string): void {
    (<BillingCodeCondition>(this.conditionMap.get(BillingCodeCondition.KEY))).setBillingCode(billingCodeStart, billingCodeEnd);
  }

  /**
   * 請求先カナの設定
   * @param billingNameKanaStart 請求先カナ開始
   * @param billingNameKanaEnd 請求先カナ終了
   */
  public setBillingNameKana(billingNameKanaStart: string, billingNameKanaEnd: string): void {
    (<BillingNameKanaCondition>(this.conditionMap.get(BillingNameKanaCondition.KEY)))
        .setBillingNameKana(billingNameKanaStart, billingNameKanaEnd);
  }

  /**
   * 締日
   * @param cutoffDay 締日
   */
  public setCutoffDay(cutoffDay: number): void {
    (<CutoffDayCondition>(this.conditionMap.get(CutoffDayCondition.KEY))).setValue(cutoffDay);
  }

  /**
   * ユニークIdを設定
   * @param clientSessionId ユニークId
   */
  public setClientSessionId(clientSessionId: string): void {
    (<ClientSessionIdCondition>(this.conditionMap.get(ClientSessionIdCondition.KEY))).setValue(clientSessionId);
  }

}
