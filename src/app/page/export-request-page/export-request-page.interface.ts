import { Route } from "@angular/router";

/**
 * 出力グループ項目インターフェース定義
 */
export interface IExportGroupItem {
  /** ID */
  id: string;
  /** ラベル */
  label: string;
  /** アクティブフラグ */
  active?: boolean;
}

export interface IExportMenuItem extends Route {
  /** ID */
  id: string;
  /** ラベル */
  label: string;
  /** アクティブフラグ */
  active?: boolean;
  /** 出力グループID */
  exportGroupId: string;

  /**
   * サービスID配列
   *
   * ここに指定されたサービスIDが1つでも有効なら項目が表示されます。
   */
  serviceIds?: string[];

  /**
   * 必須サービスID配列
   *
   * ここに指定されたサービスIDがすべて有効なら項目が表示されます。
   */
  requiredServiceIds?: string[];

  /**
   * 非表示対象サービスID配列
   *
   * ここに指定されたサービスIDが1つでも有効なら項目が非表示になります。
   */
  notServiceId?: string[];
}
