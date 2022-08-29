// Import the functions you need from the SDKs you need
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyActUsM9y7he6aI8VrOe7KMQgQDPQGGl-Q",
  authDomain: "usafe-65334.firebaseapp.com",
  projectId: "usafe-65334",
  storageBucket: "usafe-65334.appspot.com",
  messagingSenderId: "332189173609",
  appId: "1:332189173609:web:dc3e2ea7191513bf2f1ff8",
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth();


