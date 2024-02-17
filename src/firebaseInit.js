import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCXscDZCcnZJvZVl0S0R-sd86_iiW8OqwI",
  authDomain: "photofolio-5ef52.firebaseapp.com",
  projectId: "photofolio-5ef52",
  storageBucket: "photofolio-5ef52.appspot.com",
  messagingSenderId: "397649003211",
  appId: "1:397649003211:web:875c27ae6f47c0ab4ed14e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Firebase Storage and get a reference to the service
export const storage = getStorage(app);