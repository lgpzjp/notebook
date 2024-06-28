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
import {
  SalesSlipSupplierSelect
} from '@blcloud/bl-datamodel/enum/sales/sales-slip-supplier-select';

/** 売上伝票出力条件 */
class ExportSalesSlipCondition extends BlSearchCondition {
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
   * @param dateStart 開始日
   * @param dateEnd 終了日
   */
  abstract setDate(dateStart: string, dateEnd: string): void;
}

/**
 * プロダクトコード
 */
class ProductCodeCondition extends ExportSalesSlipCondition {
  static readonly KEY = 'productCode';
}

/**
 * テキスト出力パターンコード配列
 */
class ExportPatternCodeListCondition extends ExportSalesSlipCondition {
  static readonly KEY = 'exportPatternCodeList';
}

/**
 * 売上伝票情報出力内容配列
 */
class SalesSlipExportContentListCondition extends ExportSalesSlipCondition {
  static readonly KEY = 'salesSlipExportContentList';
}

/**
 *  伝票基準日
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
   * @param dateStart 開始日
   * @param dateEnd 終了日
   */
  public setDate(dateStart: string, dateEnd: string): void {
    this.dateS.setValue((_isEmpty(dateStart) || DateTimeUtils.initial.iso8601.date === dateStart) ? undefined : dateStart);
    this.dateE.setValue((_isEmpty(dateEnd) || DateTimeUtils.initial.iso8601.date === dateEnd) ? undefined : dateEnd);
  }
}

/**
 * 更新日付
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
   * @param dateStart 開始日
   * @param dateEnd 終了日
   */
  public setDate(dateStart: string, dateEnd: string): void {
    this.dateS.setValue((_isEmpty(dateStart) || DateTimeUtils.initial.iso8601.date === dateStart) ? undefined : dateStart);
    this.dateE.setValue((_isEmpty(dateEnd) || DateTimeUtils.initial.iso8601.date === dateEnd) ? undefined : dateEnd);
  }
}

/**
 * 請求計上日
 */
class BillingRecordingDateCondition extends DateCondition {
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
   * @param dateStart 請求締日
   */
  public setDate(dateStart: string): void {
    this.dateS.setValue((_isEmpty(dateStart) || DateTimeUtils.initial.iso8601.date === dateStart) ? undefined : dateStart);
  }

  /**
   * 検索条件タイプ
   */
  public setType(): void {
    this.dateS.setType(BlConditionType.Equal);
  }
}

/**
 * 顧客管理組織コード
 */
class CustomerManageOrganizationCodeCondition extends ExportSalesSlipCondition {
  static readonly KEY = 'customerManageOrganizationCode';
}

/**
 * 請求組織コード
 */
class DemandOrganizationCodeCondition extends ExportSalesSlipCondition {
  static readonly KEY = 'demandOrganizationCode';
}

/**
 * 伝票管理組織コード
 */
class SlipOrganizationCodeCondition extends ExportSalesSlipCondition {
  static readonly KEY = 'slipOrganizationCode';
}

/**
 * 担当者コード
 */
abstract class PicEmployeeCodeContion extends BlSearchCondition {
  /** 開始コード条件 */
  protected codeS: BlSearchCondition;
  /** 終了コード条件 */
  protected codeE: BlSearchCondition;

  constructor(def: BlSearchConditionDef) {
    super(def);
    this.codeS = new BlSearchCondition(def);
    this.codeE = new BlSearchCondition(def);

    this.codeS.setType(BlConditionType.GreaterThanEqual);
    this.codeE.setType(BlConditionType.LessThanEqual);
  }

  /** 開始コードを取得する */
  public getValueCodeS(): string | number | (string | number)[] {
    return this.codeS.getValue();
  }

  /** 終了コードを取得する */
  public getValueCodeE(): string | number | (string | number)[] {
    return this.codeE.getValue();
  }

