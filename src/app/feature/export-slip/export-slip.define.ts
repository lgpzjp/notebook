export interface IExportSlipConditionInput {
  /**
   * 見積書
   */
  slipKindQuotation: boolean;
  /**
   * 指示書
   */
  slipKindDirections: boolean;
  /**
   * 納品書
   */
  invoice: boolean;
  /**
   * 対象期間
   */
  targetPeriod: string;
  /**
   * 開始日の条件
   */
  startDate: string;
  /**
   * 終了日の条件
   */
  endDate: string;
  /**
   * 作業タイプ
   */
  exportInfoType: string;
  /**
   * プロダクトコード
   */
  productCode: string;
  /**
   * 拠点選択
   */
  salseRecordedOrganization: string;
  /**
   * 顧客・車両情報
   */
  exportCustomerVehicle: boolean;
}

export interface IDropDownInput {
  code: string;
  name: string;
}
