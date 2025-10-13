// Firebase設定
// 注意: この設定は公開されても問題ありませんが、Firebaseコンソールでセキュリティルールを設定してください

const firebaseConfig = {
  apiKey: "AIzaSyB1wx4vmRChxKYHP3dW9JFXDlfwIcA7JjY",
  authDomain: "study-mgr.firebaseapp.com",
  databaseURL: "https://study-mgr-default-rtdb.firebaseio.com",
  projectId: "study-mgr",
  storageBucket: "study-mgr.firebasestorage.app",
  messagingSenderId: "338741992569",
  appId: "1:338741992569:web:5b8910da7aae0fe1cac8a8",
  measurementId: "G-N6NW8T8CZE"
};

// Firebase初期化
firebase.initializeApp(firebaseConfig);

// Realtime Databaseの参照
const database = firebase.database();

console.log('Firebase が初期化されました:', firebaseConfig.projectId);

