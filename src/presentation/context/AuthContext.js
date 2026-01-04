import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  updateProfile, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  where, 
  orderBy, 
  deleteDoc, 
  doc 
} from 'firebase/firestore'; // Importamos o Firestore
import { auth, db } from '../../data/sources/firebase'; // db é o Firestore

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [totalBalance, setTotalBalance] = useState(0);

  // 1. Monitorar o estado do Usuário
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribeAuth();
  }, []);

  // 2. Monitorar Transações do Firestore em Tempo Real
  useEffect(() => {
    if (!user) {
      setTransactions([]);
      setTotalBalance(0);
      return;
    }

    try {
      const q = query(
        collection(db, 'transactions'),
        where('userId', '==', user.uid),
        orderBy('date', 'desc')
      );

      const unsubscribeDocs = onSnapshot(q, (snapshot) => {
        const list = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setTransactions(list);

        const balance = list.reduce((acc, t) => {
          const val = Number(t.value) || 0;
          return t.type === 'income' ? acc + val : acc - val;
        }, 0);
        
        setTotalBalance(balance);
      }, (error) => {
        console.error("Erro no Snapshot do Firebase:", error);
      });

      return () => unsubscribeDocs();
    } catch (err) {
      console.error("Erro ao montar a query:", err);
    }
  }, [user]);

  // 3. Funções de Ação
  const login = (email, password) => signInWithEmailAndPassword(auth, email, password);
  
  const register = async (email, password, name) => { 
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, {
        displayName: name
      });
    } catch (error) {
      throw error;
    }
  };

  const logout = () => signOut(auth);

  const addTransaction = async (data) => {
    if (!user) throw new Error("Usuário não autenticado");
    await addDoc(collection(db, 'transactions'), {
      ...data,
      userId: user.uid, // Atrela a transação ao dono dela
    });
  };

  const deleteTransaction = async (id) => {
    await deleteDoc(doc(db, 'transactions', id));
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      register, 
      logout,
      transactions,
      totalBalance,
      addTransaction,
      deleteTransaction
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);