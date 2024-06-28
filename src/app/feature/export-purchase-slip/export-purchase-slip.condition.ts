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
import { PurchaseSlipOrganizationSelect } from '@blcloud/bl-datamodel/enum/purchase/purchase-slip-organization-select';
import { PurchaseSlipTargetPeriodDiv } from '@blcloud/bl-datamodel/enum/purchase/purchase-slip-target-period-div';
import { ProductCode } from '@blcloud/bl-datamodel/enum/common/product-code';

/**
 * 仕入伝票出力条件
 */
class ExportPurchaseSlipCondition extends BlSearchCondition {
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
 * 項目（eq）設定
 */
abstract class DateCtCondition extends BlSearchCondition {
  /** 項目（eq） */
  protected dateS: BlSearchCondition;

  constructor(def: BlSearchConditionDef) {
    super(def);
    this.dateS = new BlSearchCondition(def);
    this.dateS.setType(BlConditionType.Match);
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
    this.dateS.setValue((_isEmpty(s) || DateTimeUtils.initial.iso8601.date === s) ? undefined : s);
    this.dateE.setValue((_isEmpty(e) || DateTimeUtils.initial.iso8601.date === e) ? undefined : e);
  }
}

/**
 * 支払締日のパラメータを管理
 */
class PayRecordingDate extends DateEqCondition {
  static readonly KEY = 'payRecordingDate';

