import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js';
import { getDatabase, ref, set } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js';

const firebaseConfig = {
  apiKey: "AIzaSyDrlJsiWICJzkNQ7Cxpqyr0Mz7MkSTi6_A",
  authDomain: "chatify-web-app.firebaseapp.com",
  databaseURL: "https://chatify-web-app-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "chatify-web-app",
  storageBucket: "chatify-web-app.firebasestorage.app",
  messagingSenderId: "192824725937",
  appId: "1:192824725937:web:898dfb1c6cd9a509c4ed90",
  measurementId: "G-M73NHDGL0B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);
const firestoreDb = getFirestore(app);

// Exporting all components
export { app, auth, database, firestoreDb, ref, set };
