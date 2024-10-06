import React from "react"
import "./DetailedShowCard.css"
import { Link } from "react-router-dom"
import noImg from "../../images/no-image.png"

export default function ShowCard({ allShows }) {
  const list = allShows.map((list) => {
    return (
      <Link
        to={`/show?show_name=${list.name}&show_id=${list.id}`}
        key={list.id}
        className="detailed-shows-card-content"
      >
        <div className="detailed-shows-card-content">
          <div className="detailed-shows-card-img-wrapper">
            {list.poster_path !== null ? (
              <img
                className="detailed-shows-card-img"
                src={`https://image.tmdb.org/t/p/w500/${list.poster_path}`}
                alt="show"
              />
            ) : (
              <img
                className="detailed-shows-card-no-img"
                src={noImg}
                alt="not-found"
              />
            )}
          </div>

          <p className="detailed-shows-card-title">{list.name}</p>
        </div>
      </Link>
    )
  })
  return <div className="detailed-shows-card-wrapper">{list}</div>
}
