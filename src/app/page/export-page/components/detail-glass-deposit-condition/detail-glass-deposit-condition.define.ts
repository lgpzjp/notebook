export interface IExportGlassDepositConditionInput {
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
 * 『部品作業区分』の配列情報
 */
export const ExportPartsWorkDivArray: Array<{ value: string, text: string }> = [
  { value: '0', text: '全て' },
  { value: '1', text: '部品' },
  { value: '2', text: '作業' }
];

/**
 * 『順序区分』の配列情報
 */
export const ExportOrderDivArray: Array<{ value: string, text: string }> = [
  { value: '0', text: '日付-組織-得意先-No' },
  { value: '1', text: '組織-得意先-日付-No' },
];