  /** 開始コード条件を取得する */
  public getConditionS(): BlSearchCondition {
    return this.codeS;
  }

  /** 酋長コード条件を取得する */
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
   * 担当者コード
   * @param picEmployeeCodeStart 担当者コード開始
   * @param picEmployeeCodeEnd 担当者コード終了
   */
  abstract setPicEmployeeCode(picEmployeeCodeStart: string, picEmployeeCodeEnd: string): void;
}

/**
 * 担当者コード
 */
class EmployeeInfoPicEmployeeCodeCondition extends PicEmployeeCodeContion {
  static readonly KEY = 'picEmployeeCode';

  constructor(def?: BlSearchConditionDef) {
    if (def) {
      super(def);
    } else {
      super({ key: EmployeeInfoPicEmployeeCodeCondition.KEY });
    }
  }

  /**
   * 担当者コード
   * @param picEmployeeCodeStart 担当者コード開始
   * @param picEmployeeCodeEnd 担当者コード終了
   */
  public setPicEmployeeCode(picEmployeeCodeStart: string, picEmployeeCodeEnd: string): void {
    this.codeS.setValue((_isEmpty(picEmployeeCodeStart)) ? undefined : picEmployeeCodeStart);
    this.codeE.setValue((_isEmpty(picEmployeeCodeEnd)) ? undefined : picEmployeeCodeEnd);
  }
}

/**
 * 得意先コード
 */
abstract class CustomerCodeContion extends BlSearchCondition {
  /** 開始コード条件 */
  protected codeS: BlSearchCondition;
  /** 終了コード条件 */
  protected codeE: BlSearchCondition;

  constructor(def: BlSearchConditionDef) {
    super(def);
    this.codeS = new BlSearchCondition(def);
    this.codeE = new BlSearchCondition(def);

    this.codeS.setType(BlConditionType.GreaterThanEqual);
    this.codeE.setType(BlConditionType.LessThanEqual);
  }

  /** 開始コードを取得する */
  public getValueCodeS(): string | number | (string | number)[] {
    return this.codeS.getValue();
  }

  /** 終了コードを取得する */
  public getValueCodeE(): string | number | (string | number)[] {
    return this.codeE.getValue();
  }

  /** 開始コード条件を取得する */
  public getConditionS(): BlSearchCondition {
    return this.codeS;
  }

  /** 終了コード条件を取得する */
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
   * 得意先コード
   * @param customerCodeStart 得意先コード開始
   * @param customerCodeEnd 得意先コード終了
   */
  abstract setCustomerCode(customerCodeStart: string, customerCodeEnd: string): void;
}

/**
 * 得意先コード
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
   * 得意先コード
   * @param customerCodeStart 得意先コード開始
   * @param customerCodeEnd 得意先コード終了
   */
  public setCustomerCode(customerCodeStart: string, customerCodeEnd: string): void {
    this.codeS.setValue((_isEmpty(customerCodeStart)) ? undefined : customerCodeStart);
    this.codeE.setValue((_isEmpty(customerCodeEnd)) ? undefined : customerCodeEnd);
  }
}

/**
 * 請求先コード
 */
abstract class BillingCodeContion extends BlSearchCondition {
  /** 開始コード条件 */
  protected codeS: BlSearchCondition;
  /** 終了コード条件 */
  protected codeE: BlSearchCondition;

  constructor(def: BlSearchConditionDef) {
    super(def);
    this.codeS = new BlSearchCondition(def);
    this.codeE = new BlSearchCondition(def);

    this.codeS.setType(BlConditionType.GreaterThanEqual);
    this.codeE.setType(BlConditionType.LessThanEqual);
  }

  /** 開始コードを取得する */
  public getValueCodeS(): string | number | (string | number)[] {
    return this.codeS.getValue();
  }

  /** 終了コードを取得する */
  public getValueCodeE(): string | number | (string | number)[] {
    return this.codeE.getValue();
  }

