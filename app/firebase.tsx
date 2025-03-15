// Import necessary functions from Firebase SDK
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, get } from 'firebase/database';

// Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyBOpJN34ww_a0u51CcYuVCAS8X6yiU7f4c",
  authDomain: "nic-validation.firebaseapp.com",
  databaseURL: "https://nic-validation-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "nic-validation",
  storageBucket: "nic-validation.firebasestorage.app",
  messagingSenderId: "680633926042",
  appId: "1:680633926042:web:d4f3bd395dd8ec267f7a23",
  measurementId: "G-SMWJNS2F72"
};

// Initialize Firebase app
const firebaseApp = initializeApp(firebaseConfig);

// Get a reference to the Firebase Realtime Database
const database = getDatabase(firebaseApp);

// Function to push data to Firebase Realtime Database
const pushToDatabase = async (path: string, data: any) => {
  const dataRef = ref(database, path);
  try {
    await set(dataRef, data);
    console.log("Data saved successfully");
  } catch (error) {
    console.error("Error saving data to Firebase:", error);
  }
};

// Function to fetch data from Firebase Realtime Database
const fetchFromDatabase = async (path: string) => {
  const dataRef = ref(database, path);
  try {
    const snapshot = await get(dataRef);
    if (snapshot.exists()) {
      return snapshot.val(); // Return the fetched data
    } else {
      console.log("No data available at path:", path);
      return null; // No data found at the path
    }
  } catch (error) {
    console.error("Error fetching data from Firebase:", error);
    return null;
  }
};

// Export the database, push, and fetch functions to be used in other parts of your app
export { database, pushToDatabase, fetchFromDatabase };