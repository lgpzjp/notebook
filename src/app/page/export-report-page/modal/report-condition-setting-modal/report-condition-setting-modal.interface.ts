import { IAccountGenericSettingSubID } from '@blcloud/bl-datamodel';
import { IFavoriteCondition } from '../../service/favorite-condition.interface';

/**
 * 帳票条件設定モーダル
 */
export interface IReportConditionSettingModal {
  /** 画面ID */
  pageId: string;
  /** 設定識別ID */
  settingDataId: string;
  /** 抽出条件 */
  reportCondition?: any;
  /** アカウント別汎用設定(サブID有) */
  accountGenericSettingSubID?: IAccountGenericSettingSubID;
}

/**
 * 帳票条件設定モーダル出力
 */
export interface IReportConditionSettingModalResponse {
  /** アカウント別汎用設定(サブID有) */
  accountGenericSettingSubID?: IAccountGenericSettingSubID;
  /** 選択中データの削除フラグ */
  deleted?: boolean;
}

/**
 * 帳票条件設定モーダルテーブル
 */
export interface IReportConditionSettingModalTable extends IFavoriteCondition {
  /** アカウント別汎用設定(サブID有) */
  accountGenericSettingSubID?: IAccountGenericSettingSubID;
}
