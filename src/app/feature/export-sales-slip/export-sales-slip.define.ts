export interface IExportSalesSlipConditionInput {
  /**
   * 売上
   */
  sales?: boolean;
  /**
   * 見積
   */
  estimate?: boolean;
  /**
   * 受注
   */
  order?: boolean;
  /**
   * 貸出
   */
  loan?: boolean;
  /**
   * 入金
   */
  deposit?: boolean;
  /**
   * 対象期間
   */
  targetPeriod?: string;
  /**
   * 開始日の条件
   */
  startDate?: string;
  /**
   * 終了日の条件
   */
  endDate?: string;
  /**
   * 出力タイプ
   */
  exportInfoType?: string;
  /**
   * 組織
   */
  organization?: string;
  /**
   * プロダクトコード
   */
  productCode: string;
  /**
   * 担当者コード(開始)
   */
  picEmployeeCodeS?: string;
  /**
   * 担当者コード(終了)
   */
  picEmployeeCodeE?: string;
  /**
   * 組織選択
   */
  organizationSelect?: string;
  /**
   * 得意先選択
   */
  customerSelect?: string;
  /**
   * 得意先コード(開始)
   */
  billingCodeS?: string;
  /**
   * 得意先コード(終了)
   */
  billingCodeE?: string;
  /**
   * 締日
   */
  cutoffDay?: string;
  /**
   * 倉庫コード(開始)
   */
  whCodeS?: string;
  /**
   * 倉庫コード(終了)
   */
  whCodeE?: string;
  /**
   * 商品メーカーコード(開始)
   */
  itemMakerCdS?: string;
  /**
   * 商品メーカーコード(終了)
   */
  itemMakerCdE?: string;
  /**
   * 検索条件商品品番
   */
  searchItemPartsNumber?: string;
  /**
   * 検索条件商品名称
   */
  searchItemPartsName?: string;
}
