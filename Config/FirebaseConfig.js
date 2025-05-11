import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCXEaIC9jB_Q-kA4X4UICfLqJUWB0e1uwQ",
  authDomain: "crash-7590a.firebaseapp.com",
  projectId: "crash-7590a",
  storageBucket: "crash-7590a.firebasestorage.app",
  messagingSenderId: "5763030285",
  appId: "1:5763030285:web:08e7c3bbe18466879a2444",
  measurementId: "G-5B7GQVXTTM",
};

// Check if Firebase is already initialized
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db };
