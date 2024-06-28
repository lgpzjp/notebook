export interface IDropDownInput {
  code: string;
  name: string;
}

export interface IDownloadContent {
  exportInfoDiv: string;
  urlDownload: string;
}

/** CSV出力最大件数 */
export const MaxCSVCountSize = 50000;

/** CSV出力件数0件メッセージ */
export const CSVNotFoundMessage = '対象のデータは見つかりませんでした。既に削除されているか、検索条件に誤りが無いかご確認ください。';
