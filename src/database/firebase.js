import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

// Initialize Firebase
firebase.initializeApp({
  apiKey: "AIzaSyDlHfFn2QMihYnH_tiDDvGpJGMM8Wll1rI",
  authDomain: "quizapp-ce458.firebaseapp.com",
  projectId: "quizapp-ce458",
  storageBucket: "quizapp-ce458.appspot.com",
  messagingSenderId: "1019119462512",
  appId: "1:1019119462512:web:9207986a5a12e80a5cecb5",
  measurementId: "G-9X5QHWC737"
});

// Create a reference to the Firestore database
export const db = firebase.firestore();
