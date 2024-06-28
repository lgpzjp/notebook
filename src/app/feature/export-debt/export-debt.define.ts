/**
 * 債務情報出力条件
 */
export interface ExportDebtConditionSearch {
  /** 開始日 */
  startDate: string;
  /** 終了日 */
  endDate: string;
  /** 出力内容 */
  outputInfo: string;
  /** プロダクトコード */
  productCode: string;
  /** 締日 */
  cutoffDay: number;
}
