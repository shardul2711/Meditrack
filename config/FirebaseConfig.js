// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics";
//import { getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBVSPvSLFk9lBiA0sZRFPICZZ_i-x4NZ_c",
  authDomain: "meditrack-90f25.firebaseapp.com",
  projectId: "meditrack-90f25",
  storageBucket: "meditrack-90f25.firebasestorage.app",
  messagingSenderId: "439379555310",
  appId: "1:439379555310:web:4752526c7501c446fa54ff",
  measurementId: "G-Y9VR1S09NJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const db=getFirestore(app)