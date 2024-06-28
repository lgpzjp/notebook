// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  /** 開発環境 */
  production: false,

  /** エラーをサーバーに送信する */
  sendError: false,

  /** 認証を有効にする */
  auth: false,

  /** サービスライセンス制御を有効にする */
  serviceLicense: true,

  /** データライセンス制御を有効にする */
  dataLicense: true,

  /** エラー画面にスタックトレースを表示する */
  stackTrace: true,

  /** OEMクラウドストレージバケット */
  oemCloudStorageBuckets: 'https://storage.googleapis.com/dev-blcloud-oem-storage',
};
