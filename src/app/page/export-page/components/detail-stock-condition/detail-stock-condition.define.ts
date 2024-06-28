
/**
 * 在庫詳細条件
 */
export interface IDetailStockCondition {
  /** 倉庫コード(開始) */
  whCodeS: string;
  /** 倉庫コード(終了) */
  whCodeE: string;
  /** 棚番(開始) */
  shelfNumS: string;
  /** 棚番(終了) */
  shelfNumE: string;
  /** 仕入先コード(開始) */
  supplierCdS: string;
  /** 仕入先コード(終了) */
  supplierCdE: string;
  /** 商品メーカーコード(開始) */
  itemMakerCdS: string;
  /** 商品メーカーコード(終了) */
  itemMakerCdE: string;
  /** 商品大分類(開始) */
  itemLClassCdS: string;
  /** 商品大分類(終了) */
  itemLClassCdE: string;
  /** 商品中分類(開始) */
  itemMClassCdS: string;
  /** 商品中分類(終了) */
  itemMClassCdE: string;
  /** BLコードグループコード(開始) */
  blCdGroupCodeS: string;
  /** BLコードグループコード(終了) */
  blCdGroupCodeE: string;
  /** BL部品コード(開始) */
  blPrtsCdS: string;
  /** BL部品コード(終了) */
  blPrtsCdE: string;
  /** 検索品番 */
  searchItemPartsNumber: string;
  /** 検索品名 */
  searchItemPartsName: string;
}
