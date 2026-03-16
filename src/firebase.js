import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBhwz5La0BRZtfOqK4zp4Atsz7xA6p2X_U",
  authDomain: "gen-lang-client-0419854086.firebaseapp.com",
  projectId: "gen-lang-client-0419854086",
  storageBucket: "gen-lang-client-0419854086.firebasestorage.app",
  messagingSenderId: "55762083999",
  appId: "1:55762083999:web:c38c49a33b7a00b425c2aa"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
