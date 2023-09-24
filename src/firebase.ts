import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAiU1Z-3oGaV34itp57PvecMtXm1kDSpaY",
  authDomain: "nwitter-reloaded-db3c2.firebaseapp.com",
  projectId: "nwitter-reloaded-db3c2",
  storageBucket: "nwitter-reloaded-db3c2.appspot.com",
  messagingSenderId: "1017384490651",
  appId: "1:1017384490651:web:9ad61985d279c0c20c983e",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// 인증
export const auth = getAuth(app);

export const storage = getStorage(app);

export const db = getFirestore(app);
