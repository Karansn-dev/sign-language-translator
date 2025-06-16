// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCIWwVeiMK8mWFHoGofG-7z1-VantaAodE",
  authDomain: "indian-sing-language.firebaseapp.com",
  projectId: "indian-sing-language",
  storageBucket: "indian-sing-language.appspot.com",
  messagingSenderId: "821716492656",
  appId: "1:821716492656:web:02ea6f99091562d56e6fb5",
  measurementId: "G-4LMR7PQ696"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app); 