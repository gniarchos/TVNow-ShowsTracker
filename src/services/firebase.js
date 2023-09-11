import firebase from "firebase/compat/app"
import "firebase/compat/auth"
import "firebase/compat/firestore"

const app = firebase.initializeApp({
  apiKey: "xxxxxx",
  authDomain: "tvtime-app-tracker.firebaseapp.com",
  projectId: "tvtime-app-tracker",
  storageBucket: "tvtime-app-tracker.appspot.com",
  messagingSenderId: "xxxxxx",
  appId: "xxxxxx",
})

export const db = firebase.firestore()
export const auth = app.auth()

export default app
