/** メンテナンスパックパネル部品検索条件 */
export interface IMaintePackPanelPartsCondition {
  /** 契約日（開始） */
  contractDateStart?: string;
  /** 契約日（終了） */
  contractDateEnd?: string;
  /** 解約日（開始） */
  cancelDateStart?: string;
  /** 解約日（終了） */
  cancelDateEnd?: string;
  /** 契約開始日（開始） */
  contractStartDateStart?: string;
  /** 契約開始日（終了） */
  contractStartDateEnd?: string;
  /** 契約終了日（開始） */
  contractEndDateStart?: string;
  /** 契約終了日（終了） */
  contractEndDateEnd?: string;

  /** 契約番号（開始） */
  mpContractNoStart?: string;
  /** 契約番号（終了） */
  mpContractNoEnd?: string;

  /** メンテナンスパックコード配列 */
  mpCodeList?: number[];

  /** 契約状況配列 */
  mpContractStatusList?: string[];

  /** 出力拠点 */
  contractOrgOutputFlag?: boolean;
  /** 解約拠点 */
  cancelOrgOutputFlag?: boolean;

  /** 契約従業員 */
  contractEmployeeCode1?: string;
  contractEmployeeName1?: string;
  contractEmployeeCode2?: string;
  contractEmployeeName2?: string;

  /** メンテナンスパック預り金 */
  mpDepositUnreceive?: boolean;
  /** 契約メモ */
  contractNote?: string;
  /** 車検サイクル不一致フラグ */
  mismatchInspectionCycleFlag?: boolean;
  /** 法定・新車サイクル不一致フラグ */
  mismatchLegalOrNewCarCycleFlag?: boolean;
}

/** メンテナンスパックパネル部品検索条件表示設定 */
export interface IMaintePackPanelPartsConditionShown {
  /** 契約日 */
  contractDate?: boolean;
  /** 解約日 */
  cancelDate?: boolean;
  /** 契約開始日 */
  contractStartDate?: boolean;
  /** 契約終了日 */
  contractEndDate?: boolean;
  /** 契約番号 */
  mpContractNo?: boolean;
  /** メンテナンスパックコード配列 */
  mpCodeList?: boolean;
  /** 契約状況配列 */
  mpContractStatus?: boolean;
  /** 出力拠点 */
  outputOrg?: boolean;
  /** 契約従業員 */
  contractEmployee?: boolean;
  /** メンテナンスパック預り金 */
  mpDepositUnreceive?: boolean;
  /** 契約メモ */
  contractNote?: boolean;
  /** 点検サイクル不一致フラグ */
  mismatchCheckCycleFlag?: boolean;
}
