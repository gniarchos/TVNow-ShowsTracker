import { useState, useEffect } from "react"
import { collection, orderBy, getDocs } from "firebase/firestore" // Assuming Firebase v9 syntax
import { db } from "../services/firebase"

export async function databaseCaller(
  collectionName,
  orderByField = null,
  orderByDirection = "asc"
) {
  console.log("run", collectionName)
  try {
    const snapshot = await getDocs(
      collection(db, collectionName),
      orderByField
        ? orderBy(collectionName, orderByField, orderByDirection)
        : []
    )

    const dataArray = snapshot.docs.map((doc) => doc.data())
    return dataArray
  } catch (err) {
    console.error("Error fetching data:", err)
  }
}
