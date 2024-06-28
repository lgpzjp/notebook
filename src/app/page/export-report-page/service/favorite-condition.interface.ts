/**
 * よく使う条件設定
 */
export interface IFavoriteCondition {
  /** 抽出条件名称 */
  conditionName?: string;
  /** 更新日時 */
  updateDateTime?: string;
  /** 抽出条件 */
  reportCondition?: any;
  /** 表示順位 */
  positiveInteger?: number;
}
