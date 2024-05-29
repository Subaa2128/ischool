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

// const firebaseConfig = {
//   apiKey: "AIzaSyCn0Vxu2Qx17yR51uauQMiWZEHO3XCU_fU",
//   authDomain: "ischool-database.firebaseapp.com",
//   projectId: "ischool-database",
//   storageBucket: "ischool-database.appspot.com",
//   messagingSenderId: "458399143425",
//   appId: "1:458399143425:web:1c64f667f3698db97d9200",
//   measurementId: "G-379CG3T6HS",
// };
// Initialize Firebase

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export const storage = getStorage(app);
// export const spaceref=ref()
export const db = getFirestore(app);
