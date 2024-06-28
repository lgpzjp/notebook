
export interface IExportGlassCustomerConditionInput {
  /** 出力タイプ */
  exportInfoType: string;
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

/**
 * 『出力区分』を表します。
 */
export const ExportCustomerTypeDiv = {
  /** 売上先 */
  Slip: '0',
}

/**
 * 『出力区分』の配列情報
 */
export const ExportCustomerDivArray: Array<{ value: string, text: string }> = [
  { value: '0', text: '両方' },
  { value: '1', text: '得意先' },
  { value: '2', text: '仕入先' }
];

