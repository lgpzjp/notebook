
export interface IExportGlassPurchaseSlipConditionInput {
  /** 掛仕入 */
  creditPurchase?: boolean | null;
  /** 掛仕入返品 */
  creditPurchaseReturn?: boolean | null;
  /** 現金仕入 */
  cashPurchase?: boolean | null;
  /** 現金仕入返品 */
  cashPurchaseReturn?: boolean | null;
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
  /** 仕入先コード(開始) */
  customerCodeS?: string | null;
  /** 仕入先コード(終了) */
  customerCodeE?: string | null;
  /** 担当者コード(開始) */
  picEmployeeCodeS?: string | null;
  /** 担当者コード(終了) */
  picEmployeeCodeE?: string | null;
  /** ヘッダ選択 */
  outPutHeaderDiv?: string | null;
  /** 締日 */
  cutoffDay?: number | null;
  /** 順序選択 */
  glassOutPutPurchaseOrderDiv?: string | null;
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
 * 『順序区分』を表します。
 */
export const ExportOrderDiv = {
  /** 日付-組織-仕入先-No */
  OrderDiv0: '0',
  /** 組織-仕入先-日付-No */
  OrderDiv1: '1',
};

/**
 * 『順序区分』の配列情報
 */
export const ExportOrderDivArray: Array<{ value: string, text: string }> = [
  { value: '0', text: '日付-組織-仕入先-No' },
  { value: '1', text: '組織-仕入先-日付-No' },
];
