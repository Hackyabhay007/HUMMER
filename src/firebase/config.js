import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

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
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);