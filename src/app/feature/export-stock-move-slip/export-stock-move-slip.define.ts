/**
 * 在庫移動伝票条件
 */
export interface IExportStockMoveSlipConditionInput {
  /** 出荷 */
  shipping: boolean;
  /** 未入荷 */
  nonArrival: boolean;
  /** 入荷済 */
  arrived: boolean;
  /** 出庫 */
  shipment: boolean;
  /** 入庫 */
  entering: boolean;
  /** 対象期間 */
  targetPeriod: string;
  /** 開始日 */
  startDate: string;
  /** 終了日 */
  endDate: string;
  /** 出庫組織 */
  shippingOrganizationCode: string;
  /** 入庫組織 */
  enteringOrganizationCode: string;
  /** 出庫倉庫コード(開始) */
  shippingWhCodeStart: string;
  /** 出庫倉庫コード(終了) */
  shippingWhCodeEnd: string;
  /** 入庫倉庫コード(開始) */
  enteringWhCodeStart: string;
  /** 入庫倉庫コード(終了) */
  enteringWhCodeEnd: string;
  /** 担当コード(開始) */
  picEmployeeCodeStart: string;
  /** 担当コード(終了) */
  picEmployeeCodeEnd: string;
  /** メーカーコード(開始) */
  itemMakerCdStart: string;
  /** メーカーコード(終了) */
  itemMakerCdEnd: string;
  /** 品番 */
  partsNumber: string;
  /** 品名 */
  partsName: string;
}
