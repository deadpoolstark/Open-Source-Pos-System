import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, query, orderBy, serverTimestamp, deleteDoc, doc, updateDoc } from "firebase/firestore";

// TODO: Replace with your actual Firebase project config
// from the Firebase Console -> Project Settings
const firebaseConfig = {
  apiKey: "AIzaSyDCshANEmeheFXGVT1WINspN48iJMJjjdw",

  authDomain: "project-kaapi-pos-system.firebaseapp.com",

  projectId: "project-kaapi-pos-system",

  storageBucket: "project-kaapi-pos-system.firebasestorage.app",

  messagingSenderId: "827328421374",

  appId: "1:827328421374:web:a2908f2d51572041e274af",

  measurementId: "G-1DXP6QC4FQ"

};

let app, db;

try {
  if (Object.keys(firebaseConfig).length > 0) {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    db = getFirestore(app);
    console.log("Firebase initialized");
  } else {
    console.warn("Firebase config is empty. Using localStorage for temporary browser persistence.");
  }
} catch (error) {
  console.error("Firebase initialization error:", error);
}

export const saveTransaction = async (transactionData) => {
  if (db) {
    try {
      const docRef = await addDoc(collection(db, "transactions"), {
        ...transactionData,
        createdAt: serverTimestamp()
      });
      return docRef.id;
    } catch (e) {
      console.error("Error adding document: ", e);
      throw e;
    }
  } else {
    // using local browser storage
    return new Promise((resolve) => {
      const simulatedId = "sim-id-" + Date.now();
      const newTx = { ...transactionData, id: simulatedId, createdAt: new Date().toISOString() };

      const existing = JSON.parse(localStorage.getItem('kaapi_tx') || '[]');
      existing.push(newTx);
      localStorage.setItem('kaapi_tx', JSON.stringify(existing));

      setTimeout(() => resolve(simulatedId), 500);
    });
  }
};

export const fetchTransactions = async () => {
  if (db) {
    try {
      const q = query(collection(db, "transactions"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (e) {
      console.error("Error fetching transactions: ", e);
      return [];
    }
  } else {
    // using local browser storage
    return new Promise((resolve) => {
      const existing = JSON.parse(localStorage.getItem('kaapi_tx') || '[]');
      // Sort newest first
      existing.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setTimeout(() => resolve(existing), 300);
    });
  }
};

export const deleteTransaction = async (id) => {
  if (db) {
    try {
      await deleteDoc(doc(db, "transactions", id));
      return true;
    } catch (e) {
      console.error("Error deleting document: ", e);
      throw e;
    }
  } else {
    // using local browser storage
    return new Promise((resolve) => {
      const existing = JSON.parse(localStorage.getItem('kaapi_tx') || '[]');
      const filtered = existing.filter(tx => tx.id !== id);
      localStorage.setItem('kaapi_tx', JSON.stringify(filtered));
      setTimeout(() => resolve(true), 300);
    });
  }
};
export const updateTransactionStatus = async (id, status) => {
  if (db) {
    try {
      await updateDoc(doc(db, "transactions", id), { status });
      return true;
    } catch (e) {
      console.error("Error updating document: ", e);
      throw e;
    }
  } else {
    // using local browser storage
    return new Promise((resolve) => {
      const existing = JSON.parse(localStorage.getItem('kaapi_tx') || '[]');
      const updated = existing.map(tx => tx.id === id ? { ...tx, status } : tx);
      localStorage.setItem('kaapi_tx', JSON.stringify(updated));
      setTimeout(() => resolve(true), 300);
    });
  }
};