  /** 開始コード条件を取得する */
  public getConditionS(): BlSearchCondition {
    return this.codeS;
  }

  /** 終了コード条件を取得する */
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
   * 請求先コード
   * @param billingCodeStart 請求先コード開始
   * @param billingCodeEnd 請求先コード終了
   */
  abstract setBillingCode(billingCodeStart: string, billingCodeEnd: string): void;
}

/**
 * 請求先コード
 */
class BillingInfoBillingCodeCondition extends BillingCodeContion {
  static readonly KEY = 'billingCode';

  constructor(def?: BlSearchConditionDef) {
    if (def) {
      super(def);
    } else {
      super({ key: BillingInfoBillingCodeCondition.KEY });
    }
  }

  /**
   * 請求先コード
   * @param billingCodeStart 請求先コード開始
   * @param billingCodeEnd 請求先コード終了
   */
  public setBillingCode(billingCodeStart: string, billingCodeEnd: string): void {
    this.codeS.setValue((_isEmpty(billingCodeStart)) ? undefined : billingCodeStart);
    this.codeE.setValue((_isEmpty(billingCodeEnd)) ? undefined : billingCodeEnd);
  }
}

/**
 * 締日
 */
class CutoffDayCondition extends ExportSalesSlipCondition {
  static readonly KEY = 'cutoffDay';
}

/**
 * 倉庫コード
 */
abstract class WhCodeContion extends BlSearchCondition {
  /** 開始コード条件 */
  protected codeS: BlSearchCondition;
  /** 終了コード条件 */
  protected codeE: BlSearchCondition;

  constructor(def: BlSearchConditionDef) {
    super(def);
    this.codeS = new BlSearchCondition(def);
    this.codeE = new BlSearchCondition(def);

    this.codeS.setType(BlConditionType.GreaterThanEqual);
    this.codeE.setType(BlConditionType.LessThanEqual);
  }

  /** 開始コードを取得する */
  public getValueCodeS(): string | number | (string | number)[] {
    return this.codeS.getValue();
  }

  /** 終了コードを取得する */
  public getValueCodeE(): string | number | (string | number)[] {
    return this.codeE.getValue();
  }

  /** 開始コード条件を取得する */
  public getConditionS(): BlSearchCondition {
    return this.codeS;
  }

  /** 終了コード条件を取得する */
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
   * 倉庫コード
   * @param whCodeStart 倉庫コード開始
   * @param whCodeEnd 倉庫コード終了
   */
  abstract setWhCode(whCodeStart: string, whCodeEnd: string): void;
}

/**
 * 倉庫コード
 */
class WhCodeInfoWhCodeCondition extends WhCodeContion {
  static readonly KEY = 'whCode';

  constructor(def?: BlSearchConditionDef) {
    if (def) {
      super(def);
    } else {
      super({ key: WhCodeInfoWhCodeCondition.KEY });
    }
  }

  /**
   * 倉庫コード
   * @param whCodeStart 倉庫コード開始
   * @param whCodeEnd 倉庫コード終了
   */
  public setWhCode(whCodeStart: string, whCodeEnd: string): void {
    this.codeS.setValue((_isEmpty(whCodeStart)) ? undefined : whCodeStart);
    this.codeE.setValue((_isEmpty(whCodeEnd)) ? undefined : whCodeEnd);
  }
}

/**
 * メーカーコード
 */
abstract class ItemMakerCdContion extends BlSearchCondition {
  /** 開始コード条件 */
  protected codeS: BlSearchCondition;
  /** 終了コード条件 */
  protected codeE: BlSearchCondition;

  constructor(def: BlSearchConditionDef) {
    super(def);
    this.codeS = new BlSearchCondition(def);
    this.codeE = new BlSearchCondition(def);

    this.codeS.setType(BlConditionType.GreaterThanEqual);
    this.codeE.setType(BlConditionType.LessThanEqual);
  }

