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
 * 債務情報出力条件
 */
class ExportDebtCondition extends BlSearchCondition {
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
class ProductCodeCondition extends ExportDebtCondition {
  static readonly KEY = 'productCode';
}

/**
 * 出力パターン
 */
class ExportPatternCodeListCondition extends ExportDebtCondition {
  static readonly KEY = 'exportPatternCodeList';
}

/**
 * 債務情報出力内容配列
 */
class DebtExportContentListCondition extends ExportDebtCondition {
  static readonly KEY = 'debtExportContentList';
}

/**
 * 支払締年月
 */
abstract class PayCutoffYearMonthContion extends BlSearchCondition {
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
   * 支払締年月
   * @param payCutoffYearMonthStart 支払締年月開始
   * @param payCutoffYearMonthEnd 支払締年月終了
   */
  abstract setPayCutoffYearMonth(payCutoffYearMonthStart: string, payCutoffYearMonthEnd: string): void;
}

/**
 * 支払締年月
 */
class PayCutoffYearMonthCondition extends PayCutoffYearMonthContion {
  static readonly KEY = 'payCutoffYearMonth';

  constructor(def?: BlSearchConditionDef) {
    if (def) {
      super(def);
    } else {
      super({ key: PayCutoffYearMonthCondition.KEY });
    }
  }

