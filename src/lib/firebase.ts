import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromCache, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '@/firebase-applet-config.json';
import { getStorage } from "firebase/storage";


const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);

export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

// Connectivity check
async function testConnection() {
  try {
    // Attempt to get a dummy doc to verify connection
    await getDocFromServer(doc(db, '_internal', 'connectivity_test'));
    console.log('Firebase connection established');
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration or internet connection.");
    }
  }
}

testConnection();
