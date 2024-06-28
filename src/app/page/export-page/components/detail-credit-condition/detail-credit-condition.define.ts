
/**
 * 入金請求詳細条件
 */
export interface IDetailCreditCondition {
  /** 請求コード(開始)  */
  billingCodeS: string;
  /** 請求コード(終了)  */
  billingCodeE: string;
  /** 請求先名称カナ(開始) */
  billingNameKanaS: string;
  /** 請求先名称カナ(終了) */
  billingNameKanaE: string;
}
