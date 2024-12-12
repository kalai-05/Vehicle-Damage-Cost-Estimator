// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBQIO3YVpN1qo6OSVmzdORZFrpwjC2c1Po",
  authDomain: "my-app-ccbeb.firebaseapp.com",
  projectId: "my-app-ccbeb",
  storageBucket: "my-app-ccbeb.firebasestorage.app",
  messagingSenderId: "790441716157",
  appId: "1:790441716157:web:0fad6c0cae629dcaf9cad4",
  measurementId: "G-55PP3C2NLY",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
//const analytics = getAnalytics(app);
