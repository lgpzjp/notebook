export interface IExportGlassPaymentConditionInput {
  /** 出力タイプ */
  exportInfoType?: string | null;
  /** 開始日の条件 */
  startDate?: string | null;
  /** 終了日の条件 */
  endDate?: string | null;
  /** 組織 */
  organization?: string | null;
  /** プロダクトコード */
  productCode?: string | null;
  /** ヘッダ選択 */
  outPutHeaderDiv?: string | null;
  /** 締日 */
  cutoffDay?: number | null;
  /** 順序 */
  glassOutPutPurchaseOrderDiv?: string | null;
}

/**
 * 『出力区分』を表します。
 */
export const ExportPaymentTypeDiv = {
  /** 出金情報 */
  Slip: '0',
};

/**
 * 『出力区分』の配列情報
 */
export const ExportPaymentDivArray: Array<{ value: string, text: string }> = [
  { value: '0', text: '出金情報' },
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
