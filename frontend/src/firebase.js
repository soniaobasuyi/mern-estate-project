// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "mern-soniaestate.firebaseapp.com",
    projectId: "mern-soniaestate",
    storageBucket: "mern-soniaestate.appspot.com",
    messagingSenderId: "883829430797",
    appId: "1:883829430797:web:12c80948194e3d40b6d344"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);