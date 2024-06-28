/**
 * 入金請求出力条件
 */
export interface ExportCreditConditionSearch {
  /** 開始日付 */
  startDate: string;
  /** 終了日付 */
  endDate: string;
  /** 出力内容 */
  outputInfo: string;
  /** プロダクトコード */
  productCode: string;
  /** 締日 */
  cutoffDay: number;
}
