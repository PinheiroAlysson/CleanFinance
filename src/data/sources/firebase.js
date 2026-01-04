import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth'; // Vamos usar o básico primeiro para não dar erro
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAt5CR-bKZgx8ppJ9AbdUbmQTScvSJYlAc",
  authDomain: "financeapp-fiap.firebaseapp.com",
  projectId: "financeapp-fiap",
  storageBucket: "financeapp-fiap.firebasestorage.app",
  messagingSenderId: "889394788555",
  appId: "1:889394788555:web:679fe732112a13a405834e",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);