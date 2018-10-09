import React from 'react';
import { render } from 'react-dom';
import 'babel-polyfill';
import firebase from 'firebase/app';
import App from './App';

window.addEventListener("DOMContentLoaded", () => {
  firebase.initializeApp({
    apiKey: "AIzaSyCmSfqCcViO_ZdiipamXdtpbHtvyeArbpQ",
    authDomain: "sourcefuse-challenge-2.firebaseapp.com",
    // databaseURL: "https://<DATABASE_NAME>.firebaseio.com",
    projectId: "sourcefuse-challenge-2",
    // storageBucket: "<BUCKET>.appspot.com",
    // messagingSenderId: "<SENDER_ID>",
  })
  render(<App />, document.getElementById('app'));
});