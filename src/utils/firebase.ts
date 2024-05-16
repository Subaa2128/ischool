import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

import "firebase/firestore";
import "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAbevuJvT5tBQ0NhTzDNYONv0CBzDi8K9U",
  authDomain: "ubucon-demo.firebaseapp.com",
  projectId: "ubucon-demo",
  storageBucket: "ubucon-demo.appspot.com",
  messagingSenderId: "27957478987",
  appId: "1:27957478987:web:c8a3a198ac66588c20afce",
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export const storage = getStorage(app);
// export const spaceref=ref()
export const db = getFirestore(app);
