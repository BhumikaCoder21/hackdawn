import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAE_9cC9G74SSoBW6z6G5sv2rCzkLp8XnI",
  authDomain: "agrihill.firebaseapp.com",
  projectId: "agrihill",
  storageBucket: "agrihill.appspot.com",
  messagingSenderId: "404904815527",
  appId: "1:404904815527:web:7eb32d712c4b4aacbce482",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);