import React from "react"
import PuffLoader from "react-spinners/PuffLoader"
import "../../App.css"
import { Icon } from "@iconify/react/dist/iconify.js"

export default function Loader() {
  return (
    <div className="loader-div-global">
      <PuffLoader color={"white"} size={80} />
      <h3>Just a moment </h3>
      <p>
        Hold tight, the popcorn's almost ready!{" "}
        <Icon icon="fluent-emoji:popcorn" />
      </p>
    </div>
  )
}