  /**
   * 支払締年月
   * @param payCutoffYearMonthStart 支払締年月開始
   * @param payCutoffYearMonthEnd 支払締年月終了
   */
  public setPayCutoffYearMonth(payCutoffYearMonthStart: string, payCutoffYearMonthEnd: string): void {
    this.codeS.setValue((_isEmpty(payCutoffYearMonthStart)) ? undefined : payCutoffYearMonthStart);
    this.codeE.setValue((_isEmpty(payCutoffYearMonthEnd)) ? undefined : payCutoffYearMonthEnd);
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
class PayRecordedOrganizationCodeCondition extends ExportDebtCondition {
  static readonly KEY = 'payRecordedOrganizationCode';
}

/**
 * 支払先コード
 */
abstract class PayeeCodeContion extends BlSearchCondition {
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
   * 支払先コード設定
   * @param payeeCodeStart 支払先コード開始
   * @param payeeCodeEnd 支払先コード終了
   */
  abstract setPayeeCode(payeeCodeStart: string, payeeCodeEnd: string): void;
}

/**
 * 支払先コード
 */
class PayeeCodeCondition extends PayeeCodeContion {
  static readonly KEY = 'payeeCode';

  constructor(def?: BlSearchConditionDef) {
    if (def) {
      super(def);
    } else {
      super({ key: PayeeCodeCondition.KEY });
    }
  }

  /**
   * 支払先コード設定
   * @param payeeCodeStart 支払先コード設定開始
   * @param payeeCodeEnd 支払先コード設定終了
   */
  public setPayeeCode(payeeCodeStart: string, payeeCodeEnd: string): void {
    this.codeS.setValue((_isEmpty(payeeCodeStart)) ? undefined : payeeCodeStart);
    this.codeE.setValue((_isEmpty(payeeCodeEnd)) ? undefined : payeeCodeEnd);
  }
}

/**
 * 支払先カナ
 */
abstract class PayeeNameKanaContion extends BlSearchCondition {
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
   * 支払先カナ
   * @param payeeNameKanaStart 支払先カナ開始
   * @param payeeNameKanaEnd 支払先カナ終了
   */
  abstract setPayeeNameKana(payeeNameKanaStart: string, payeeNameKanaEnd: string): void;
}

/**
 * 支払先カナ
 */
class PayeeNameKanaCondition extends PayeeNameKanaContion {
  static readonly KEY = 'payeeNameKana';

  constructor(def?: BlSearchConditionDef) {
    if (def) {
      super(def);
    } else {
      super({ key: PayeeNameKanaCondition.KEY });
    }
  }

  /**
   * 支払先カナ
   * @param payeeNameKanaStart 支払先カナ開始
   * @param payeeNameKanaEnd 支払先カナ終了
   */
  public setPayeeNameKana(payeeNameKanaStart: string, payeeNameKanaEnd: string): void {
    this.codeS.setValue((_isEmpty(payeeNameKanaStart)) ? undefined : payeeNameKanaStart);
    this.codeE.setValue((_isEmpty(payeeNameKanaEnd)) ? undefined : payeeNameKanaEnd);
  }
}

/**
 * 締日
 */
class CutoffDayCondition extends ExportDebtCondition {
  static readonly KEY = 'cutoffDay';
}

/**
 * clients session id
 */
class ClientSessionIdCondition extends ExportDebtCondition {
  static readonly KEY = 'clientSessionId';
}

/**  他の条件項目設定  */
/**  検索条件  */
export class ExportDebtConditionManager extends BlSearchConditionManager {
  private billingHistoryMode = true;
  constructor(
  ) {
    super([
      // QueryStrings ID = 1
      { type: BlConditionType.In, key: ExportPatternCodeListCondition.KEY, classType: ExportPatternCodeListCondition },
      // QueryStrings ID = 2
      { type: BlConditionType.In, key: DebtExportContentListCondition.KEY, classType: DebtExportContentListCondition },
      // QueryStrings ID = 3～4
      { key: PayCutoffYearMonthCondition.KEY, classType: PayCutoffYearMonthCondition },
      // QueryStrings ID = 5～6
      { key: RecordingYearMonthCondition.KEY, classType: RecordingYearMonthCondition },
      // QueryStrings ID = 7
      { type: BlConditionType.Equal, key: PayRecordedOrganizationCodeCondition.KEY, classType: PayRecordedOrganizationCodeCondition },
      // QueryStrings ID = 8～9
      { key: PayeeCodeCondition.KEY, classType: PayeeCodeCondition },
      // QueryStrings ID = 10～11
      { key: PayeeNameKanaCondition.KEY, classType: PayeeNameKanaCondition },
      // QueryStrings ID = 12
      { key: CutoffDayCondition.KEY, classType: CutoffDayCondition },
      // QueryStrings ID = 13
      { type: BlConditionType.In, key: ProductCodeCondition.KEY, classType: ProductCodeCondition },
      // QueryStrings ID = 14
      { type: BlConditionType.Equal, key: ClientSessionIdCondition.KEY, classType: ClientSessionIdCondition },
    ]);
  }

  /**
   * 債務情報出力内容
   * @param payHistoryMode 債務情報出力内容
   */
  public setPayHistoryMode(payHistoryMode: boolean): void {
    this.billingHistoryMode = payHistoryMode;
  }

  /**
   * 下書きモードを取得する
   * @return 下書きモード
   */
  public getPayHistoryMode(): boolean {
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
      DebtExportContentListCondition.KEY,
      // QueryStrings ID = 7
      PayRecordedOrganizationCodeCondition.KEY,
      // QueryStrings ID = 13
      ProductCodeCondition.KEY,
      // QueryStrings ID = 14
      ClientSessionIdCondition.KEY
    );
    if (this.getPayHistoryMode()) {
      // QueryStrings ID = 3～4
      const payCutoffYearMonth = <PayCutoffYearMonthCondition>(this.conditionMap.get(PayCutoffYearMonthCondition.KEY));
      if (payCutoffYearMonth.getValueCodeS()) {
        grp.addCondition(payCutoffYearMonth.getConditionS());
      }
      if (payCutoffYearMonth.getValueCodeE()) {
        grp.addCondition(payCutoffYearMonth.getConditionE());
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
    const code = <PayeeCodeCondition>(this.conditionMap.get(PayeeCodeCondition.KEY));
    if (code.getValueCodeS()) {
      grp.addCondition(code.getConditionS());
    }
    if (code.getValueCodeE()) {
      grp.addCondition(code.getConditionE());
    }
    // QueryStrings ID = 10～11
    const PayeeNameKana = <PayeeNameKanaCondition>(this.conditionMap.get(PayeeNameKanaCondition.KEY));
    if (PayeeNameKana.getValueCodeS()) {
      grp.addCondition(PayeeNameKana.getConditionS());
    }
    if (PayeeNameKana.getValueCodeE()) {
      grp.addCondition(PayeeNameKana.getConditionE());
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
   * 債務情報出力内容配列
   * @param debtExportContentList 債務情報出力内容配列
   */
  public setDebtExportContentList(debtExportContentList: string[]): void {
    (<DebtExportContentListCondition>(this.conditionMap.get(DebtExportContentListCondition.KEY))).setValue(debtExportContentList);
  }

  /**
   * 支払締年月の設定
   * @param payCutoffYearMonthStart 支払締年月開始
   * @param payCutoffYearMonthEnd 支払締年月終了
   */
  public setPayCutoffYearMonth(payCutoffYearMonthStart: string, payCutoffYearMonthEnd: string): void {
    (<PayCutoffYearMonthCondition>(this.conditionMap.get(PayCutoffYearMonthCondition.KEY)))
        .setPayCutoffYearMonth(payCutoffYearMonthStart, payCutoffYearMonthEnd);
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
   * @param payRecordedOrganizationCode 組織
   */
  public setPayRecordedOrganizationCode(payRecordedOrganizationCode: string): void {
    (<PayRecordedOrganizationCodeCondition>(this.conditionMap.get(PayRecordedOrganizationCodeCondition.KEY)))
        .setValue(payRecordedOrganizationCode);
  }

  /**
   * 支払先コードの設定
   * @param payeeCodeStart 支払先コード開始
   * @param payeeCodeEnd 支払先コード終了
   */
  public setPayeeCode(payeeCodeStart: string, payeeCodeEnd: string): void {
    (<PayeeCodeCondition>(this.conditionMap.get(PayeeCodeCondition.KEY))).setPayeeCode(payeeCodeStart, payeeCodeEnd);
  }

  /**
   * 支払先カナの設定
   * @param payeeNameKanaStart 支払先カナ開始
   * @param payeeNameKanaEnd 支払先カナ終了
   */
  public setPayeeNameKana(payeeNameKanaStart: string, payeeNameKanaEnd: string): void {
    (<PayeeNameKanaCondition>(this.conditionMap.get(PayeeNameKanaCondition.KEY))).setPayeeNameKana(payeeNameKanaStart, payeeNameKanaEnd);
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
