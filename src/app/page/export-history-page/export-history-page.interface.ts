import { IAccountingLinkCsvExportHistory, IGlassExportSearchInfo } from '@blcloud/bl-datamodel';
import { IButtonCellParameter } from "@blcloud/bl-ng-ui-component";

/**
 * ツールチップセルパラメータのインターフェース定義
 */
export interface IToolTipCellParameter {
  value: string;
  tooltip: string;
  placement: string;
}

/**
 * 検索条件インターフェース定義
 */
export interface ISearchCondition {
  /** 組織コード */
  organizationCode?: string;
  /** 対象期間開始 */
  exportDateStart?: string;
  /** 対象期間終了 */
  exportDateEnd?: string;
}

/**
 * 検索結果インターフェース定義
 */
export interface ISearchResult extends IAccountingLinkCsvExportHistory {
  /** 抽出条件ボタン情報 */
  conditionButtonInfo: IButtonCellParameter;
  /** ダウンロードボタン情報 */
  downloadButtonInfo: IButtonCellParameter;
  /** ファイル名ツールチップ情報 */
  fileNameToolTipInfo: IToolTipCellParameter;
  /** エラー内容ツールチップ情報 */
  errorToolTipInfo: IToolTipCellParameter;
  /** 硝子商テキスト出力検索用情報 */
  glassExportSearchInfo: IGlassExportSearchInfo;
}
