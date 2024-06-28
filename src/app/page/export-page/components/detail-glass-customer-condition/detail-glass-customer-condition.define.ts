export interface IExportGlassCustomerConditionInput {
  /** 開始日の条件 */
  startDate: string;
  /** 終了日の条件 */
  endDate: string;
  /** 組織 */
  organization: string;
  /** プロダクトコード */
  productCode: string;
  /** 顧客コード(開始) */
  customerCodeS: string;
  /** 顧客コード(終了) */
  customerCodeE: string;
  /** 締日 */
  cutoffDay: number;
  /** ヘッダ選択 */
  outPutHeaderDiv: string;
}
