import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { getAuth } from 'firebase/auth'
import { initializeApp } from 'firebase/app'
const firebaseConfig = {
  apiKey: "AIzaSyDbtUlOpaQqEbYWIa7XbTPQIGEbQMJUUgU",
  authDomain: "ecommerce-shop-21545.firebaseapp.com",
  projectId: "ecommerce-shop-21545",
  storageBucket: "ecommerce-shop-21545.appspot.com",
  messagingSenderId: "907676700271",
  appId: "1:907676700271:web:00c05baa1294b16b5f079a",
  measurementId: "G-8LMKFLDLYL"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig)
export default firebase;
export const authentication = getAuth(initializeApp(firebaseConfig))