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

/**
 * 在庫出力条件
 */
class ExportStockCondition extends BlSearchCondition {
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
class ProductCodeCondition extends ExportStockCondition {
  static readonly KEY = 'productCode';
}

/**
 * 出力パターン
 */
class ExportPatternCodeListCondition extends ExportStockCondition {
  static readonly KEY = 'exportPatternCodeList';
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
 * 対象期間の日付
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
  public setDate( dateStart: string, dateEnd: string ): void {
    this.dateS.setValue((_isEmpty(dateStart) || DateTimeUtils.initial.iso8601.date === dateStart) ? undefined : dateStart);
    this.dateE.setValue((_isEmpty(dateEnd) || DateTimeUtils.initial.iso8601.date === dateEnd) ? undefined : dateEnd);
  }
}

/**
 * 品番
 */
class SearchItemPartsNumberCondition extends ExportStockCondition {
  static readonly KEY = 'searchItemPartsNumber';
}

/**
 * 品名
 */
class SearchItemPartsNameCondition extends ExportStockCondition {
  static readonly KEY = 'searchItemPartsName';
}

/**
 * 組織コード
 */
class WhOrganizationCodeCondition extends ExportStockCondition {
  static readonly KEY = 'whOrganizationCode';
}

/**
 * 倉庫コード
 */
abstract class WhCodeContion extends BlSearchCondition {
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
   * 倉庫コード設定
   * @param whCodeStart 倉庫コード開始
   * @param whCodeEnd 倉庫コード終了
   */
  abstract setWhCode(whCodeStart: string, whCodeEnd: string): void;
}

/**
 * 倉庫コード
 */
class WhCodeCondition extends WhCodeContion {
  static readonly KEY = 'whCode';

  constructor(def?: BlSearchConditionDef) {
    if (def) {
      super(def);
    } else {
      super({ key: WhCodeCondition.KEY });
    }
  }

  /**
   * 倉庫コード設定
   * @param whCodeStart 倉庫コード開始
   * @param whCodeEnd 倉庫コード終了
   */
  public setWhCode(whCodeStart: string, whCodeEnd: string): void {
    this.codeS.setValue((_isEmpty(whCodeStart)) ? undefined : whCodeStart);
    this.codeE.setValue((_isEmpty(whCodeEnd)) ? undefined : whCodeEnd);
  }
}

/**
 * 棚番
 */
abstract class ShelfNumContion extends BlSearchCondition {
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
   * 棚番
   * @param shelfNumStart 棚番開始
   * @param shelfNumEnd 棚番終了
   */
  abstract setShelfNum(shelfNumStart: string, shelfNumEnd: string): void;
}

/**
 * 棚番
 */
class ShelfNumCondition extends ShelfNumContion {
  static readonly KEY = 'shelfNum';

  constructor(def?: BlSearchConditionDef) {
    if (def) {
      super(def);
    } else {
      super({ key: ShelfNumCondition.KEY });
    }
  }

  /**
   * 棚番
   * @param shelfNumStart 棚番開始
   * @param shelfNumEnd 棚番終了
   */
  public setShelfNum(shelfNumStart: string, shelfNumEnd: string): void {
    this.codeS.setValue((_isEmpty(shelfNumStart)) ? undefined : shelfNumStart);
    this.codeE.setValue((_isEmpty(shelfNumEnd)) ? undefined : shelfNumEnd);
  }
}

/**
 * 仕入先コード
 */
abstract class SupplierCdContion extends BlSearchCondition {
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
   * 仕入先コード設定
   * @param supplierCdStart 仕入先コード開始
   * @param supplierCdEnd 仕入先コード終了
   */
  abstract setSupplierCd(supplierCdStart: string, supplierCdEnd: string): void;
}

/**
 * 仕入先コード
 */
class SupplierCdCondition extends SupplierCdContion {
  static readonly KEY = 'supplierCd';

  constructor(def?: BlSearchConditionDef) {
    if (def) {
      super(def);
    } else {
      super({ key: SupplierCdCondition.KEY });
    }
  }

