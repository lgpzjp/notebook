export interface IExportGlassSalesSlipConditionInput {
  /** 掛売上 */
  creditSales: boolean;
  /** 掛返品 */
  creditReturned: boolean;
  /** 現金売上 */
  cashSales: boolean;
  /** 現金返品 */
  cashReturned: boolean;
  /** クレーム */
  claim: boolean;
  /** 指示書 */
  direction: boolean;
  /** 一時保存 */
  temporarySave: boolean;
  /** 対象期間 */
  targetPeriod: string;
  /** 開始日の条件 */
  startDate: string;
  /** 終了日の条件 */
  endDate: string;
  /** 出力タイプ */
  exportInfoType: string;
  /** 組織 */
  organization: string;
  /** プロダクトコード */
  productCode: string;
  /** 得意先コード(開始) */
  customerCodeS?: string;
  /** 得意先コード(終了) */
  customerCodeE?: string;
  /** 担当者コード(開始) */
  picEmployeeCodeS?: string;
  /** 担当者コード(終了) */
  picEmployeeCodeE?: string;
  /** 地区コード(開始) */
  areaCdS?: string;
  /** 地区コード(終了) */
  areaCdE?: string;
  /** ヘッダ選択 */
  outPutHeaderDiv: string;
  /** 業種コード(開始) */
  dispBusinessCodeS?: string;
  /** 業種コード(終了) */
  dispBusinessCodeE?: string;
  /** 締日 */
  cutoffDay?: number;
  /** 部品作業選択 */
  glassClassDiv: string;
  /** 順序選択 */
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
