# DepSheet

DepSheetは、フロントエンドのライブラリの利用状況を一覧化するためのGoogle Apps Script（以下GAS）です。GASプロジェクトから、複数のGitHubリポジトリのpackage.jsonを参照し、dependencies・devDependenciesの内容を整理してGoogleスプレッドシートに出力します。

## 使い方

WIP

## 開発手順

### 準備

ライブラリをインストールします。以下のコマンドを実行するとブラウザが開くので、Googleアカウントを選択してログインします。

```sh
pnpm i
pnpm clasp-login
```

また、この時のログイン情報は `~/.clasprc.json` に保存され、PC環境下においてグローバルな情報として扱われる点に注意してください。

続いて、デプロイ先となるGASプロジェクトを紐づけます。`.clasp.json` の `scriptId` にGASプロジェクトのスクリプトIDを入力してください。

```json
{
  "type": "sheets",
  "scriptId": "enter-your-script-id-here",
  "rootDir": "./"
}
```

スクリプトIDはGASプロジェクトの識別子です。GASプロジェクトの［プロジェクトの設定］画面で確認できます。

### GASのビルド

GASをビルドします。成果物は `dist/main.js` として出力されます。

```sh
pnpm build
```

### GASのデプロイ

ビルドで生成した `dist/main.js` をGASプロジェクトにデプロイします。

```sh
pnpm push
```

### GASの実行

ブラウザでGASプロジェクトを開き、main関数を選択して実行します。
スクリプトが実行され、一定時間後スプレッドシートに反映されます。

## FAQ

### 新たにリポジトリ（package.json）を登録するには？

GASプロジェクトのスクリプトプロパティに設定を追加してください。

ブラウザでGASプロジェクトを開き、［プロジェクトの設定］を選択します。
スクリプトプロパティの一覧が表示されるので、以下のようにプロパティ・値を入力して保存してください。

* プロパティ：<プロジェクト名>
* 値：<package.jsonのrawファイルのURL>

保存後にGASを実行するとスプレッドシートに反映されます。

### 動作確認するには？

WIP
