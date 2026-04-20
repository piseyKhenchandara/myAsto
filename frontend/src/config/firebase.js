// src/firebase/config.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDZe6rCyjQQJeve0akmW-7i3FXaTpzgURY",
  authDomain: "myasto-b10f1.firebaseapp.com",
  projectId: "myasto-b10f1",
  storageBucket: "myasto-b10f1.firebasestorage.app",
  messagingSenderId: "174566547823",
  appId: "1:174566547823:web:f819db4b402a749938489a",
  measurementId: "G-LCBCS08LMY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

auth.settings.appVerificationDisabledForTesting = true;