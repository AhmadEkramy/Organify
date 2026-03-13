import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCRP9s78Dm1s27eWNkzszL1T5H5cEozG1Q",
  authDomain: "organify-dfee4.firebaseapp.com",
  projectId: "organify-dfee4",
  storageBucket: "organify-dfee4.firebasestorage.app",
  messagingSenderId: "587334511794",
  appId: "1:587334511794:web:7e8b9f7dd429cf185dedab",
  measurementId: "G-4P886ZB04R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, analytics, auth, db, storage };