  /**
   * 仕入先コード設定
   * @param supplierCdStart 仕入先コード開始
   * @param supplierCdEnd 仕入先コード終了
   */
  public setSupplierCd(supplierCdStart: string, supplierCdEnd: string): void {
    this.codeS.setValue((_isEmpty(supplierCdStart)) ? undefined : supplierCdStart);
    this.codeE.setValue((_isEmpty(supplierCdEnd)) ? undefined : supplierCdEnd);
  }
}

/**
 * メーカーコード
 */
abstract class ItemMakerCdContion extends BlSearchCondition {
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
   * メーカーコード設定
   * @param itemMakerCdStart メーカーコード開始
   * @param itemMakerCdEnd メーカーコード終了
   */
  abstract setItemMakerCd(itemMakerCdStart: string, itemMakerCdEnd: string): void;
}

/**
 * メーカーコード
 */
class ItemMakerCdCondition extends ItemMakerCdContion {
  static readonly KEY = 'itemMakerCd';

  constructor(def?: BlSearchConditionDef) {
    if (def) {
      super(def);
    } else {
      super({ key: ItemMakerCdCondition.KEY });
    }
  }

  /**
   * メーカーコード設定
   * @param itemMakerCdStart メーカーコード開始
   * @param itemMakerCdEnd メーカーコード終了
   */
  public setItemMakerCd(itemMakerCdStart: string, itemMakerCdEnd: string): void {
    this.codeS.setValue((_isEmpty(itemMakerCdStart)) ? undefined : itemMakerCdStart);
    this.codeE.setValue((_isEmpty(itemMakerCdEnd)) ? undefined : itemMakerCdEnd);
  }
}

/**
 * 商品大分類コード
 */
abstract class ItemLClassCdContion extends BlSearchCondition {
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
   * 商品大分類コード設定
   * @param itemLClassCdStart 商品大分類コード開始
   * @param itemLClassCdEnd 商品大分類コード終了
   */
  abstract setItemLClassCd(itemLClassCdStart: string, itemLClassCdEnd: string): void;
}

/**
 * 商品大分類コード
 */
class ItemLClassCdCondition extends ItemLClassCdContion {
  static readonly KEY = 'itemLClassCd';

  constructor(def?: BlSearchConditionDef) {
    if (def) {
      super(def);
    } else {
      super({ key: ItemLClassCdCondition.KEY });
    }
  }

  /**
   * 商品大分類コード設定
   * @param itemLClassCdStart 商品大分類コード開始
   * @param itemLClassCdEnd 商品大分類コード終了
   */
  public setItemLClassCd(itemLClassCdStart: string, itemLClassCdEnd: string): void {
    this.codeS.setValue((_isEmpty(itemLClassCdStart)) ? undefined : itemLClassCdStart);
    this.codeE.setValue((_isEmpty(itemLClassCdEnd)) ? undefined : itemLClassCdEnd);
  }
}

/**
 * 商品中分類コード
 */
abstract class ItemMClassCdContion extends BlSearchCondition {
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
   * 商品中分類コード設定
   * @param itemMClassCdStart 商品中分類コード開始
   * @param itemMClassCdEnd 商品中分類コード終了
   */
  abstract setItemMClassCd(itemMClassCdStart: string, itemMClassCdEnd: string): void;
}

/**
 * 商品中分類コード
 */
class ItemMClassCdCondition extends ItemMClassCdContion {
  static readonly KEY = 'itemMClassCd';

  constructor(def?: BlSearchConditionDef) {
    if (def) {
      super(def);
    } else {
      super({ key: ItemMClassCdCondition.KEY });
    }
  }

