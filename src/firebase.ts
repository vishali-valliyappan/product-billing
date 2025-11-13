// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCdg0bnqpFoBurK21_oqh_wpK1EWOW7RXQ",
  authDomain: "supermarket-billing-16241.firebaseapp.com",
  projectId: "supermarket-billing-16241",
  storageBucket: "supermarket-billing-16241.firebasestorage.app",
  messagingSenderId: "450192273390",
  appId: "1:450192273390:web:5db4b77e851a3a740ce8ff",
  measurementId: "G-V8VZZ0TJQ6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);
