import React from "react"
import PuffLoader from "react-spinners/PuffLoader"
import "../../App.css"

export default function Loader() {
  return (
    <div className="loader-div-global">
      <PuffLoader color={"white"} size={100} />
      <h3>Reloading Data...</h3>
    </div>
  )
}
