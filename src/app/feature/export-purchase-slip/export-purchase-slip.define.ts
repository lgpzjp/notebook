export interface IExportPurchaseSlipConditionInput {
  /**
   * 仕入
   */
  purchase: boolean;
  /**
   * 入荷
   */
  arrival: boolean;
  /**
   * 発注
   */
  order: boolean;
  /**
   * 返品予定
   */
  returning: boolean;
  /**
   * 出金
   */
  withdrawal: boolean;
  /**
   * 対象期間
   */
  targetPeriod: string;
  /**
   * 開始日の条件
   */
  startDate: string;
  /**
   * 終了日の条件
   */
  endDate: string;
  /**
   * 作業タイプ
   */
  exportInfoType: string;
  /**
   * 管理組織
   */
  organization: string;
  /**
   * プロダクトコード
   */
  productCode: string;
  /**
   * 組織選択
   */
  salseSupplierMgtOrganization: string;
  /**
   * 仕入先選択
   */
  salseSupplier: string;
  /**
   * 担当者コード(開始)
   */
  picEmployeeCodeStart: string;
  /**
   * 担当者コード(終了)
   */
  picEmployeeCodeEnd: string;
  /**
   * 仕入先コード(開始)
   */
  payeeCodeStart: string;
  /**
   * 仕入先コード(終了)
   */
  payeeCodeEnd: string;
  /**
   * 締日
   */
  cutoffDay: string;
  /**
   * 倉庫コード(開始)
   */
  whCodeStart: string;
  /**
   * 倉庫コード(終了)
   */
  whCodeEnd: string;
  /**
   * メーカーコード(開始)
   */
  itemMakerCdStart: string;
  /**
   * メーカーコード(終了)
   */
  itemMakerCdEnd: string;
  /**
   * 品番
   */
  partsNumber: string;
  /**
   * 品名
   */
  partsName: string;
}