  /** 開始コードを取得する */
  public getValueCodeS(): string | number | (string | number)[] {
    return this.codeS.getValue();
  }

  /** 終了コードを取得する */
  public getValueCodeE(): string | number | (string | number)[] {
    return this.codeE.getValue();
  }

  /** 開始コード条件を取得する */
  public getConditionS(): BlSearchCondition {
    return this.codeS;
  }

  /** 終了コード条件を取得する */
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
   * メーカーコード
   * @param itemMakerCdStart メーカーコード開始
   * @param itemMakerCdEnd メーカーコード終了
   */
  abstract setItemMakerCd(itemMakerCdStart: string, itemMakerCdEnd: string): void;
}

/**
 * メーカーコード
 */
class MakerInfoItemMakerCdCondition extends ItemMakerCdContion {
  static readonly KEY = 'itemMakerCd';

  constructor(def?: BlSearchConditionDef) {
    if (def) {
      super(def);
    } else {
      super({ key: MakerInfoItemMakerCdCondition.KEY });
    }
  }

  /**
   * メーカーコード
   * @param itemMakerCdStart メーカーコード開始
   * @param itemMakerCdEnd メーカーコード終了
   */
  public setItemMakerCd(itemMakerCdStart: string, itemMakerCdEnd: string): void {
    this.codeS.setValue((_isEmpty(itemMakerCdStart)) ? undefined : itemMakerCdStart);
    this.codeE.setValue((_isEmpty(itemMakerCdEnd)) ? undefined : itemMakerCdEnd);
  }
}

/**
 * 品番
 */
class SearchItemPartsNumberCondition extends ExportSalesSlipCondition {
  static readonly KEY = 'searchItemPartsNumber';
}

/**
 * 品名
 */
class SearchItemPartsNameCondition extends ExportSalesSlipCondition {
  static readonly KEY = 'searchItemPartsName';
}

/**
 * クライアントセッションID
 */
class ClientSessionIdCondition extends ExportSalesSlipCondition {
  static readonly KEY = 'clientSessionId';
}

/**
 * 売上伝票情報出力条件を管理
 */
export class ExportSalesSlipConditionManager extends BlSearchConditionManager {
  /** 対象期間 */
  private targetPeriod = SalesSlipSupplierSelect.SlipDate;

