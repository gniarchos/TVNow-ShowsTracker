import React from "react"
import "./DetailedShowsList.css"
import { Link } from "react-router-dom"
import noImg from "../../images/no-image.png"

export default function ShowCard(props) {
  const list = props.allShows.map((list) => {
    return (
      <Link
        to={`/show?show_name=${list.name}&show_id=${list.id}`}
        key={list.id}
        className="card-show-content"
      >
        <div className="card-show-img-container">
          {list.poster_path !== null ? (
            <img
              className="card-show-img"
              src={`https://image.tmdb.org/t/p/w500/${list.poster_path}`}
              alt="show"
            />
          ) : (
            <img className="card-info-no-img" src={noImg} alt="not-found" />
          )}
        </div>
        <p className="card-show-title">{list.name}</p>
      </Link>
    )
  })
  return <div className="detailedSlider-div">{list}</div>
}
