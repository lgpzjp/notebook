/**
 * 在庫出力検索条件
 */
export interface ExportStockConditionSearch {
  /** 開始日 */
  startDate: string;
  /** 終了日 */
  endDate: string;
  /** 出力内容 */
  outputInfo: string;
  /** プロダクトコード */
  productCode: string;
}
