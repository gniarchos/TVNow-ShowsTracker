import React from "react"
import "./Modal.css"
import { Icon } from "@iconify/react"

export default function Modal(props) {
  const [style, setStyle] = React.useState("modal")
  const [backgroundStyle, setBackgroundStyle] = React.useState("")

  const cancelled_list = Array.from(props.cancelled_shows).map((show) => {
    return (
      <div className="cancelled-shows-container">
        <p className="show_canceled_name">
          <Icon icon="fluent:movies-and-tv-16-filled" width={40} /> {show}
        </p>
      </div>
    )
  })

  React.useEffect(() => {
    setTimeout(function () {
      if (style === "modal" && props.state === true) {
        setStyle("modalShow")
        setBackgroundStyle("coverSelection_container")
      }
    }, 1500)

    setTimeout(function () {
      if (style === "modalShow" || props.state === false) {
        setStyle("modal")
        setBackgroundStyle("")
      }
    }, 200)
  }, [props.state])

  return (
    <div className={backgroundStyle}>
      <div className={style}>
        <div className="modal-content">
          <div className="modal-main">
            <h3>
              {cancelled_list.length > 1
                ? "The following shows got cancelled:"
                : "The following show got cancelled:"}
            </h3>
            {cancelled_list}
            <button className="modal-button" onClick={() => props.closeModal()}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
