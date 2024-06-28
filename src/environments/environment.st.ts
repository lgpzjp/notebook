export const environment = {
  /** 本番環境 */
  production: true,

  /** エラーをサーバーに送信する */
  sendError: true,

  /** 認証を有効にする */
  auth: false,

  /** サービスライセンス制御を有効にする */
  serviceLicense: true,

  /** データライセンス制御を有効にする */
  dataLicense: true,

  /** エラー画面にスタックトレースを表示する */
  stackTrace: true,

  /** OEMクラウドストレージバケット */
  oemCloudStorageBuckets: 'https://storage.googleapis.com/test01-blcloud-oem-storage',
};
