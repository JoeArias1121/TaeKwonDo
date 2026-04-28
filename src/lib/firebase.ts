import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB1j3Q5Jm0qRMOk4d6EjbJauB69Z6krXQE",
  authDomain: "tkdweb-38f7b.firebaseapp.com",
  projectId: "tkdweb-38f7b",
  storageBucket: "tkdweb-38f7b.firebasestorage.app",
  messagingSenderId: "356882081213",
  appId: "1:356882081213:web:df9bd8c9ff18e610d45ed4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
