/** 顧客パネル部品検索条件 */
export interface ICustomerPanelPartsCondition {
  /** 顧客カナ（開始） */
  customerNameKanaStart?: string;
  /** 顧客カナ（終了） */
  customerNameKanaEnd?: string;

  /** 顧客コード（開始） */
  customerCodeStart?: number;
  /** 顧客コード（終了） */
  customerCodeEnd?: number;

  /** 顧客サブコード（開始） */
  customerSub_codeStart?: string;
  /** 顧客サブコード（終了） */
  customerSub_codeEnd?: string;

  /** 顧客担当者 */
  receptPicCode1?: string;
  receptPicName1?: string;
  receptPicCode2?: string;
  receptPicName2?: string;
}

/** 顧客パネル部品検索条件表示設定 */
export interface ICustomerPanelPartsConditionShown {
  /** 顧客カナ */
  customerNameKana?: boolean;
  /** 顧客コード */
  customerCode?: boolean;
  /** 顧客サブコード */
  customerSub_code?: boolean;
  /** 顧客担当者 */
  receptPicName?: boolean;
}
