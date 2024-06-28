
/**
 * 在庫移動伝票出力条件
 */
export interface IExportStockMoveSlipConditionInput {
  /** 出荷倉庫コード(開始) */
  shippingWhCodeStart: string;
  /** 出荷倉庫コード(終了) */
  shippingWhCodeEnd: string;
  /** 入荷倉庫コード(開始) */
  enteringWhCodeStart: string;
  /** 入荷倉庫コード(終了) */
  enteringWhCodeEnd: string;
  /** 担当者コード(開始) */
  picEmployeeCodeStart: string;
  /** 担当者コード(開始) */
  picEmployeeCodeEnd: string;
  /** 商品メーカーコード(開始) */
  itemMakerCdStart: string;
  /** 商品メーカーコード(終了) */
  itemMakerCdEnd: string;
  /** 品番 */
  partsNumber: string;
  /** 品名 */
  partsName: string;
}

/**
 * 在庫移動詳細条件
 */
export interface IDetailStockMoveCondition {
  /** 出荷倉庫コード(開始) */
  shippingWhCodeStart: string;
  /** 出荷倉庫コード(終了) */
  shippingWhCodeEnd: string;
  /** 入荷倉庫コード(開始) */
  enteringWhCodeStart: string;
  /** 入荷倉庫コード(終了) */
  enteringWhCodeEnd: string;
  /** 担当者コード(開始) */
  picEmployeeCodeStart: string;
  /** 担当者コード(終了) */
  picEmployeeCodeEnd: string;
  /** 商品メーカーコード(開始) */
  itemMakerCdStart: string;
  /** 商品メーカーコード(終了) */
  itemMakerCdEnd: string;
  /** 品番 */
  partsNumber: string;
  /** 品名 */
  partsName: string;
}
