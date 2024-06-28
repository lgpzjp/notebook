
/**
 * 仕入伝票条件
 */
export interface IExportPurchaseSlipConditionInput {
  /** 担当者コード(開始) */
  picEmployeeCodeStart: string;
  /** 担当者コード(終了) */
  picEmployeeCodeEnd: string;
  /** 支払先コード(開始) */
  payeeCodeStart: string;
  /** 支払先コード(終了) */
  payeeCodeEnd: string;
  /** 締め日 */
  cutoffDay: string;
  /** 仕入管理組織 */
  salseSupplierMgtOrganization: string;
  /** 仕入先 */
  salseSupplier: string;
  /** 倉庫コード(開始) */
  whCodeStart: string;
  /** 倉庫コード(終了) */
  whCodeEnd: string;
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
 * 得意先詳細条件
 */
export interface IDetailCustomerCondition {
  /** 担当者コード(開始) */
  picEmployeeCodeStart: string;
  /** 担当者コード(終了) */
  picEmployeeCodeEnd: string;
  /** 支払先コード(開始) */
  payeeCodeStart: string;
  /** 支払先コード(終了) */
  payeeCodeEnd: string;
  /** 締め日 */
  cutoffDay: string;
  /** 倉庫コード(開始) */
  whCodeStart: string;
  /** 倉庫コード(終了) */
  whCodeEnd: string;
  /** 商品メーカーコード(開始) */
  itemMakerCdStart: string;
  /** 商品メーカーコード(終了) */
  itemMakerCdEnd: string;
  /** 品番 */
  partsNumber: string;
  /** 品名 */
  partsName: string;
}
