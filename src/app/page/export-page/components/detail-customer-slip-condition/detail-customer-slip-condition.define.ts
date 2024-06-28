
/**
 * 得意先伝票出力条件
 */
export interface IExportCustomerSlipConditionInput {
  /** 請求先コード(開始) */
  billingCodeStart: string;
  /** 請求先コード(終了) */
  billingCodeEnd: string;
  /** 仕入先コード(開始) */
  supplierCdStart: string;
  /** 仕入先コード(終了) */
  supplierCdEnd: string;
  /** 締日 */
  cutoffDay: string;
  /** 得意先取引有無区分 */
  customerDealsDiv: string;
  /** 仕入先取引有無区分 */
  supplierDealsDiv: string;
  /** 対象期間 */
  targetPeriod: string;
  /** 開始日 */
  startDateDetail: string;
  /** 終了日 */
  endDateDetail: string;
}
