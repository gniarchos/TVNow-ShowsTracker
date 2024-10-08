import React from "react"
import "./DetailedShowCard.css"
import { Link } from "react-router-dom"
import noImg from "../../images/no-image.png"

export default function ShowCard({ allShows }) {
  const [imageLoaded, setImageLoaded] = React.useState(false)
  const [imageError, setImageError] = React.useState(false)

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
              <>
                {!imageLoaded && !imageError && (
                  <img
                    className="detailed-shows-card-img"
                    src={noImg}
                    alt="not-found"
                  />
                )}

                <img
                  className="detailed-shows-card-img"
                  style={{
                    display: imageLoaded && !imageError ? "block" : "none",
                  }}
                  src={`https://image.tmdb.org/t/p/w500/${list.poster_path}`}
                  alt="showPoster"
                  onLoad={() => setImageLoaded(true)}
                  onError={() => setImageError(true)}
                />
              </>
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
