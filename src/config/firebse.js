// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAT0tLkj5pJioyBuAxrrNqm44llAo9KyxM",
  authDomain: "goodsplit-aab46.firebaseapp.com",
  projectId: "goodsplit-aab46",
  storageBucket: "goodsplit-aab46.firebasestorage.app",
  messagingSenderId: "633259413130",
  appId: "1:633259413130:web:5e04c93f55008c726e2773",
  measurementId: "G-PQC1JEZGZB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db = getFirestore(app);
export const auth = getAuth(app);

export const tripsRef = collection(db, 'trips');
export const expensesRef = collection(db, 'expenses');
export const feedbackRef = collection(db, 'feedbacks');

export const addgroupRef = collection(db, 'groups');
export const addMemberRef = collection(db, 'members');
export const addGroupExpenseRef = collection(db, 'groupexpenses');

export default app