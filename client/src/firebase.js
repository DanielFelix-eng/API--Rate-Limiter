// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: 'real-estate-a1a92.firebaseapp.com',
  projectId: 'real-estate-a1a92',
  storageBucket: 'real-estate-a1a92.appspot.com',
  messagingSenderId: '291163744314',
  appId: '1:291163744314:web:7ee8a696ff4aee136f6d03'
}

export const app = initializeApp(firebaseConfig);
export default app;