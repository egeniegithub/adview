import { initializeApp } from "firebase/app";
import {
    getAuth,
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    sendPasswordResetEmail,
    signOut,
    signInWithPopup,
    signInWithCustomToken,
    signInWithEmailAndPassword,
} from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage"

const FirebaseCredentials = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
};

// if a Firebase instance doesn't exist, create one
const firebaseApp = initializeApp(FirebaseCredentials);
const auth = getAuth(firebaseApp);
const database = getDatabase(firebaseApp);
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('https://www.googleapis.com/auth/adwords')
const storage = getStorage()

export {
    auth,
    FirebaseCredentials,
    createUserWithEmailAndPassword,
    signInWithCustomToken,
    database,
    googleProvider,
    getDownloadURL,
    GoogleAuthProvider,
    sendPasswordResetEmail,
    storage,
    signInWithPopup,
    signInWithEmailAndPassword,
    ref,
    signOut,
    uploadBytes
}; 