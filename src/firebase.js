import { getFirestore } from "firebase/firestore";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBpO2jgpVC9VmU5YE9MofqdNCVPoxAdoEc",
  authDomain: "geo-india-5457d.firebaseapp.com",
  databaseURL: "https://geo-india-5457d-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "geo-india-5457d",
  storageBucket: "geo-india-5457d.firebasestorage.app",
  messagingSenderId: "335125246136",
  appId: "1:335125246136:web:9308016b5008a5efde444d",
  measurementId: "G-ZHRWW2B96J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
analytics.app.automaticDataCollectionEnabled = true;
export const db = getFirestore(app);