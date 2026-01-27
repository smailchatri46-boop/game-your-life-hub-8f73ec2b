// Firebase configuration and initialization
// Replace the placeholder values with your Firebase project config
import { initializeApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDt3WRB004pUyHqHWPlF-8tSGFAzaFndA0",
  authDomain: "neyler-c1735.firebaseapp.com",
  projectId: "neyler-c1735",
  storageBucket: "neyler-c1735.firebasestorage.app",
  messagingSenderId: "6573961881",
  appId: "1:6573961881:web:1c3ac099dfafb2b745fe08"
};

// Check if Firebase is configured
export const isFirebaseConfigured = (): boolean => {
  return !!(
    firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId &&
    firebaseConfig.appId
  );
};

// Initialize Firebase app only if configured
let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

if (isFirebaseConfigured()) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    console.log("Firebase initialized successfully");
  } catch (error) {
    console.error("Firebase initialization error:", error);
  }
} else {
  console.warn("Firebase is not configured. Please add your Firebase credentials to .env");
}

export { app, auth, db };
