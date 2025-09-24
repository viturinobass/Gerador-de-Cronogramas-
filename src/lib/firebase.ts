import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBf_LB7mbClz9Qsung8IAuB-SM1yvEwW_g",
  authDomain: "criador-de-cronogramas.firebaseapp.com",
  projectId: "criador-de-cronogramas",
  storageBucket: "criador-de-cronogramas.appspot.com",
  messagingSenderId: "234995032602",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
