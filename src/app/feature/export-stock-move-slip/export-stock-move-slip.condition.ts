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
 * 在庫移動伝票出力条件
 */
class ExportStockMoveSlipCondition extends BlSearchCondition {
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
 * 項目（ct）設定
 */
abstract class DateCtCondition extends BlSearchCondition {
  /** 項目 */
  protected dateS: BlSearchCondition;

  constructor(def: BlSearchConditionDef) {
    super(def);
    this.dateS = new BlSearchCondition(def);
    this.dateS.setType(BlConditionType.Match);
  }

  /**
   * 項目を取得する
   * @return 項目
   */
  public getValueS(): string | number | (string | number)[] {
    return this.dateS.getValue();
  }

  /**
   * 項目の検索条件を取得する
   * @return 項目コンディション
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
   * 項目設定
   * @param s 項目
   */
  abstract setValue(s: string): void;
}


/**
 *  出荷日付のパラメータを管理
 */
class ShippingDateCondition extends DateCondition {
  static readonly KEY = 'shippingDate';

  constructor(def?: BlSearchConditionDef) {
    if (def) {
      super(def);
    } else {
      super({ key: ShippingDateCondition.KEY });
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
 * 入荷日付のパラメータを管理
 */
class StorageDateCondition extends DateCondition {
  static readonly KEY = 'storageDate';

  constructor(def?: BlSearchConditionDef) {
    if (def) {
      super(def);
    } else {
      super({ key: StorageDateCondition.KEY });
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
 * テキスト出力パターンのコード一覧のパラメータを管理
 */
class ExportPatternCodeCondition extends ExportStockMoveSlipCondition {
  static readonly KEY = 'exportPatternCodeList';
}

/**
 * プロダクトコード
 */
class ProductCodeCondition extends ExportStockMoveSlipCondition {
  static readonly KEY = 'productCode';
}

/**
 * 出力内容を管理
 */
class ExportStockMoveSlipOutputCondition extends ExportStockMoveSlipCondition {
  static readonly KEY = 'stockMoveExportContentList';
}

/**
 * 出庫組織を管理
 */
class ShippingOrganizationCode extends ExportStockMoveSlipCondition {
  static readonly KEY = 'shippingOrganizationCode';
}

/**
 * 入庫組織を管理
 */
class EnteringOrganizationCode extends ExportStockMoveSlipCondition {
  static readonly KEY = 'enteringOrganizationCode';
}

/**
 * clientSessionIdを管理
 */
class ClientSessionIdCondition extends ExportStockMoveSlipCondition {
  static readonly KEY = 'clientSessionId';
}

/**
 * 出庫倉庫コードを管理
 */
class ShippingWhCode extends DateCondition {
  static readonly KEY = 'shippingWhCode';

  constructor(def?: BlSearchConditionDef) {
    if (def) {
      super(def);
    } else {
      super({ key: ShippingWhCode.KEY });
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
 * 入庫倉庫コードを管理
 */
class EnteringWhCode extends DateCondition {
  static readonly KEY = 'enteringWhCode';

  constructor(def?: BlSearchConditionDef) {
    if (def) {
      super(def);
    } else {
      super({ key: EnteringWhCode.KEY });
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
export class ExportStockMoveSlipConditionManager extends BlSearchConditionManager {
  private targetPeriod = PurchaseSlipTargetPeriodDiv.SlipDate;
  constructor(
  ) {
    super([
      { type: BlConditionType.In, key: ProductCodeCondition.KEY, classType: ProductCodeCondition },
      { type: BlConditionType.In, key: ExportPatternCodeCondition.KEY, classType: ExportPatternCodeCondition },
      { type: BlConditionType.In, key: ExportStockMoveSlipOutputCondition.KEY, classType: ExportStockMoveSlipOutputCondition },
      { key: ShippingDateCondition.KEY, classType: ShippingDateCondition },
      { key: StorageDateCondition.KEY, classType: StorageDateCondition },
      { key: UpdateDateTimeCondition.KEY, classType: UpdateDateTimeCondition },
      { type: BlConditionType.Equal, key: ShippingOrganizationCode.KEY, classType: ShippingOrganizationCode },
      { type: BlConditionType.Equal, key: EnteringOrganizationCode.KEY, classType: EnteringOrganizationCode },
      { key: ShippingWhCode.KEY, classType: ShippingWhCode },
      { key: EnteringWhCode.KEY, classType: EnteringWhCode },
      { key: PicEmployeeCode.KEY, classType: PicEmployeeCode },
      { key: ItemMakerCd.KEY, classType: ItemMakerCd },
      { type: BlConditionType.Match, key: SearchItemPartsNumber.KEY, classType: SearchItemPartsNumber },
      { type: BlConditionType.Match, key: SearchItemPartsName.KEY, classType: SearchItemPartsName },
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
      ExportStockMoveSlipOutputCondition.KEY,
      ShippingOrganizationCode.KEY,
      EnteringOrganizationCode.KEY,
    );
    if (this.getTargetPeriod() === PurchaseSlipTargetPeriodDiv.SlipDate) {
      const shippingDateCondition = <ShippingDateCondition>(this.conditionMap.get(ShippingDateCondition.KEY));
      if (shippingDateCondition.getValueS()) {
        grp.addCondition(shippingDateCondition.getConditionS());
      }
      if (shippingDateCondition.getValueE()) {
        grp.addCondition(shippingDateCondition.getConditionE());
      }
    }
    if (this.getTargetPeriod() === PurchaseSlipTargetPeriodDiv.UpdateDate) {
      const storageDateCondition = <StorageDateCondition>(this.conditionMap.get(StorageDateCondition.KEY));
      if (storageDateCondition.getValueS()) {
        grp.addCondition(storageDateCondition.getConditionS());
      }
      if (storageDateCondition.getValueE()) {
        grp.addCondition(storageDateCondition.getConditionE());
      }
    }
    if (this.getTargetPeriod() === PurchaseSlipTargetPeriodDiv.PayCutoffDate) {
      const updateDateTimeCondition = <UpdateDateTimeCondition>(this.conditionMap.get(UpdateDateTimeCondition.KEY));
      if (updateDateTimeCondition.getValueS()) {
        grp.addCondition(updateDateTimeCondition.getConditionS());
      }
      if (updateDateTimeCondition.getValueE()) {
        grp.addCondition(updateDateTimeCondition.getConditionE());
      }
    }
    const shippingWhCode = <ShippingWhCode>(this.conditionMap.get(ShippingWhCode.KEY));
    if (shippingWhCode.getValueS()) {
      grp.addCondition(shippingWhCode.getConditionS());
    }
    if (shippingWhCode.getValueE()) {
      grp.addCondition(shippingWhCode.getConditionE());
    }
    const enteringWhCode = <EnteringWhCode>(this.conditionMap.get(EnteringWhCode.KEY));
    if (enteringWhCode.getValueS()) {
      grp.addCondition(enteringWhCode.getConditionS());
    }
    if (enteringWhCode.getValueE()) {
      grp.addCondition(enteringWhCode.getConditionE());
    }
    const picEmployeeCode = <PicEmployeeCode>(this.conditionMap.get(PicEmployeeCode.KEY));
    if (picEmployeeCode.getValueS()) {
      grp.addCondition(picEmployeeCode.getConditionS());
    }
    if (picEmployeeCode.getValueE()) {
      grp.addCondition(picEmployeeCode.getConditionE());
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
* @param a stockMoveExportContentList 出力内容配列
*/
  public setStockMoveExportContentList(stockMoveExportContentList: string[]): void {
    (<ExportStockMoveSlipOutputCondition>(this.conditionMap.get(ExportStockMoveSlipOutputCondition.KEY)))
    .setValue(stockMoveExportContentList);
  }

  /**
   * 対象期間を設定する
   * @param a 対象期間
   */
  public setTargetPeriod(v: string): void {
    this.targetPeriod = v;
  }

  /**
   * 対象期間を取得する
   * @return 対象期間
   */
  public getTargetPeriod(): string {
    return this.targetPeriod;
  }

  /**
   * 出庫組織コードを設定
   * @param shippingOrganizationCode
   */
  public setShippingOrganizationCode(v: string): void {
    (<ShippingOrganizationCode>(this.conditionMap.get(ShippingOrganizationCode.KEY))).setValue(v);
  }

  /**
   * 入庫組織コードを設定
   * @param enteringOrganizationCode
   */
  public setEnteringOrganizationCode(v: string): void {
    (<EnteringOrganizationCode>(this.conditionMap.get(EnteringOrganizationCode.KEY))).setValue(v);
  }

  /**
   *出庫倉庫コードを設定
   * @param s
   * @param e
   */
  public setShippingWhCode(s: string, e: string): void {
    (<ShippingWhCode>(this.conditionMap.get(ShippingWhCode.KEY))).setDate(s, e);
}

  /**
   * 入庫倉庫コードを設定
   * @param enteringWhCodeStart 入庫倉庫コード開始
   * @param enteringWhCodeEnd 入庫倉庫コード終了
   */
  public setEnteringWhCode(s: string, e: string): void {
    (<EnteringWhCode>(this.conditionMap.get(EnteringWhCode.KEY))).setDate(s, e);
}

  /**
   * 担当者コードを設定
   * @param s
   * @param e
   */
  public setPicEmployeeCode(s: string, e: string): void {
      (<PicEmployeeCode>(this.conditionMap.get(PicEmployeeCode.KEY))).setDate(s, e);
  }

  /**
   * メーカーコードを設定
   * @param s
   * @param e
   * @param v
   */
  public setItemMakerCd(s: string, e: string): void {
    (<ItemMakerCd>(this.conditionMap.get(ItemMakerCd.KEY))).setDate(s, e);
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
   * 日付の設定
   * @param startDate 開始日
   * @param endDate 終了日
   * @param targetPeriod 対象期間
   */
  public setDate(startDate: string, endDate: string, t: string): void {
    if (t === '0') {
      (<ShippingDateCondition>(this.conditionMap.get(ShippingDateCondition.KEY))).setDate(startDate, endDate);
    } else if (t === '1') {
      (<StorageDateCondition>(this.conditionMap.get(StorageDateCondition.KEY))).setDate(startDate, endDate);
    } else {
      (<UpdateDateTimeCondition>(this.conditionMap.get(UpdateDateTimeCondition.KEY))).setDate(startDate, endDate);
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
