export interface IExportGlassDepositConditionInput {
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
  /** ヘッダ選択 */
  outPutHeaderDiv: string;
  /** 締日 */
  cutoffDay: number;
  /** 順序 */
  outPutOrderDiv: string;
}

/**
 * 『出力区分』を表します。
 */
export const ExportDepositTypeDiv = {
  /** 入金情報 */
  Slip: '0',
}

/**
 * 『出力区分』の配列情報
 */
export const ExportDepositDivArray: Array<{ value: string, text: string }> = [
  { value: '0', text: '入金情報' },
];

/**
 * 『順序区分』を表します。
 */
export const ExportOrderDiv = {
  /** 日付-組織-得意先-No */
  OrderDiv0: '0',
  /** 組織-得意先-日付-No */
  OrderDiv1: '1',
}