  /**
   * 商品中分類コード設定
   * @param itemMClassCdStart 商品中分類コード開始
   * @param itemMClassCdEnd 商品中分類コード終了
   */
  public setItemMClassCd(itemMClassCdStart: string, itemMClassCdEnd: string): void {
    this.codeS.setValue((_isEmpty(itemMClassCdStart)) ? undefined : itemMClassCdStart);
    this.codeE.setValue((_isEmpty(itemMClassCdEnd)) ? undefined : itemMClassCdEnd);
  }
}

/**
 * グループコード
 */
abstract class BlCdGroupCodeContion extends BlSearchCondition {
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
   * グループコード設定
   * @param blCdGroupCodeStart グループコード開始
   * @param blCdGroupCodeEnd グループコード終了
   */
  abstract setBlCdGroupCode(blCdGroupCodeStart: string, blCdGroupCodeEnd: string): void;
}

/**
 * グループコード
 */
class BlCdGroupCodeCondition extends BlCdGroupCodeContion {
  static readonly KEY = 'blCdGroupCode';

  constructor(def?: BlSearchConditionDef) {
    if (def) {
      super(def);
    } else {
      super({ key: BlCdGroupCodeCondition.KEY });
    }
  }

  /**
   * グループコード設定
   * @param blCdGroupCodeStart グループコード開始
   * @param blCdGroupCodeEnd グループコード終了
   */
  public setBlCdGroupCode(blCdGroupCodeStart: string, blCdGroupCodeEnd: string): void {
    this.codeS.setValue((_isEmpty(blCdGroupCodeStart)) ? undefined : blCdGroupCodeStart);
    this.codeE.setValue((_isEmpty(blCdGroupCodeEnd)) ? undefined : blCdGroupCodeEnd);
  }
}

/**
 * BLコード
 */
abstract class BlPrtsCdContion extends BlSearchCondition {
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
   * BLコード設定
   * @param blPrtsCdStart 開始
   * @param blPrtsCdEnd 終了
   */
  abstract setBlPrtsCd(blPrtsCdStart: string, blPrtsCdEnd: string): void;
}

/**
 * BLコード
 */
class BlPrtsCdCondition extends BlPrtsCdContion {
  static readonly KEY = 'blPrtsCd';

  constructor(def?: BlSearchConditionDef) {
    if (def) {
      super(def);
    } else {
      super({ key: BlPrtsCdCondition.KEY });
    }
  }

