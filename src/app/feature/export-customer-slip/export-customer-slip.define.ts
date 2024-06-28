/**
 * 得意先伝票出力条件
 */
export interface IExportCustomerSlipConditionInput {
  /** 出力内容 */
  outputInfo: string;
  /** 開始日の条件 */
  startDate: string;
  /** 終了日の条件 */
  endDate: string;
  /** 管理組織 */
  organizationCode: string;
  /** 得意先コード(開始) */
  billingCodeStart: string;
  /** 得意先コード(終了) */
  billingCodeEnd: string;
  /** 仕入先コード(開始) */
  supplierCdStart: string;
  /** 仕入先コード(終了) */
  supplierCdEnd: string;
  /** 締日 */
  cutoffDay: string;
  /** 取引有無(得意先) */
  customerDealsDiv: string;
  /** 取引有無(仕入先) */
  supplierDealsDiv: string;
  /** 対象期間 */
  targetPeriod: string;
  /** 開始日の条件(詳細) */
  startDateDetail: string;
  /** 終了日の条件(詳細) */
  endDateDetail: string;
}
