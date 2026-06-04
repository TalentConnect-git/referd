// src/firebase.ts

import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyCNnLUKG4LyKqVRNma8KbspBKpAevdH2Hs",
//   apiKey:  import.meta.env.VITE_GOOGLE_CLIENT_ID ,
  authDomain: "rawrecruit-f8438.firebaseapp.com",
  projectId: "rawrecruit-f8438",
  storageBucket: "rawrecruit-f8438.firebasestorage.app",
  messagingSenderId: "995991676726",
  appId: "1:995991676726:web:d349b0b17d90affe15f597"
};

export const app = initializeApp(firebaseConfig);