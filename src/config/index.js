import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/database";
import "firebase/compat/firestore";
import "firebase/compat/storage";
import "firebase/compat/functions";
import "firebase/compat/analytics";
import "firebase/compat/performance";
import "firebase/compat/messaging";
import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_APP_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_APP_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_APP_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_APP_FIREBASE_MEASUREMENTID
};

export const onlineFirebaseApp = initializeApp(firebaseConfig, "secondary");

// Initialize firebase instance
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

if (import.meta.env.VITE_APP_FIREBASE_USE_EMULATOR === "true") {
  console.log("Using emulator");
  firebase.firestore().useEmulator("localhost", 8080);
  firebase
    .auth()
    .useEmulator("http://localhost:9099", { disableWarnings: true });
  firebase.database().useEmulator("localhost", 9000);
  // firebase.functions().useEmulator("localhost", 5001);
  db.settings({ merge: true });
}

export const functions = firebase.functions();

/**
 * Single exported messaging instance — shared across the whole app.
 * Returns null when the browser does not support FCM (e.g. no service worker).
 */
export const messaging = (() => {
  try {
    return firebase.messaging.isSupported() ? getMessaging() : null;
  } catch {
    return null;
  }
})();

const testAuth = () => {
  firebase
    .auth()
    .signInAnonymously()
    .then(() => {
      console.log("Auth connected and signed in anonymously.");
    })
    .catch(error => {
      console.error("Error with Auth:", error);
    });
};

const testFirestore = () => {
  const docRef = db.collection("testConnection").doc("testDoc");
  docRef
    .set({ test: "This is a test data" })
    .then(() => {
      console.log("Firestore connected and data written.");
      return docRef.get();
    })
    .then(doc => {
      if (doc.exists) {
        console.log("Firestore data read:", doc.data());
      } else {
        console.log("No such document in Firestore.");
      }
    })
    .catch(error => {
      console.error("Error with Firestore:", error);
    });
};

const testRealtimeDatabase = () => {
  const dbRef = firebase.database().ref("testConnection");
  dbRef
    .set({ test: "This is a test data" })
    .then(() => {
      console.log("Realtime Database connected and data written.");
      return dbRef.once("value");
    })
    .then(snapshot => {
      console.log("Realtime Database data read:", snapshot.val());
    })
    .catch(error => {
      console.error("Error with Realtime Database:", error);
    });
};

const testStorage = () => {
  const storageRef = firebase
    .storage()
    .ref()
    .child("testConnection/testFile.txt");
  storageRef
    .putString("This is a test file")
    .then(snapshot => {
      console.log("Storage connected and file uploaded.", snapshot);
      return storageRef.getDownloadURL();
    })
    .then(url => {
      console.log("Storage file URL:", url);
    })
    .catch(error => {
      console.error("Error with Storage:", error);
    });
};

const checkFirebaseServices = false; // set true to run all tests for checking whether your firebase services are connected and working properly
if (checkFirebaseServices) {
  testAuth();
  testRealtimeDatabase();
  testFirestore();
  testStorage();
}

export default firebase;
