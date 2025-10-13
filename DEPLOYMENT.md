# GitHubへのデプロイ手順

## 事前確認

### ✅ GitHub公開前のチェックリスト

- [x] `.gitignore` ファイルが作成されている
- [x] `firebase-config.js` が `.gitignore` に含まれている
- [x] `firebase-config.example.js` が作成されている
- [x] デバッグ用ファイル（`test-debug.html`）が削除されている
- [x] README.md にセットアップ手順が記載されている

### ⚠️ 注意事項

**絶対にコミットしないファイル:**
- `firebase-config.js` （個人のAPIキーが含まれる）

**コミットすべきファイル:**
- `firebase-config.example.js` （テンプレート）
- `.gitignore`
- `index.html`
- `styles.css`
- `app.js`
- `data/classDays.js`
- `README.md`

## GitHubへのアップロード手順

### 1. Gitリポジトリの初期化

```bash
cd /Users/user/dev/homework/platform
git init
git add .
git commit -m "Initial commit: 学習進捗管理アプリ"
```

### 2. GitHubでリポジトリを作成

1. https://github.com/new にアクセス
2. リポジトリ名を入力（例: `study-progress-app`）
3. Public または Private を選択
4. 「Create repository」をクリック

### 3. リモートリポジトリを追加してプッシュ

```bash
git remote add origin https://github.com/YOUR_USERNAME/study-progress-app.git
git branch -M main
git push -u origin main
```

## GitHub Pagesでの公開（オプション）

### 1. GitHub Pagesを有効化

1. リポジトリの「Settings」→「Pages」
2. Source: "Deploy from a branch"
3. Branch: `main` / `/(root)`
4. 「Save」をクリック

### 2. アクセスURL

数分後、以下のURLでアクセス可能になります：
```
https://YOUR_USERNAME.github.io/study-progress-app/
```

**注意**: GitHub Pagesで公開する場合、`firebase-config.js` は別途作成が必要です。

## 他の人が使う場合の手順

1. リポジトリをクローン
2. `firebase-config.example.js` を `firebase-config.js` にコピー
3. 自分のFirebase設定を入力
4. ローカルサーバーで起動

```bash
git clone https://github.com/YOUR_USERNAME/study-progress-app.git
cd study-progress-app/platform
cp firebase-config.example.js firebase-config.js
# firebase-config.js を編集
python3 -m http.server 8000
```

## セキュリティについて

- Firebase APIキーは公開されても問題ありません
- ただし、Firebaseのセキュリティルールで適切にアクセス制限してください
- 本番環境では認証機能の追加を推奨します

## トラブルシューティング

### `firebase-config.js` がない

```bash
cp firebase-config.example.js firebase-config.js
```

その後、ファイルを編集して実際のFirebase設定を入力してください。

### GitHubにAPIキーが上がってしまった

1. 該当のコミットを削除（履歴から完全削除）
2. Firebaseコンソールでプロジェクトを削除して新しく作成
3. 新しいAPIキーで設定し直す

```bash
# 履歴から完全削除（注意: 強制プッシュが必要）
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch firebase-config.js" \
  --prune-empty --tag-name-filter cat -- --all
git push origin --force --all
```

