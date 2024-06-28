
/**
 * 車両管理出力条件
 */
export interface IExportVehicleMgtConditionInput {
  /** 得意先コード(開始) */
  customerCodeStart: string;
  /** 得意先コード(終了) */
  customerCodeEnd: string;
  /** 顧客車両管理グループコード */
  custVcleManageGroupCode: string;
  /** フル型式 */
  fullModel: string;
  /** 車両備考名称 */
  vcleRemarksName: string;
  /** BLコードグループコード(開始) */
  blCdGroupCodeStart: string;
  /** BLコードグループコード(終了) */
  blCdGroupCodeEnd: string;
  /** BL部品コード(開始) */
  blPrtsCdStart: string;
  /** BL部品コード(終了) */
  blPrtsCdEnd: string;
  /** 品番 */
  partsNumber: string;
  /** 品名 */
  partsName: string;
  /** 車両在庫取寄区分 */
  vehicleStockBackorderDiv: string;
  /** 倉庫コード(開始) */
  whCodeStart: string;
  /** 倉庫コード(終了) */
  whCodeEnd: string;
}
