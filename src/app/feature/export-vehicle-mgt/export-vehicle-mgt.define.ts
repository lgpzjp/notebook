/**
 * 車両管理検索条件
 */
export interface IExportVehicleMgtConditionInput {
  /** 出力内容 */
  outputInfo: string;
  /** 対象期間 */
  targetPeriod: string;
  /** 開始日 */
  startDate: string;
  /** 終了日 */
  endDate: string;
  /** 出力タイプ */
  exportInfoType: string;
  /** 組織 */
  organizationCode: string;
  /** 得意先コード(開始) */
  customerCodeStart: string;
  /** 得意先コード(終了) */
  customerCodeEnd: string;
  /** 管理番号 */
  custVcleManageGroupCode: string;
  /** 型式 */
  fullModel: string;
　/** 車両備考 */
  vcleRemarksName: string;
  /** グループコード(開始) */
  blCdGroupCodeStart: string;
  /** グループコード(終了) */
  blCdGroupCodeEnd: string;
  /** BLコード(開始) */
  blPrtsCdStart: string;
  /** BLコード(終了) */
  blPrtsCdEnd: string;
  /** 品番 */
  partsNumber: string;
  /** 品名 */
  partsName: string;
  /** 在庫取寄 */
  vehicleStockBackorderDiv: string;
  /** 倉庫コード(開始) */
  whCodeStart: string;
  /** 倉庫コード(終了) */
  whCodeEnd: string;
}