  /**
   * BLコード設定
   * @param blPrtsCdStart 開始
   * @param blPrtsCdEnd 終了
   */
  public setBlPrtsCd(blPrtsCdStart: string, blPrtsCdEnd: string): void {
    this.codeS.setValue((_isEmpty(blPrtsCdStart)) ? undefined : blPrtsCdStart);
    this.codeE.setValue((_isEmpty(blPrtsCdEnd)) ? undefined : blPrtsCdEnd);
  }
}

/**
 * clients session id
 */
class ClientSessionIdCondition extends ExportStockCondition {
  static readonly KEY = 'clientSessionId';
}

/**  他の条件項目設定  */
/**  検索条件  */
export class ExportStockConditionManager extends BlSearchConditionManager {
  constructor(
  ) {
    super([
      // QueryStrings ID = 1
      { type: BlConditionType.In, key: ExportPatternCodeListCondition.KEY, classType: ExportPatternCodeListCondition },
      // QueryStrings ID = 2～3
      { key: UpdateDateTimeCondition.KEY, classType: UpdateDateTimeCondition },
      // QueryStrings ID = 4
      { type: BlConditionType.Equal, key: WhOrganizationCodeCondition.KEY, classType: WhOrganizationCodeCondition },
      // QueryStrings ID = 5～6
      { key: WhCodeCondition.KEY, classType: WhCodeCondition },
      // QueryStrings ID = 7～8
      { key: ShelfNumCondition.KEY, classType: ShelfNumCondition },
      // QueryStrings ID = 9～10
      { key: SupplierCdCondition.KEY, classType: SupplierCdCondition },
      // QueryStrings ID = 11～12
      { key: ItemMakerCdCondition.KEY, classType: ItemMakerCdCondition },
      // QueryStrings ID = 13～14
      { key: ItemLClassCdCondition.KEY, classType: ItemLClassCdCondition },
      // QueryStrings ID = 15～16
      { key: ItemMClassCdCondition.KEY, classType: ItemMClassCdCondition },
      // QueryStrings ID = 17～18
      { key: BlCdGroupCodeCondition.KEY, classType: BlCdGroupCodeCondition },
      // QueryStrings ID = 19～20
      { key: BlPrtsCdCondition.KEY, classType: BlPrtsCdCondition },
      // QueryStrings ID = 21
      { type: BlConditionType.Match, key: SearchItemPartsNumberCondition.KEY, classType: SearchItemPartsNumberCondition },
      // QueryStrings ID = 22
      { type: BlConditionType.Match, key: SearchItemPartsNameCondition.KEY, classType: SearchItemPartsNameCondition },
      // QueryStrings ID = 23
      { type: BlConditionType.In, key: ProductCodeCondition.KEY, classType: ProductCodeCondition },
      // QueryStrings ID = 24
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
   * @param size 結果取得件数
   * @param position 結果取得位置
   * @return BlApiQueryParams
   */
  public makeQueryParameter(): BlApiQueryParams {
    const apiQueryParameter = new BlApiQueryParams();
    const grp: BlSearchConditionGroup = this.and(
      // QueryStrings ID = 1
      ExportPatternCodeListCondition.KEY,
      // QueryStrings ID = 2～3
      UpdateDateTimeCondition.KEY,
      // QueryStrings ID = 4
      WhOrganizationCodeCondition.KEY,
      // QueryStrings ID = 5～6
      WhCodeCondition.KEY,
      // QueryStrings ID = 7～8
      ShelfNumCondition.KEY,
      // QueryStrings ID = 9～10
      SupplierCdCondition.KEY,
      // QueryStrings ID = 11～12
      ItemMakerCdCondition.KEY,
      // QueryStrings ID = 13～14
      ItemLClassCdCondition.KEY,
      // QueryStrings ID = 15～16
      ItemMClassCdCondition.KEY,
      // QueryStrings ID = 17～18
      BlCdGroupCodeCondition.KEY,
      // QueryStrings ID = 19～20
      BlPrtsCdCondition.KEY,
      // QueryStrings ID = 21
      SearchItemPartsNumberCondition.KEY,
      // QueryStrings ID = 22
      SearchItemPartsNameCondition.KEY,
      // QueryStrings ID = 23
      ProductCodeCondition.KEY,
      // QueryStrings ID = 24
      ClientSessionIdCondition.KEY
    );
    // QueryStrings ID = 2～3
    const date = <UpdateDateTimeCondition>(this.conditionMap.get(UpdateDateTimeCondition.KEY));

    if (date.getValueS()) {
      grp.addCondition(date.getConditionS());
    }
    if (date.getValueE()) {
      grp.addCondition(date.getConditionE());
    }

    // QueryStrings ID = 5～6
    const whCode = <WhCodeCondition>(this.conditionMap.get(WhCodeCondition.KEY));
    if (whCode.getValueCodeS()) {
      grp.addCondition(whCode.getConditionS());
    }
    if (whCode.getValueCodeE()) {
      grp.addCondition(whCode.getConditionE());
    }

    // QueryStrings ID = 7～8
    const shelfNum = <ShelfNumCondition>(this.conditionMap.get(ShelfNumCondition.KEY));
    if (shelfNum.getValueCodeS()) {
      grp.addCondition(shelfNum.getConditionS());
    }
    if (shelfNum.getValueCodeE()) {
      grp.addCondition(shelfNum.getConditionE());
    }

    // QueryStrings ID = 9～10
    const supplierCd = <SupplierCdCondition>(this.conditionMap.get(SupplierCdCondition.KEY));
    if (supplierCd.getValueCodeS()) {
      grp.addCondition(supplierCd.getConditionS());
    }
    if (supplierCd.getValueCodeE()) {
      grp.addCondition(supplierCd.getConditionE());
    }

    // QueryStrings ID = 11～12
    const itemMakerCd = <ItemMakerCdCondition>(this.conditionMap.get(ItemMakerCdCondition.KEY));
    if (itemMakerCd.getValueCodeS()) {
      grp.addCondition(itemMakerCd.getConditionS());
    }
    if (itemMakerCd.getValueCodeE()) {
      grp.addCondition(itemMakerCd.getConditionE());
    }

    // QueryStrings ID = 13～14
    const itemLClassCd = <ItemLClassCdCondition>(this.conditionMap.get(ItemLClassCdCondition.KEY));
    if (itemLClassCd.getValueCodeS()) {
      grp.addCondition(itemLClassCd.getConditionS());
    }
    if (itemLClassCd.getValueCodeE()) {
      grp.addCondition(itemLClassCd.getConditionE());
    }

    // QueryStrings ID = 15～16
    const itemMClassCd = <ItemMClassCdCondition>(this.conditionMap.get(ItemMClassCdCondition.KEY));
    if (itemMClassCd.getValueCodeS()) {
      grp.addCondition(itemMClassCd.getConditionS());
    }
    if (itemMClassCd.getValueCodeE()) {
      grp.addCondition(itemMClassCd.getConditionE());
    }

    // QueryStrings ID = 17～18
    const blCdGroupCode = <BlCdGroupCodeCondition>(this.conditionMap.get(BlCdGroupCodeCondition.KEY));
    if (blCdGroupCode.getValueCodeS()) {
      grp.addCondition(blCdGroupCode.getConditionS());
    }
    if (blCdGroupCode.getValueCodeE()) {
      grp.addCondition(blCdGroupCode.getConditionE());
    }

    // QueryStrings ID = 19～20
    const blPrtsCd = <BlPrtsCdCondition>(this.conditionMap.get(BlPrtsCdCondition.KEY));
    if (blPrtsCd.getValueCodeS()) {
      grp.addCondition(blPrtsCd.getConditionS());
    }
    if (blPrtsCd.getValueCodeE()) {
      grp.addCondition(blPrtsCd.getConditionE());
    }

    const kanas: BlSearchConditionGroup[] = new Array<BlSearchConditionGroup>();
    kanas.push(grp);
    // グループ指定しながら文字列を作成する
    apiQueryParameter.setConditionString(kanas[0].toConditionString());
    return apiQueryParameter;
  }

  /**
   * テキスト出力情報の一覧を設定
   * @param exportPatternCodeList テキスト出力情報配列
   */
  public setExportPatternCodeList(exportPatternCodeList: string[]): void {
    (<ExportPatternCodeListCondition>(this.conditionMap.get(ExportPatternCodeListCondition.KEY))).setValue(exportPatternCodeList);
  }

  /**
   * 日付の設定
   * @param updateDateTimeStart 開始日
   * @param updateDateTimeEnd 終了日
   * @param draft 下書き状態
   */
  public setUpdateDateTime(updateDateTimeStart: string, updateDateTimeEnd: string): void {
    (<UpdateDateTimeCondition>(this.conditionMap.get(UpdateDateTimeCondition.KEY))).setDate(updateDateTimeStart, updateDateTimeEnd);
  }

  /**
   * 組織
   * @param whOrganizationCode 組織
   */
  public setWhOrganizationCode(whOrganizationCode: string): void {
    (<WhOrganizationCodeCondition>(this.conditionMap.get(WhOrganizationCodeCondition.KEY))).setValue(whOrganizationCode);
  }

  /**
   * 倉庫コードの設定
   * @param whCodeStart 倉庫コード開始
   * @param whCodeEnd 倉庫コード終了
   */
  public setWhCode(whCodeStart: string, whCodeEnd: string): void {
    (<WhCodeCondition>(this.conditionMap.get(WhCodeCondition.KEY))).setWhCode(whCodeStart, whCodeEnd);
  }

  /**
   * 棚番の設定
   * @param shelfNumStart 棚番開始
   * @param shelfNumEnd 棚番終了
   */
  public setShelfNum(shelfNumStart: string, shelfNumEnd: string): void {
    (<ShelfNumCondition>(this.conditionMap.get(ShelfNumCondition.KEY))).setShelfNum(shelfNumStart, shelfNumEnd);
  }

  /**
   * 仕入先コードの設定
   * @param supplierCdStart 仕入先コード開始
   * @param supplierCdEnd 仕入先コード終了
   */
  public setSupplierCd(supplierCdStart: string, supplierCdEnd: string): void {
    (<SupplierCdCondition>(this.conditionMap.get(SupplierCdCondition.KEY))).setSupplierCd(supplierCdStart, supplierCdEnd);
  }

  /**
   * メーカーコードの設定
   * @param itemMakerCdStart メーカーコード開始
   * @param itemMakerCdEnd メーカーコード終了
   */
  public setItemMakerCd(itemMakerCdStart: string, itemMakerCdEnd: string): void {
    (<ItemMakerCdCondition>(this.conditionMap.get(ItemMakerCdCondition.KEY))).setItemMakerCd(itemMakerCdStart, itemMakerCdEnd);
  }

  /**
   * 商品大分類コードの設定
   * @param itemLClassCdStart メーカーコード開始
   * @param itemLClassCdEnd メーカーコード終了
   */
  public setItemLClassCd(itemLClassCdStart: string, itemLClassCdEnd: string): void {
    (<ItemLClassCdCondition>(this.conditionMap.get(ItemLClassCdCondition.KEY))).setItemLClassCd(itemLClassCdStart, itemLClassCdEnd);
  }

  /**
   * 商品中分類コードの設定
   * @param itemMClassCdStart 商品中分類コード開始
   * @param itemMClassCdEnd 商品中分類コード終了
   */
  public setItemMClassCd(itemMClassCdStart: string, itemMClassCdEnd: string): void {
    (<ItemMClassCdCondition>(this.conditionMap.get(ItemMClassCdCondition.KEY))).setItemMClassCd(itemMClassCdStart, itemMClassCdEnd);
  }

  /**
   * グループコードの設定
   * @param blCdGroupCodeStart グループコード開始
   * @param blCdGroupCodeEnd グループコード終了
   */
  public setBlCdGroupCode(blCdGroupCodeStart: string, blCdGroupCodeEnd: string): void {
    (<BlCdGroupCodeCondition>(this.conditionMap.get(BlCdGroupCodeCondition.KEY))).setBlCdGroupCode(blCdGroupCodeStart, blCdGroupCodeEnd);
  }

  /**
   * BLコードの設定
   * @param blPrtsCdStart BLコード開始
   * @param blPrtsCdEnd BLコード終了
   */
  public setBlPrtsCd(blPrtsCdStart: string, blPrtsCdEnd: string): void {
    (<BlPrtsCdCondition>(this.conditionMap.get(BlPrtsCdCondition.KEY))).setBlPrtsCd(blPrtsCdStart, blPrtsCdEnd);
  }

  /**
   * 検索条件商品品番
   * @param searchItemPartsNumber
   */
  public setSearchItemPartsNumber(searchItemPartsNumber: string): void {
    (<SearchItemPartsNumberCondition>(this.conditionMap.get(SearchItemPartsNumberCondition.KEY))).setValue(searchItemPartsNumber);
  }

  /**
   * 検索条件商品名称
   * @param searchItemPartsName
   */
  public setSearchItemPartsName(searchItemPartsName: string): void {
    (<SearchItemPartsNameCondition>(this.conditionMap.get(SearchItemPartsNameCondition.KEY))).setValue(searchItemPartsName);
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
   * @param clientSessionId ユニークId
   */
  public setClientSessionId(clientSessionId: string): void {
    (<ClientSessionIdCondition>(this.conditionMap.get(ClientSessionIdCondition.KEY))).setValue(clientSessionId);
  }

}
