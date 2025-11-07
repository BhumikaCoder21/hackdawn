
// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// ✅ Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAE_9cC9G74SSoBW6z6G5sv2rCzkLp8XnI",
  authDomain: "agrihill.firebaseapp.com",
  projectId: "agrihill",
  storageBucket: "agrihill.appspot.com",
  messagingSenderId: "404904815527",
  appId: "1:404904815527:web:7eb32d712c4b4aacbce482",
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Export Firebase services for global use
export const db = getFirestore(app);     // Firestore database
export const storage = getStorage(app);  // Firebase Storage
export const auth = getAuth(app);        // Firebase Authentication
export { app };                          // Export app for context or config imports
