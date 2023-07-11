import React, { useContext, useEffect } from "react"
import { auth, db } from "../services/firebase"
import { serverTimestamp } from "firebase/firestore"

const AuthContext = React.createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = React.useState()
  const [loading, setLoading] = React.useState(true)

  async function signup(email, password, username, fname, lname) {
    // return auth
    //   .createUserWithEmailAndPassword(email, password)
    //   .then((cred) => {
    //     return db.collection("users").doc(cred.user.uid).set({
    //       username: username,
    //       fname: fname,
    //       lname: lname,
    //       member_since: serverTimestamp(),
    //       watching_time: 0,
    //       total_episodes: 0,
    //       profile_cover_selection: "default",
    //     })
    //   })
    try {
      const cred = await auth.createUserWithEmailAndPassword(email, password)
      await db.collection("users").doc(cred.user.uid).set({
        username: username,
        fname: fname,
        lname: lname,
        member_since: serverTimestamp(),
        watching_time: 0,
        total_episodes: 0,
        profile_cover_selection: "default",
      })
    } catch (error) {
      return error.code
    }
  }

  function login(email, password) {
    return auth.signInWithEmailAndPassword(email, password)
  }

  function logout() {
    return auth.signOut()
  }

  function resetPassword(email) {
    return auth.sendPasswordResetEmail(email)
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const value = {
    currentUser,
    signup,
    login,
    logout,
    resetPassword,
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