  constructor(def?: BlSearchConditionDef) {
    if (def) {
      super(def);
    } else {
      super({ key: PayRecordingDate.KEY });
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
class ExportPatternCodeCondition extends ExportPurchaseSlipCondition {
  static readonly KEY = 'exportPatternCodeList';
}

/**
 * プロダクトコード
 */
class ProductCodeCondition extends ExportPurchaseSlipCondition {
  static readonly KEY = 'productCode';
}

/**
 * 出力内容を管理
 */
class PurchaseSlipExportContentCondition extends ExportPurchaseSlipCondition {
  static readonly KEY = 'purchaseSlipExportContentList';
}

/**
 * clientSessionIdを管理
 */
class ClientSessionIdCondition extends ExportPurchaseSlipCondition {
  static readonly KEY = 'clientSessionId';
}

/**
 * 仕入組織出力を管理
 */
class SupplierMgtOrganizationCode extends DateEqCondition {
  static readonly KEY = 'supplierMgtOrganizationCode';

  constructor(def?: BlSearchConditionDef) {
    if (def) {
      super(def);
    } else {
      super({ key: SupplierMgtOrganizationCode.KEY });
    }
  }

  /**
   * 仕入組織コード設定
   * @param s 仕入組織コード
   */
  public setValue(s: string): void {
    this.dateS.setValue(_isEmpty(s) ? undefined : s);
  }
}

/**
 * 支払組織出力を管理
 */
class PayOrganizationCode extends DateEqCondition {
  static readonly KEY = 'payOrganizationCode';

  constructor(def?: BlSearchConditionDef) {
    if (def) {
      super(def);
    } else {
      super({ key: PayOrganizationCode.KEY });
    }
  }

  /**
   * 支払組織コード設定
   * @param s 支払組織コード
   */
  public setValue(s: string): void {
    this.dateS.setValue(_isEmpty(s) ? undefined : s);
  }
}

/**
 * 仕入組織出力(Recycle)を管理
 */
 class SlipOrganizationCode extends DateEqCondition {
  static readonly KEY = 'slipOrganizationCode';

  constructor(def?: BlSearchConditionDef) {
    if (def) {
      super(def);
    } else {
      super({ key: SlipOrganizationCode.KEY });
    }
  }

  /**
   * 伝票管理組織コード設定
   * @param s 伝票管理組織コード
   */
  public setValue(s: string): void {
    this.dateS.setValue(_isEmpty(s) ? undefined : s);
  }
}

/**
 * 担当コードを管理
 */
class PicEmployeeCode extends DateCondition {
  static readonly KEY = 'picEmployeeCode';

  constructor(def?: BlSearchConditionDef) {
    if (def) {
      super(def);
    } else {
      super({ key: PicEmployeeCode.KEY });
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
 * 仕入先を管理
 */
class SupplierCd extends DateCondition {
  static readonly KEY = 'supplierCd';

  constructor(def?: BlSearchConditionDef) {
    if (def) {
      super(def);
    } else {
      super({ key: SupplierCd.KEY });
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
 * 支払先を管理
 */
class PayeeCode extends DateCondition {
  static readonly KEY = 'payeeCode';

  constructor(def?: BlSearchConditionDef) {
    if (def) {
      super(def);
    } else {
      super({ key: PayeeCode.KEY });
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
class CutoffDay extends DateEqCondition {
  static readonly KEY = 'cutoffDay';

  constructor(def?: BlSearchConditionDef) {
    if (def) {
      super(def);
    } else {
      super({ key: CutoffDay.KEY });
    }
  }

  /**
   * 締日設定
   * @param s 締日
   */
  public setValue(s: string): void {
    this.dateS.setValue(_isEmpty(s) ? undefined : s);
  }
}

/**
 * 倉庫コードを管理
 */
class WhCode extends DateCondition {
  static readonly KEY = 'whCode';

  constructor(def?: BlSearchConditionDef) {
    if (def) {
      super(def);
    } else {
      super({ key: WhCode.KEY });
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
 * メーカーコードを管理
 */
class ItemMakerCd extends DateCondition {
  static readonly KEY = 'itemMakerCd';

  constructor(def?: BlSearchConditionDef) {
    if (def) {
      super(def);
    } else {
      super({ key: ItemMakerCd.KEY });
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
 * 品番を管理
 */
class SearchItemPartsNumber extends DateCtCondition {
  static readonly KEY = 'searchItemPartsNumber';

  constructor(def?: BlSearchConditionDef) {
    if (def) {
      super(def);
    } else {
      super({ key: SearchItemPartsNumber.KEY });
    }
  }

  /**
   * 品番設定
   * @param s 品番
   */
  public setValue(s: string): void {
    this.dateS.setValue(_isEmpty(s) ? undefined : s);
  }
}

/**
 * 品名を管理
 */
class SearchItemPartsName extends DateCtCondition {
  static readonly KEY = 'searchItemPartsName';

  constructor(def?: BlSearchConditionDef) {
    if (def) {
      super(def);
    } else {
      super({ key: SearchItemPartsName.KEY });
    }
  }

  /**
   * 品名設定
   * @param s 品名
   */
  public setValue(s: string): void {
    this.dateS.setValue(_isEmpty(s) ? undefined : s);
  }
}



/**
 * 伝票情報出力条件を管理
 */
export class ExportPurchaseSlipConditionManager extends BlSearchConditionManager {
  /** 下書きモード */
  private documentMode = PurchaseSlipTargetPeriodDiv.SlipDate;

  /** プロダクトコード */
  public readonly ProductCode = ProductCode;

  constructor() {
    super([
      { type: BlConditionType.In, key: ExportPatternCodeCondition.KEY, classType: ExportPatternCodeCondition },
      { type: BlConditionType.In, key: PurchaseSlipExportContentCondition.KEY, classType: PurchaseSlipExportContentCondition },
      { key: SlipStandardDateCondition.KEY, classType: SlipStandardDateCondition },
      { key: UpdateDateTimeCondition.KEY, classType: UpdateDateTimeCondition },
      { key: PayRecordingDate.KEY, classType: PayRecordingDate },
      { key: SupplierMgtOrganizationCode.KEY, classType: SupplierMgtOrganizationCode },
      { key: PayOrganizationCode.KEY, classType: PayOrganizationCode },
      { key: SlipOrganizationCode.KEY, classType: SlipOrganizationCode },
      { type: BlConditionType.Equal, key: PicEmployeeCode.KEY, classType: PicEmployeeCode },
      { type: BlConditionType.Equal, key: SupplierCd.KEY, classType: SupplierCd },
      { type: BlConditionType.Equal, key: PayeeCode.KEY, classType: PayeeCode },
      { type: BlConditionType.Equal, key: CutoffDay.KEY, classType: CutoffDay },
      { type: BlConditionType.Equal, key: WhCode.KEY, classType: WhCode },
      { type: BlConditionType.Equal, key: ItemMakerCd.KEY, classType: ItemMakerCd },
      { type: BlConditionType.Equal, key: SearchItemPartsNumber.KEY, classType: SearchItemPartsNumber },
      { type: BlConditionType.Equal, key: SearchItemPartsName.KEY, classType: SearchItemPartsName },
      { type: BlConditionType.Equal, key: ProductCodeCondition.KEY, classType: ProductCodeCondition },
      { type: BlConditionType.Equal, key: ClientSessionIdCondition.KEY, classType: ClientSessionIdCondition },
    ]);
  }

  /**
   * 下書きモードを設定する
   * @param v 下書きモード
   */
  public setDocumentMode(v: string): void {
    this.documentMode = v;
  }

  /**
   * 下書きモードを取得する
   * @return 下書きモード
   */
  public getDocumentMode(): string {
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
   * @param salseSupplierMgtOrganization 組織選択
   * @return BlApiQueryParams
   */
  public makeQueryParameter(salseSupplierMgtOrganization): BlApiQueryParams {
    const apiQueryParameter = new BlApiQueryParams();
    const grp: BlSearchConditionGroup = this.and(
      ExportPatternCodeCondition.KEY,
      PurchaseSlipExportContentCondition.KEY,
      ProductCodeCondition.KEY,
      ClientSessionIdCondition.KEY,
    );

    // 「対象期間」が0:伝票日付 or 1:更新日付の場合
    if (this.getDocumentMode() === PurchaseSlipTargetPeriodDiv.SlipDate
      || this.getDocumentMode() === PurchaseSlipTargetPeriodDiv.UpdateDate) {
      const date = this.getDocumentMode() === PurchaseSlipTargetPeriodDiv.SlipDate
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
      const date = <PayRecordingDate>(this.conditionMap.get(PayRecordingDate.KEY));
      if (date.getValueS()) {
        grp.addCondition(date.getConditionS());
      }
    }

    const supplierMgtOrganizationCode = <SupplierMgtOrganizationCode>(this.conditionMap.get(SupplierMgtOrganizationCode.KEY));
    if (supplierMgtOrganizationCode.getValueS() && salseSupplierMgtOrganization === PurchaseSlipOrganizationSelect.PurchaseOrganization) {
      grp.addCondition(supplierMgtOrganizationCode.getConditionS());
    }
    const payOrganizationCode = <PayOrganizationCode>(this.conditionMap.get(PayOrganizationCode.KEY));
    if (payOrganizationCode.getValueS() && salseSupplierMgtOrganization === PurchaseSlipOrganizationSelect.PayOrganization) {
      grp.addCondition(payOrganizationCode.getConditionS());
    }
    const slipOrganizationCode = <SlipOrganizationCode>(this.conditionMap.get(SlipOrganizationCode.KEY));
    if (slipOrganizationCode.getValueS() && salseSupplierMgtOrganization === PurchaseSlipOrganizationSelect.PurchaseOrganization) {
      grp.addCondition(slipOrganizationCode.getConditionS());
    }
    const picEmployeeCode = <PicEmployeeCode>(this.conditionMap.get(PicEmployeeCode.KEY));
    if (picEmployeeCode.getValueS()) {
      grp.addCondition(picEmployeeCode.getConditionS());
    }
    if (picEmployeeCode.getValueE()) {
      grp.addCondition(picEmployeeCode.getConditionE());
    }
    const supplierCd = <SupplierCd>(this.conditionMap.get(SupplierCd.KEY));
    if (supplierCd.getValueS()) {
      grp.addCondition(supplierCd.getConditionS());
    }
    if (supplierCd.getValueE()) {
      grp.addCondition(supplierCd.getConditionE());
    }
    const payeeCode = <PayeeCode>(this.conditionMap.get(PayeeCode.KEY));
    if (payeeCode.getValueS()) {
      grp.addCondition(payeeCode.getConditionS());
    }
    if (payeeCode.getValueE()) {
      grp.addCondition(payeeCode.getConditionE());
    }
    const cutoffDay = <CutoffDay>(this.conditionMap.get(CutoffDay.KEY));
    if (cutoffDay.getValueS()) {
      grp.addCondition(cutoffDay.getConditionS());
    }
    const whCode = <WhCode>(this.conditionMap.get(WhCode.KEY));
    if (whCode.getValueS()) {
      grp.addCondition(whCode.getConditionS());
    }
    if (whCode.getValueE()) {
      grp.addCondition(whCode.getConditionE());
    }
    const itemMakerCd = <ItemMakerCd>(this.conditionMap.get(ItemMakerCd.KEY));
    if (itemMakerCd.getValueS()) {
      grp.addCondition(itemMakerCd.getConditionS());
    }
    if (itemMakerCd.getValueE()) {
      grp.addCondition(itemMakerCd.getConditionE());
    }
    const searchItemPartsNumber = <SearchItemPartsNumber>(this.conditionMap.get(SearchItemPartsNumber.KEY));
    if (searchItemPartsNumber.getValueS()) {
      grp.addCondition(searchItemPartsNumber.getConditionS());
    }
    const searchItemPartsName = <SearchItemPartsName>(this.conditionMap.get(SearchItemPartsName.KEY));
    if (searchItemPartsName.getValueS()) {
      grp.addCondition(searchItemPartsName.getConditionS());
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
  public setExportPatternCode(exportPatternCodeList: string[]): void {
    (<ExportPatternCodeCondition>(this.conditionMap.get(ExportPatternCodeCondition.KEY))).setValue(exportPatternCodeList);
  }

  /**
   * 仕入伝票情報出力内容を設定
   * @param purchaseSlipExportContentList 仕入伝票情報出力内容配列
   */
  public setPurchaseSlipExportContentList(purchaseSlipExportContentList: string[]): void {
    (<PurchaseSlipExportContentCondition>(this.conditionMap.get(PurchaseSlipExportContentCondition.KEY)))
      .setValue(purchaseSlipExportContentList);
  }

  /**
   * 組織コードを設定
   * @param organization 組織コード
   * @param salseSupplierMgtOrganization 組織選択コード
   */
  public setOrganizationCode(organization: string, salseSupplierMgtOrganization: string, productCode: string): void {
    if (salseSupplierMgtOrganization === '0') {
      if (productCode === ProductCode.Recycle) {
        (<SlipOrganizationCode>(this.conditionMap.get(
          SlipOrganizationCode.KEY))).setValue(organization);
      } else {
        (<SupplierMgtOrganizationCode>(this.conditionMap.get(
          SupplierMgtOrganizationCode.KEY))).setValue(organization);
      }
    } else {
      (<PayOrganizationCode>(this.conditionMap.get(
        PayOrganizationCode.KEY))).setValue(organization);
    }
  }

  /**
   * 担当者コード
   * @param picEmployeeCodeStart 担当者コード開始
   * @param picEmployeeCodeEnd 担当者コード終了
   */
  public setPicEmployeeCode(picEmployeeCodeStart: string, picEmployeeCodeEnd: string): void {
      (<PicEmployeeCode>(this.conditionMap.get(PicEmployeeCode.KEY))).setDate(picEmployeeCodeStart, picEmployeeCodeEnd);
  }

  /**
   * 仕入先コードを設定
   * @param payeeCodeStart 仕入先コード開始
   * @param payeeCodeEnd 仕入先コード終了
   * @param salseSupplier 仕入先コード選択
   */
  public setSupplierCd(payeeCodeStart: string, payeeCodeEnd: string, salseSupplier: string): void {
    if (salseSupplier === '0') {
      (<SupplierCd>(this.conditionMap.get(
        SupplierCd.KEY))).setDate(payeeCodeStart, payeeCodeEnd);
    } else {
      (<PayeeCode>(this.conditionMap.get(
        PayeeCode.KEY))).setDate(payeeCodeStart, payeeCodeEnd);
    }
  }

  /**
   * 締日を設定
   * @param cutoffDay
   */
  public setCutoffDay(cutoffDay: string): void {
    (<CutoffDay>(this.conditionMap.get(CutoffDay.KEY))).setValue(cutoffDay);
  }

  /**
   * 倉庫コードを設定
   * @param whCodeStart 倉庫コード開始
   * @param whCodeEnd 倉庫コード終了
   */
  public setWhCode(whCodeStart: string, whCodeEnd: string): void {
    (<WhCode>(this.conditionMap.get(WhCode.KEY))).setDate(whCodeStart, whCodeEnd);
  }

  /**
   * メーカーコードを設定
   * @param itemMakerCdStart メーカーコード開始
   * @param itemMakerCdEnd メーカーコード終了
   */
  public setItemMakerCd(itemMakerCdStart: string, itemMakerCdEnd: string): void {
    (<ItemMakerCd>(this.conditionMap.get(ItemMakerCd.KEY))).setDate(itemMakerCdStart, itemMakerCdEnd);
  }

  /**
   * 品番を設定
   * @param partsNumber
   */
  public setPartsNumber(partsNumber: string): void {
      (<SearchItemPartsNumber>(this.conditionMap.get( SearchItemPartsNumber.KEY))).setValue(partsNumber);
  }

  /**
   * 品名を設定
   * @param partsName
   */
  public setPartsName(partsName: string): void {
      (<SearchItemPartsName>(this.conditionMap.get(SearchItemPartsName.KEY))).setValue(partsName);
  }

  /**
   * 日付を設定
   * @param dateStart 開始日
   * @param dateEnd 終了日
   * @param targetPeriod 伝票日付あるいは更新日付あるいは支払締日を設定する条件
   */
  public setDate(dateStart: string, dateEnd: string, targetPeriod: string): void {
    if (targetPeriod === '0') {
      (<SlipStandardDateCondition>(this.conditionMap.get(SlipStandardDateCondition.KEY))).setDate(dateStart, dateEnd);
    } else if (targetPeriod === '1') {
      (<UpdateDateTimeCondition>(this.conditionMap.get(UpdateDateTimeCondition.KEY))).setDate(dateStart, dateEnd);
    } else {
      (<PayRecordingDate>(this.conditionMap.get(PayRecordingDate.KEY))).setValue(dateStart);
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
