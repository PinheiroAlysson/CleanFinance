// src/data/repositories/TransactionRepository.js
import { db } from "../sources/firebase";
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  deleteDoc, 
  doc, 
  updateDoc, 
  addDoc 
} from "firebase/firestore";
import { mapTransactionData } from "../../domain/models/TransactionModel";

export const TransactionRepository = {
  
  subscribeToTransactions: (userId, onUpdate) => {
    if (!userId) return () => {};

    const transactionsCol = collection(db, "users", userId, "transactions");
    const q = query(transactionsCol, orderBy("date", "desc"));

    return onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(mapTransactionData);
      onUpdate(list);
    });
  },

  // CRIAR
  create: async (userId, transactionData) => {
    const transactionsCol = collection(db, "users", userId, "transactions");
    await addDoc(transactionsCol, {
      ...transactionData,
      value: Number(transactionData.value),
      date: new Date(), 
    });
  },

  // ATUALIZAR
  update: async (userId, transactionId, updatedData) => {
    const transactionRef = doc(db, "users", userId, "transactions", transactionId);
    await updateDoc(transactionRef, updatedData);
  },

  // DELETAR
  delete: async (userId, transactionId) => {
    const transactionRef = doc(db, "users", userId, "transactions", transactionId);
    await deleteDoc(transactionRef);
  }
};