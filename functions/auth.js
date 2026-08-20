const admin = require("firebase-admin");

if (process.env.VITE_APP_FIREBASE_USE_EMULATOR === "true") {
  admin.initializeApp({
    databaseURL: process.env.VITE_APP_FIREBASE_DATABASE_URL
  });
} else {
  const serviceAccount = require("./private/cl-dev-pk.json");
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.VITE_APP_FIREBASE_DATABASE_URL
  });
}

const db = admin.firestore();
const rtdb = admin.database();

module.exports = {
  db,
  rtdb,
  admin
};
