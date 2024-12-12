import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database"; // Import for Realtime Database

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "ytsearchbookmark.firebaseapp.com",
  databaseURL:
    "https://ytsearchbookmark-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "ytsearchbookmark",
  storageBucket: "ytsearchbookmark.firebasestorage.app",
  messagingSenderId: "1074695532110",
  appId: process.env.NEXT_PUBLIC_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db };
