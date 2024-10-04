import firebase from "firebase/compat/app"
import "firebase/compat/auth"
import "firebase/compat/firestore"

const app = firebase.initializeApp({
  apiKey: "AIzaSyAmeiMX4qukXsrVAiFJSpL6SONtqiSmjJ0",
  authDomain: "tvtime-app-tracker.firebaseapp.com",
  projectId: "tvtime-app-tracker",
  storageBucket: "tvtime-app-tracker.appspot.com",
  messagingSenderId: "480145488948",
  appId: "1:480145488948:web:e185b0343c5681d7ef1e61",
})

export const db = firebase.firestore()
export const auth = app.auth()

export default app