  constructor() {
    super([
      // QueryStrings ID = 1
      { type: BlConditionType.In, key: ExportPatternCodeListCondition.KEY, classType: ExportPatternCodeListCondition },
      // QueryStrings ID = 2
      { type: BlConditionType.In, key: SalesSlipExportContentListCondition.KEY, classType: SalesSlipExportContentListCondition },
      // QueryStrings ID = 3～4
      { key: SlipStandardDateCondition.KEY, classType: SlipStandardDateCondition },
      // QueryStrings ID = 5～6
      { key: UpdateDateTimeCondition.KEY, classType: UpdateDateTimeCondition },
      // QueryStrings ID = 7
      { type: BlConditionType.Equal, key: BillingRecordingDateCondition.KEY, classType: BillingRecordingDateCondition },
      // QueryStrings ID = 8
      {
        type: BlConditionType.Equal, key: CustomerManageOrganizationCodeCondition.KEY,
        classType: CustomerManageOrganizationCodeCondition
      },
      // QueryStrings ID = 9
      {
        type: BlConditionType.Equal, key: DemandOrganizationCodeCondition.KEY,
        classType: DemandOrganizationCodeCondition
      },
      // QueryStrings ID = 10～11
      { key: EmployeeInfoPicEmployeeCodeCondition.KEY, classType: EmployeeInfoPicEmployeeCodeCondition },
      // QueryStrings ID = 14～15
      { key: CustomerInfoCustomerCodeCondition.KEY, classType: CustomerInfoCustomerCodeCondition },
      // QueryStrings ID = 12～13
      { key: BillingInfoBillingCodeCondition.KEY, classType: BillingInfoBillingCodeCondition },
      // QueryStrings ID = 16
      { key: CutoffDayCondition.KEY, classType: CutoffDayCondition },
      // QueryStrings ID = 17～18
      { key: WhCodeInfoWhCodeCondition.KEY, classType: WhCodeInfoWhCodeCondition },
      // QueryStrings ID = 19～20
      { key: MakerInfoItemMakerCdCondition.KEY, classType: MakerInfoItemMakerCdCondition },
      // QueryStrings ID = 21
      { type: BlConditionType.Match, key: SearchItemPartsNumberCondition.KEY, classType: SearchItemPartsNumberCondition },
      // QueryStrings ID = 22
      { type: BlConditionType.Match, key: SearchItemPartsNameCondition.KEY, classType: SearchItemPartsNameCondition },
      // QueryStrings ID = 23
      { type: BlConditionType.In, key: ProductCodeCondition.KEY, classType: ProductCodeCondition },
      // QueryStrings ID = 24
      { type: BlConditionType.Equal, key: ClientSessionIdCondition.KEY, classType: ClientSessionIdCondition },
      // QueryStrings ID = 25
      {
        type: BlConditionType.Equal, key: SlipOrganizationCodeCondition.KEY,
        classType: SlipOrganizationCodeCondition
      }
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
      // QueryStrings ID = 1
      ExportPatternCodeListCondition.KEY,
      // QueryStrings ID = 2
      SalesSlipExportContentListCondition.KEY,
      // QueryStrings ID = 8
      CustomerManageOrganizationCodeCondition.KEY,
      // QueryStrings ID = 9
      DemandOrganizationCodeCondition.KEY,
      // QueryStrings ID = 16
      CutoffDayCondition.KEY,
      // QueryStrings ID = 21
      SearchItemPartsNumberCondition.KEY,
      // QueryStrings ID = 22
      SearchItemPartsNameCondition.KEY,
      // QueryStrings ID = 23
      ProductCodeCondition.KEY,
      // QueryStrings ID = 24
      ClientSessionIdCondition.KEY,
      // QueryStrings ID = 25
      SlipOrganizationCodeCondition.KEY,
    );

    // QueryStrings ID = 3～7
    // 「対象期間」が0:伝票日付 or 1:更新日付の場合
    if (this.getTargetPeriod() === SalesSlipSupplierSelect.SlipDate
      || this.getTargetPeriod() === SalesSlipSupplierSelect.UpdateDate) {

      const date = this.getTargetPeriod() === SalesSlipSupplierSelect.SlipDate
      ? <SlipStandardDateCondition>(this.conditionMap.get(SlipStandardDateCondition.KEY))
      : <UpdateDateTimeCondition>(this.conditionMap.get(UpdateDateTimeCondition.KEY));
      if (date.getValueS()) {
        grp.addCondition(date.getConditionS());
      }
      if (date.getValueE()) {
        grp.addCondition(date.getConditionE());
      }
    // 「対象期間」が2:請求締日の場合
    } else {
      const date = <BillingRecordingDateCondition>(this.conditionMap.get(BillingRecordingDateCondition.KEY));
      if (date.getValueS()) {
        grp.addCondition(date.getConditionS());
      }
    }

    // QueryStrings ID = 10～11
    const picEmployeeCode = <EmployeeInfoPicEmployeeCodeCondition>(this.conditionMap.get(EmployeeInfoPicEmployeeCodeCondition.KEY));
    if (picEmployeeCode.getValueCodeS()) {
      grp.addCondition(picEmployeeCode.getConditionS());
    }
    if (picEmployeeCode.getValueCodeE()) {
      grp.addCondition(picEmployeeCode.getConditionE());
    }

    // QueryStrings ID = 14～15
    const customerCode = <CustomerInfoCustomerCodeCondition>(this.conditionMap.get(CustomerInfoCustomerCodeCondition.KEY));
    if (customerCode.getValueCodeS()) {
      grp.addCondition(customerCode.getConditionS());
    }
    if (customerCode.getValueCodeE()) {
      grp.addCondition(customerCode.getConditionE());
    }

    // QueryStrings ID = 12～13
    const billingCode = <BillingInfoBillingCodeCondition>(this.conditionMap.get(BillingInfoBillingCodeCondition.KEY));
    if (billingCode.getValueCodeS()) {
      grp.addCondition(billingCode.getConditionS());
    }
    if (billingCode.getValueCodeE()) {
      grp.addCondition(billingCode.getConditionE());
    }

    // QueryStrings ID = 17～18
    const whCode = <WhCodeInfoWhCodeCondition>(this.conditionMap.get(WhCodeInfoWhCodeCondition.KEY));
    if (whCode.getValueCodeS()) {
      grp.addCondition(whCode.getConditionS());
    }
    if (whCode.getValueCodeE()) {
      grp.addCondition(whCode.getConditionE());
    }

    // QueryStrings ID = 19～20
    const itemMakerCd = <MakerInfoItemMakerCdCondition>(this.conditionMap.get(MakerInfoItemMakerCdCondition.KEY));
    if (itemMakerCd.getValueCodeS()) {
      grp.addCondition(itemMakerCd.getConditionS());
    }
    if (itemMakerCd.getValueCodeE()) {
      grp.addCondition(itemMakerCd.getConditionE());
    }
    const kanas: BlSearchConditionGroup[] = new Array<BlSearchConditionGroup>();
    kanas.push(grp);
    // グループ指定しながら文字列を作成する
    apiQueryParameter.setConditionString(kanas[0].toConditionString());
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
   * 売上伝票情報出力内容を設定
   * @param salesSlipExportContentList 売上伝票情報出力内容配列
   */
  public setSalesSlipExportContentList(salesSlipExportContentList: string[]): void {
    (<SalesSlipExportContentListCondition>(this.conditionMap.get(SalesSlipExportContentListCondition.KEY)))
        .setValue(salesSlipExportContentList);
  }

  /**
   * 日付を設定
   * @param dateStart 開始日
   * @param dateEnd 終了日
   * @param targetPeriod 伝票日付あるいは更新日付あるいは請求締日を設定する条件
   */
  public setDate(dateStart: string, dateEnd?: string, targetPeriod?: string): void {
    // 伝票日付
    if (targetPeriod === SalesSlipSupplierSelect.SlipDate) {
      (<SlipStandardDateCondition>(this.conditionMap.get(SlipStandardDateCondition.KEY))).setDate(dateStart, dateEnd);
    // 更新日付
    } else if (targetPeriod === SalesSlipSupplierSelect.UpdateDate) {
      (<UpdateDateTimeCondition>(this.conditionMap.get(UpdateDateTimeCondition.KEY))).setDate(dateStart, dateEnd);
    // 請求締日
    } else {
      (<BillingRecordingDateCondition>(this.conditionMap.get(BillingRecordingDateCondition.KEY))).setDate(dateStart);
      // 検索条件タイプは「BlConditionType.Equal」設定
      (<BillingRecordingDateCondition>(this.conditionMap.get(BillingRecordingDateCondition.KEY))).setType();
    }
  }

  /**
   * 顧客管理組織コードを設定
   * @param customerManageOrganizationCode 顧客管理組織コード
   */
  public setCustomerManageOrganizationCode(customerManageOrganizationCode: string): void {
    (<CustomerManageOrganizationCodeCondition>(this.conditionMap.get(CustomerManageOrganizationCodeCondition.KEY)))
        .setValue(customerManageOrganizationCode);
  }

  /**
   * 請求組織コードを設定
   * @param demandOrganizationCode 請求組織コード
   */
  public setDemandOrganizationCode(demandOrganizationCode: string): void {
    (<DemandOrganizationCodeCondition>(this.conditionMap.get(DemandOrganizationCodeCondition.KEY))).setValue(demandOrganizationCode);
  }

  /**
   * 伝票管理組織コードを設定
   * @param slipOrganizationCode 伝票管理組織コード
   */
  public setSlipOrganizationCode(slipOrganizationCode: string): void {
    (<SlipOrganizationCodeCondition>(this.conditionMap.get(SlipOrganizationCodeCondition.KEY))).setValue(slipOrganizationCode);
  }

  /**
   * 担当者コードの設定
   * @param employeeCodeStart 担当者コード開始
   * @param employeeCodeEnd 担当者コード終了
   */
  public setPicEmployeeCode(employeeCodeStart: string, employeeCodeEnd: string): void {
    (<EmployeeInfoPicEmployeeCodeCondition>(this.conditionMap.get(EmployeeInfoPicEmployeeCodeCondition.KEY)))
        .setPicEmployeeCode(employeeCodeStart, employeeCodeEnd);
  }

  /**
   * 得意先コードの設定
   * @param customerCodeStart 得意先コード開始
   * @param customerCodeEnd 得意先コード終了
   */
  public setCustomerCode(customerCodeStart: string, customerCodeEnd: string): void {
    (<CustomerInfoCustomerCodeCondition>(this.conditionMap.get(CustomerInfoCustomerCodeCondition.KEY)))
        .setCustomerCode(customerCodeStart, customerCodeEnd);
  }

  /**
   * 請求先コードの設定
   * @param billingCodeStart 請求先コード開始
   * @param billingCodeEnd 請求先コード終了
   */
  public setBillingCode(billingCodeStart: string, billingCodeEnd: string): void {
    (<BillingInfoBillingCodeCondition>(this.conditionMap.get(BillingInfoBillingCodeCondition.KEY)))
        .setBillingCode(billingCodeStart, billingCodeEnd);
  }

  /**
   * 締日
   * @param cutoffDay 締日
   */
  public setCutoffDay(cutoffDay: string): void {
    (<CutoffDayCondition>(this.conditionMap.get(CutoffDayCondition.KEY))).setValue(cutoffDay);
  }

  /**
   * 倉庫コードの設定
   * @param whCodeStart 倉庫コード開始
   * @param whCodeEnd 倉庫コード終了
   */
  public setWhCode(whCodeStart: string, whCodeEnd: string): void {
    (<WhCodeInfoWhCodeCondition>(this.conditionMap.get(WhCodeInfoWhCodeCondition.KEY))).setWhCode(whCodeStart, whCodeEnd);
  }

  /**
   * 商品メーカーコードの設定
   * @param itemMakerCdStart 商品メーカーコード開始
   * @param itemMakerCdEnd 商品メーカーコード終了
   */
  public setItemMakerCd(itemMakerCdStart: string, itemMakerCdEnd: string): void {
    (<MakerInfoItemMakerCdCondition>(this.conditionMap.get(MakerInfoItemMakerCdCondition.KEY)))
        .setItemMakerCd(itemMakerCdStart, itemMakerCdEnd);
  }

  /**
   * 検索条件商品品番
   * @param searchItemPartsNumber 検索条件商品品番
   */
  public setSearchItemPartsNumber(searchItemPartsNumber: string): void {
    (<SearchItemPartsNumberCondition>(this.conditionMap.get(SearchItemPartsNumberCondition.KEY))).setValue(searchItemPartsNumber);
  }

  /**
   * 検索条件商品名称
   * @param searchItemPartsName 検索条件商品名称
   */
  public setSearchItemPartsName(searchItemPartsName: string): void {
    (<SearchItemPartsNameCondition>(this.conditionMap.get(SearchItemPartsNameCondition.KEY))).setValue(searchItemPartsName);
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
  public setProductCodes(productCodes: string[]): void {
    (<ProductCodeCondition>(this.conditionMap.get(ProductCodeCondition.KEY))).setValue(productCodes);
  }

}
