
export interface IExportGlassSalesSlipConditionInput {
  /** 掛売上 */
  creditSales?: boolean | null;
  /** 掛返品 */
  creditReturned?: boolean | null;
  /** 現金売上 */
  cashSales?: boolean | null;
  /** 現金返品 */
  cashReturned?: boolean | null;
  /** クレーム */
  claim?: boolean | null;
  /** 指示書 */
  direction?: boolean | null;
  /** 一時保存 */
  temporarySave?: boolean | null;
  /** 対象期間 */
  targetPeriod?: string | null;
  /** 開始日の条件 */
  startDate?: string | null;
  /** 終了日の条件 */
  endDate?: string | null;
  /** 出力タイプ */
  exportInfoType?: string | null;
  /** 組織 */
  organization?: string | null;
  /** プロダクトコード */
  productCode?: string | null;
  /** 得意先コード(開始) */
  customerCodeS?: string | null;
  /** 得意先コード(終了) */
  customerCodeE?: string | null;
  /** 担当者コード(開始) */
  picEmployeeCodeS?: string | null;
  /** 担当者コード(終了) */
  picEmployeeCodeE?: string | null;
  /** 業種コード(開始) */
  dispBusinessCodeS?: string | null;
  /** 業種コード(終了) */
  dispBusinessCodeE?: string | null;
  /** 地区コード(開始) */
  areaCdS?: string | null;
  /** 地区コード(終了) */
  areaCdE?: string | null;
  /** ヘッダ選択 */
  outPutHeaderDiv?: string | null;
  /** 締日 */
  cutoffDay?: number | null;
  /** 部品作業選択 */
  glassClassDiv?: number | null;
  /** 順序選択 */
  outPutOrderDiv?: string | null;
}

/**
 * 『テキスト出力伝票タイプ区分』を表します。
 */
export const ExportSlipTypeDiv = {
  /** 伝票タイプ */
  Slip: '0',
  /** 伝票明細タイプ */
  SlipDetail: '1',
  /** 統計分析タイプ */
  StatisticalAnalysis: '2'
};

/**
 * 『テキスト出力伝票タイプ区分』の配列情報
 */
export const ExportSlipTypeDivArray: Array<{ value: string, text: string }> = [
  { value: '0', text: '伝票タイプ' },
  { value: '1', text: '伝票明細タイプ' },
  { value: '2', text: '統計分析タイプ' }
];

/**
 * 『部品作業区分』を表します。
 */
export const ExportPartsWorkDiv = {
  /** 全て */
  All: 0,
  /** 部品 */
  Part: 1,
  /** 作業 */
  WOrk: 2
};

/**
 * 『順序区分』を表します。
 */
export const ExportOrderDiv = {
  /** 日付-組織-得意先-No */
  OrderDiv0: '0',
  /** 組織-得意先-日付-No */
  OrderDiv1: '1',
};

/**
 * 『部品作業区分』の配列情報
 */
export const ExportPartsWorkDivArray: Array<{ value: number, text: string }> = [
  { value: 0, text: '全て' },
  { value: 1, text: '部品' },
  { value: 2, text: '作業' }
];

/**
 * 『順序区分』の配列情報
 */
export const ExportOrderDivArray: Array<{ value: string, text: string }> = [
  { value: '0', text: '日付-組織-得意先-No' },
  { value: '1', text: '組織-得意先-日付-No' },
];
