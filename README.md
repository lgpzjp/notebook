# bl-output-app

Broadleaf クラウドプロジェクト向け 出力関連サブシステムSPA

## 構成

|フォルダ名|概要|備考|
|:---|:------------|:------------|
|e2e|E2Eテストソースフォルダ||
|mocky|||
|  └ /api|モック通信設定ファイル格納フォルダ|ここに存在するjsファイルは全て `npm run mock` 時に読み込まれます。|
|src|ソースフォルダ||
|<font color="gray">coverage</font>|<font color="gray">カバレッジ出力フォルダ</font>|`npm run test` で出力されます。|
|<font color="gray">dist</font>|<font color="gray">ビルド結果出力フォルダ</font>|`npm run build` で出力されます。|
|<font color="gray">documentation</font>|<font color="gray">静的ドキュメント出力フォルダ</font>|`npm run build:compodoc` で出力されます。|


## 開発環境構築
[フロントエンド（Angular2版）開発環境 導入手順](https://jira.broadleaf.jp/wiki/pages/viewpage.action?pageId=3901687)を参照して開発環境を構築して下さい。


## インストール

**初期設定**

このプロジェクトはnpmリポジトリの切り替え(公式 or Broadleafプライベートリポジトリ)が必要なので、 `.npmrc` でnpm registryを `http://localhost:4873` に変更しています。  
そのため、 `npm install` を行う前に以下のコマンドで `verdaccio` を起動する必要があります。  

```
> npm run local:npm
```
※ daemon起動するので1度実行すればマシンを再起動するまで `verdaccio` は起動していますが、毎回やるのが面倒くさい方は開発マシンのスタートアップにでも `node verdaccio.js` コマンドを仕込んでください。  
`verdaccio.js` はこのプロジェクトのルートフォルダにあります。  

以下のコマンドで依存パッケージがインストールされます。

```
> npm install
```

## 通信モック起動

以下のコマンドで `mocky` が起動します。

```
> npm run mock
```

## API接続先

モックサーバーを利用する際、`ng serve`のプロキシ対応として`proxy.conf.json`を設定する必要があります。  
上記proxyの設定でAPI単位に接続先をモックサーバー、IT用サーバと切り替える事も可能です。  
以下は、同一ファイル内に接続先を記述していますが、jsonファイル + 専用スクリプトの実行でも問題ありません。

```
[
  {
    "context": [
      "/api/v1/labelmaster/common"
    ],
    "target": "https://blcloud-st.broadleaf.jp/common",
    "changeOrigin": true,
    "secure": false
  },
  {
    "context": [
      "/api/v1/vehicleinfobindmodel/common/newentry",
      "/api/v1/customerinfobindmodel/common/1"
    ],
    "target": "https://blcloud-st.broadleaf.jp/vehicle",
    "changeOrigin": true,
    "secure": false
  },
  {
    "context": [
      "/api"
    ],
    "target": "http://localhost:4321",
    "secure": false
  }
]
```

## テスト

以下のコマンドでテストブラウザが起動し、テストが実行されます。  
```
> npm run watch
```

## 開発サーバー起動

以下のコマンドで開発サーバーが起動します。`http://localhost:4200/`

```
> npm run start
```

## ドキュメント

以下のコマンドで[Compodoc](https://compodoc.github.io/website/)が http://localhost:8080 で起動し、ソースからドキュメントを生成します。

```
> npm run compodoc
```

## 静的解析 (tsLint)

以下のコマンドでLintが実行されます。
```
> npm run lint
```

## カバレッジ

以下のコマンドでテストが実行され、同時にカバレッジ結果が `./coverage` にHTML形式で出力されます。

```
> npm run test
```

## ビルド

以下のコマンドでビルドが実行されます。

```
> npm run build
```

ビルド結果は、`./dist`に出力されます。
