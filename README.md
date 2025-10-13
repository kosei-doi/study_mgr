# 学習進捗管理アプリ

シンプルで使いやすい学習進捗管理のWebアプリケーションです。時間割ベースで各科目の理解度と学習時間を記録・可視化できます。

## 特徴

- 📅 週次の時間割表示
- ✅ 科目ごとの理解度追跡
- ⏱ 学習時間の記録
- 📊 全体進捗のサマリー表示
- 🔄 Firebase Realtime Databaseとのリアルタイム同期
- 📱 スマートフォン対応（レスポンシブデザイン）
- 🎨 美しいグラデーションプログレスバー

## セットアップ

### 1. リポジトリのクローン

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
cd YOUR_REPO_NAME/platform
```

### 2. Firebase設定ファイルの作成

```bash
cp firebase-config.example.js firebase-config.js
```

`firebase-config.js` を開いて、実際のFirebase設定値を入力してください。

## Firebase Realtime Database 連携設定

### 1. Firebaseプロジェクトの作成

1. [Firebase Console](https://console.firebase.google.com/) にアクセス
2. 「プロジェクトを追加」をクリック
3. プロジェクト名を入力（例: study-progress-app）
4. Google Analyticsは任意
5. プロジェクトを作成

### 2. Realtime Databaseの有効化

1. Firebaseコンソールで「構築」→「Realtime Database」を選択
2. 「データベースを作成」をクリック
3. ロケーションを選択（例: asia-southeast1）
4. セキュリティルールを選択：
   - 開発中は「テストモードで開始」
   - 本番環境では適切なルールを設定

### 3. Firebase設定の取得

#### ウェブアプリの追加方法

1. Firebaseコンソールのプロジェクトページで、左側のサイドバーの上部にある「プロジェクトの概要」の隣の⚙️（歯車アイコン）をクリック
2. 「プロジェクトの設定」を選択
3. 「全般」タブを開く
4. 下にスクロールして「マイアプリ」セクションを見つける
5. 「アプリを追加」または「</>」（ウェブアイコン）をクリック
6. アプリのニックネーム（例: "学習進捗管理"）を入力
7. 「Firebase Hosting」のチェックボックスは**チェックしない**
8. 「アプリを登録」をクリック
9. 表示される設定コードの `firebaseConfig` オブジェクトをコピー

**別の方法:**
- プロジェクトの概要ページで、中央にある「ウェブアプリに Firebase を追加して利用を開始しましょう」の `</>` ボタンをクリックしても同じ画面が開きます

#### 設定のコピー

表示される設定コードは以下のような形式です：

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project.firebaseapp.com",
  databaseURL: "https://your-project-default-rtdb.firebaseio.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};
```

この部分をコピーしてください。

### 4. アプリへの設定

`firebase-config.js` ファイルを編集：

```javascript
const firebaseConfig = {
  apiKey: "あなたのAPI_KEY",
  authDomain: "your-project-id.firebaseapp.com",
  databaseURL: "https://your-project-id-default-rtdb.firebaseio.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "あなたのMESSAGING_SENDER_ID",
  appId: "あなたのAPP_ID"
};
```

### 5. セキュリティルールの設定（推奨）

Firebaseコンソールの「Realtime Database」→「ルール」で以下を設定：

```json
{
  "rules": {
    "subjects": {
      ".read": true,
      ".write": true
    }
  }
}
```

**注意**: 上記は開発用です。本番環境では認証を追加してください。

### 6. 動作確認

1. ブラウザで `index.html` を開く
2. コンソールに「Firebase Realtime Database が有効です」と表示されることを確認
3. データを更新して、Firebaseコンソールでリアルタイムに反映されることを確認

## 機能

- ✅ 時間割の進捗管理
- ✅ 学習時間の記録
- ✅ Firebase Realtime Databaseとの自動同期
- ✅ オフライン時はローカルで動作

## トラブルシューティング

### ウェブアプリが追加できない

**状況1: 「アプリを追加」ボタンが見つからない**
- プロジェクトの概要ページに戻る
- 画面中央に「使ってみる」のセクションがあり、iOS、Android、ウェブのアイコンが表示されている
- `</>` （ウェブのアイコン）をクリック

**状況2: プロジェクトが作成できていない**
1. [Firebase Console](https://console.firebase.google.com/) にアクセス
2. Googleアカウントでログイン
3. 「プロジェクトを追加」をクリック
4. プロジェクト名を入力（例: study-progress-app）
5. Google Analyticsは「今は必要ない」を選択してもOK
6. 「プロジェクトを作成」をクリック
7. 作成完了まで数秒待つ

**状況3: Realtime Databaseが選択できない**
- 左側メニューで「構築」を展開
- 「Realtime Database」を選択
- 「データベースを作成」ボタンが表示されるのでクリック

### Firebaseに接続できない

- `firebase-config.js` の設定が正しいか確認
  - コピー漏れがないか確認
  - カンマやクォートの抜けがないか確認
- Firebaseコンソールでデータベースが作成されているか確認
- ブラウザのコンソール（F12キー）でエラーメッセージを確認
- コンソールに「Firebase Realtime Database が有効です」と表示されるか確認

### データが保存されない

- Firebaseのセキュリティルールで書き込みが許可されているか確認
- ブラウザのコンソールでエラーメッセージを確認
- Firebaseコンソールの「Realtime Database」でデータが実際に保存されているか確認

### よくある設定ミス

1. **databaseURL が間違っている**
   - `https://your-project-default-rtdb.firebaseio.com` の形式
   - `your-project` の部分は実際のプロジェクトIDに置き換える
   - リージョンによっては `-default-rtdb` の部分が異なる場合がある

2. **セキュリティルールが厳しすぎる**
   - テスト用には `.read` と `.write` を `true` に設定
   - 本番環境では認証を追加する

3. **HTMLファイルをローカルで開いている**
   - `file://` プロトコルではFirebaseが動作しない場合がある
   - ローカルサーバーを立ち上げる必要がある場合がある
   - 簡易サーバー: `python3 -m http.server 8000`

