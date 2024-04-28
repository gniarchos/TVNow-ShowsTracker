import React from "react"
import PuffLoader from "react-spinners/PuffLoader"
import "../../App.css"

export default function Loader() {
  return (
    <div className="loader-div-global">
      <PuffLoader color={"white"} size={80} />
      <h3>Just a moment </h3>
      <p>Popcorns on the way!</p>
    </div>
  )
}
