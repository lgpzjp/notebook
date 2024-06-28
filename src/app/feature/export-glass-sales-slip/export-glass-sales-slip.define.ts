
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
  /** 業種コード(開始) */
  dispBusinessCodeS?: number;
  /** 業種コード(終了) */
  dispBusinessCodeE?: number;
  /** 地区コード(開始) */
  areaCdS?: number;
  /** 地区コード(終了) */
  areaCdE?: number;
  /** ヘッダ選択 */
  outPutHeaderDiv: string;
  /** 締日 */
  cutoffDay?: number;
  /** 部品作業選択 */
  glassClassDiv: string;
  /** 順序選択 */
  outPutOrderDiv: string;
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
  All: '0',
  /** 部品 */
  Part: '1',
  /** 作業 */
  WOrk: '2'
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

/** 統計分析タイプのCSV出力最大件数 */
export const StatisticalAnalysisMaxCSVCountSize = 25000;
