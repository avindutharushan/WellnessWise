// Firebase configuration
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
// For Firebase JS SDK v9-compat and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDDsg3CMq2tYJFGdm4ohyzU-hzRA6WvI7M",
  authDomain: "health-wellness-tracker-4c117.firebaseapp.com",
  projectId: "health-wellness-tracker-4c117",
  storageBucket: "health-wellness-tracker-4c117.firebasestorage.app",
  messagingSenderId: "387940463160",
  appId: "1:387940463160:web:9ed306de37263d0877accd",
  measurementId: "G-R3JEEB3QDB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;

