// TODO: Replace the following with your app's Firebase project configuration

import axios from "axios";
import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth } from "firebase/auth";

// See: https://firebase.google.com/docs/web/learn-more#config-object
const firebaseConfig = {
    apiKey: import.meta.env.VITE_API_KEY,
    authDomain: import.meta.env.VITE_AUTH_DOMAIN,
    databaseURL: "https://likewise-learn-default-rtdb.firebaseio.com",
    projectId: import.meta.env.VITE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_APP_ID,
    measurementId: import.meta.env.VITE_MEASUREMENT_ID
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const authentication = getAuth();
  const provider = new GoogleAuthProvider();

  const checkPaidUser = async () => {
    isPaidUser = await axios.post('http://localhost:5000/get-customer', {
      "key": import.meta.env.VITE_EXTRACTOR_KEY,
      "email": authentication.currentUser.email
    })
    
    console.log(isPaidUser)

    if(isPaidUser == "true") {
      console.log("True!!!!")
      return true;
    } else {
      console.log("False!!!!")
      return false;
    }
  }

  const paidUser = checkPaidUser();
  
  export {authentication , provider , paidUser};