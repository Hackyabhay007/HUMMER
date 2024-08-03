// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';



const firebaseConfig = {
  apiKey: "AIzaSyB89wDQqtag659KV_9L5klPcmRS3RsbsD0",
  authDomain: "hummer-ce90b.firebaseapp.com",
  projectId: "hummer-ce90b",
  storageBucket: "hummer-ce90b.appspot.com",
  messagingSenderId: "239325815666",
  appId: "1:239325815666:web:d933a1b064f031545873eb",
  measurementId: "G-TKEZ1WN1QQ"
};



const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
