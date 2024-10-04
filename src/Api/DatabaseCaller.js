import { collection, orderBy, getDocs } from "firebase/firestore"
// import { db } from "../services/firebase"

export async function databaseCaller(params) {
  try {
    const snapshot = await getDocs(collection(db, params.collectionName))

    const dataArray = snapshot.docs.map((doc) => doc.data())
    return dataArray
  } catch (err) {
    console.error("Error fetching data:", err)
  }
}
