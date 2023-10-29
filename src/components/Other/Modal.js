import React from "react"
import "./Modal.css"
import { Icon } from "@iconify/react"

export default function Modal(props) {
  const cancelled_list = Array.from(props.cancelled_shows).map((show) => {
    return (
      <div className="cancelled-shows-container">
        <p className="show_canceled_name">
          <Icon icon="fluent:movies-and-tv-16-filled" width={40} /> {show}
        </p>
      </div>
    )
  })

  return (
    <div
      className={
        props.state === true ? "modal_container isShown" : "modal_container"
      }
    >
      <div className={props.state === true ? "modalShow" : "modal"}>
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
