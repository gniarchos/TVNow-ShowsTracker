import React from "react"
import "./ShowsList.css"
import { Link } from "react-router-dom"

export default function ShowsList(props) {
  document.title = "Watchee | Shows Tracker"

  const show_title = React.useRef("")
  const divRef = React.useRef("")

  const list = props.listOfShows.slice(0, 12).map((list, index) => {
    return (
      <Link
        to={`/show?show_name=${list.name}&show_id=${list.id}`}
        key={list.id}
        className="show-card-content"
      >
        {props.section !== "Discover" && props.section !== "On The Air" && (
          <p className="show-card-num">{index + 1}</p>
        )}
        <div className="cards-wrapper">
          <div className="img-trend-container">
            <img
              className="show-card-img"
              src={`https://image.tmdb.org/t/p/w500/${list.poster_path}`}
              alt="show"
            />
          </div>

          <p ref={show_title} className="show-card-title">
            {list.name}
          </p>
        </div>
      </Link>
    )
  })

  return (
    <div>
      <div className="title-link">
        <h1 className="show-card-section">{props.section}</h1>
        <Link
          to={`/discover?title=${props.section}&type=${props.type}&page=1`}
          className="viewMore-button"
        >
          View More
        </Link>
      </div>

      <div ref={divRef} className="show-card-div">
        {list}
      </div>
    </div>
  )
}
