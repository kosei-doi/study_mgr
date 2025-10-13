// Firebase設定のテンプレート
// このファイルをコピーして firebase-config.js を作成し、実際の値を入力してください

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.firebasestorage.app",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};

// Firebase初期化
firebase.initializeApp(firebaseConfig);

// Realtime Databaseの参照
const database = firebase.database();

console.log('Firebase が初期化されました:', firebaseConfig.projectId);

