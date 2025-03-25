import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDEHhySA-v-Pk5eydPVDxW-wGhpj9G_GQ4",
  authDomain: "hems-fd244.firebaseapp.com",
  databaseURL: "https://hems-fd244-default-rtdb.firebaseio.com",
  projectId: "hems-fd244",
  storageBucket: "hems-fd244.appspot.com",
  messagingSenderId: "36487013943",
  appId: "1:36487013943:web:7837de4c0ff3aa4dcfc1b2",
  measurementId: "G-QTC7XN51QH",
};

// Check if Firebase is already initialized
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db };
