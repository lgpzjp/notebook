import { IAccountGenericSettingSubID } from '@blcloud/bl-datamodel';

/**
 * 帳票条件設定詳細モーダルインターフェース
 */
export interface IReportConditionSettingDetailModal {
  /** 帳票条件設定詳細モーダルモード */
  mode?: ReportConditionSettingDetailModalMode;
  /** アカウント別汎用設定(サブID有) */
  accountGenericSettingSubID?: IAccountGenericSettingSubID;
  /** 画面ID */
  pageId?: string;
  /** 設定識別ID */
  settingDataId?: string;
  /** 抽出条件名称 */
  conditionName?: string;
  /** 抽出条件 */
  reportCondition?: any;
}

/**
 * 帳票条件設定詳細モーダルモード
 */
export enum ReportConditionSettingDetailModalMode {
  Add,
  Edit,
}

/**
 * 帳票条件設定ユーザー種別
 */
export enum ReportConditionSettingUserDiv {
  // 共有
  Common,
  // 個人
  Individual,
}
