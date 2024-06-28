/**
 * リサイクル取引先出力条件
 */
export interface IExportRecycleCustomerConditionInput {
  /** 出力内容 */
  outputInfo: string;
  /** 開始日の条件 */
  startDate: string;
  /** 終了日の条件 */
  endDate: string;
  /** 管理組織 */
  organizationCode: string;
  /** 得意先コード(開始) */
  customerCodeStart: string;
  /** 得意先コード(終了) */
  customerCodeEnd: string;
}
