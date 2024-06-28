export interface IExportGlassExportSearchInfo {
  /** BLテナントID */
  blTenantId?: string;
  /** 売上伝票区分情報配列 */
  salesSlipDivList?: string[];
  /** 仕入伝票区分情報配列 */
  purchaseSlipDivList?: string[];
  /** 出力タイプ */
  exportInfoType?: string;
  /** 対象期間区分  */
  dataExportTargetPeriodDiv?: String;
  /** データ出力対象期間(開始) */
  dataExportTargetPeriodStDate?: string;
  /** データ出力対象期間(終了) */
  dataExportTargetPeriodEdDate?: string;
  /** 組織コード(開始) */
  organizationCodeStart?: string;
  /** 組織コード(終了) */
  organizationCodeEnd?: string;
  /** 組織コード配列 */
  organizationCodeList?: string[];
  /** 顧客コード(開始) */
  customerCodeStart?: string;
  /** 顧客コード(終了) */
  customerCodeEnd?: string;
  /** 顧客名称(開始) */
  customerNameStart?: string;
  /** 顧客名称(終了) */
  customerNameEnd?: string;
  /** 担当従業員コード(開始) */
  picEmployeeCodeStart?: string;
  /** 担当従業員コード(終了) */
  picEmployeeCodeEnd?: string;
  /** 業種コード(開始) */
  businessCodeStart?: string;
  /** 業種コード(終了) */
  businessCodeEnd?: string;
  /** 地区コード(開始) */
  areaCdStart?: string;
  /** 地区コード(終了) */
  areaCdEnd?: string;
  /** 締日 */
  cutoffDay?: number;
  /** 硝子分類区分種別 */
  glassClassDivGetDiv?: number;
  /** CSVヘッダー出力区分 */
  outPutHeaderDiv?: string;
  /** CSV出力順序区分 */
  outPutOrderDiv?: string;
  /** 硝子仕入先CSV出力順序区分 */
  glassOutPutPurchaseOrderDiv?: string;
  /** テキスト出力パターンコード配列 */
  exportPatternCodeList?: string;
  /** 取引先情報出力内容 */
  customerExportContent?: string;
  /** 硝子テキスト出力伝票タイプ区分 */
  glassExportSlipTypeDiv?: string;
}

/**
 * 『出力区分』の配列情報
 */
export const ExportCustomerDivArray: Array<{ value: string, text: string }> = [
  { value: '0', text: '両方' },
  { value: '1', text: '得意先' },
  { value: '2', text: '仕入先' }
];
