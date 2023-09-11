import firebase from "firebase/compat/app"
import "firebase/compat/auth"
import "firebase/compat/firestore"

const app = firebase.initializeApp({
  apiKey: ***REMOVED***,
  authDomain: "tvtime-app-tracker.firebaseapp.com",
  projectId: "tvtime-app-tracker",
  storageBucket: "tvtime-app-tracker.appspot.com",
  messagingSenderId: ***REMOVED***,
  appId: ***REMOVED***,
})

export const db = firebase.firestore()
export const auth = app.auth()

export default app
