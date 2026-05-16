import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyB5ptFff8LKOc73yfg9X3hT0RmffQON3i8",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "aarvievelifesync.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "aarvievelifesync",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "aarvievelifesync.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "486918094973",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:486918094973:web:65816243b487a1548a7114",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-KCXF8ZFR07",
};

const app = initializeApp(firebaseConfig);

export const firebaseAuth = getAuth(app);
export const firebaseDb = getFirestore(app);
export const firebaseStorage = getStorage(app);

export default app;
