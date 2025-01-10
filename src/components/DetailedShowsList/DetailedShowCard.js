import React, { useContext } from "react"
import "./DetailedShowCard.css"
import { Link } from "react-router-dom"
import noImg from "../../images/no-image.png"
import { LayoutContext } from "../Layout/Layout"

export default function ShowCard({ allShows }) {
  const [imageLoaded, setImageLoaded] = React.useState(false)
  const [imageError, setImageError] = React.useState(false)

  const { showsORmovies } = useContext(LayoutContext)

  function defineURLPath(list) {
    switch (showsORmovies) {
      case "shows":
        return `/show?show_name=${list.name}&show_id=${list.id}`
      case "movies":
        return `/movie?movie_title=${list.title}&movie_id=${list.id}`
    }
  }

  const list = allShows
    .sort((a, b) => b.popularity - a.popularity)
    .map((list) => {
      return (
        <Link
          to={defineURLPath(list)}
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
                    src={`https://image.tmdb.org/t/p/original/${list.poster_path}`}
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

            <p className="detailed-shows-card-title">
              {showsORmovies === "movies" ? list.title : list.name}
            </p>
          </div>
        </Link>
      )
    })
  return <div className="detailed-shows-card-wrapper">{list}</div>
}
