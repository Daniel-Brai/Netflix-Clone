// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAdWgfXzncnUzQYX9Ych9Os70u5zR0NBE4",
  authDomain: "netflix-clone-daniel-brai.firebaseapp.com",
  projectId: "netflix-clone-daniel-brai",
  storageBucket: "netflix-clone-daniel-brai.appspot.com",
  messagingSenderId: "928425412078",
  appId: "1:928425412078:web:28f60c9adbc5096f24baff"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()
const db = getFirestore()
const auth = getAuth()

export default app
export { auth, db }