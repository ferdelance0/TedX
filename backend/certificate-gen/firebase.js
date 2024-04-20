const { initializeApp } = require("firebase/app");
const firebaseConfig = {
    apiKey: "AIzaSyDoxIsof993-vbK3aqSsl1HCTSLoSN2RhQ",
    authDomain: "storage-cee65.firebaseapp.com",
    projectId: "storage-cee65",
    storageBucket: "storage-cee65.appspot.com",
    messagingSenderId: "542807162743",
    appId: "1:542807162743:web:9a500ca41c2080a1e9eb72",
    measurementId: "G-HDBML2V7R3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

module.exports = app;