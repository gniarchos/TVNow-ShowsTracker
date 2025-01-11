import React from "react"
import "./MovieDetails.css"
import ReactPlayer from "react-player"
import dayjs from "dayjs"
import MovieCastCrew from "./MovieCastCrew/MovieCastCrew"
import { Link } from "react-router-dom"
import noImg from "../../../images/no-image.png"

export default function MovieDetails({
  movieData,
  // setSeasonNumber,
  // seasonInfo,
  userMovieInfo,
  // showInUserList,
  // loadingEpisodes,
  // setUserShowInfo,
}) {
  function findTrailerKey() {
    const key = movieData.videos.results
      .sort((a, b) => dayjs(a.published_at) - dayjs(b.published_at))
      .filter((vid) => vid.type.includes("Trailer"))

    if (key.length === 0) {
      return null
    } else {
      return key[0].key
    }
  }
  const recommending = movieData.recommendations?.results
    .slice(0, 10)
    .map((recommend) => {
      return (
        <Link
          onClick={() => window.scrollTo(0, 0)}
          key={recommend.id}
          to={`/movie?movie_title=${recommend.title}&movie_id=${recommend.id}`}
          className="movie-details-recommending-movie"
        >
          <div className="movie-details-recommending-img-wrapper">
            {recommend.backdrop_path !== null ? (
              <img
                className="movie-details-recommending-img"
                src={`https://image.tmdb.org/t/p/original/${recommend.backdrop_path}`}
                alt="movie-recommendation"
              />
            ) : (
              <img
                className="movie-details-recommending-img"
                src={noImg}
                alt="not-found"
              />
            )}
          </div>
          <h3 className="movie-details-recommending-name">{recommend.title}</h3>
        </Link>
      )
    })

  return (
    <div className="movie-details-wrapper">
      <div className="movie-details-synopsis">
        {movieData.overview !== "" && (
          <h1 className="movie-details-titles">Storyline</h1>
        )}
        {movieData.overview !== "" && (
          <p className="movie-details-synopsis-text">{movieData.overview}</p>
        )}
      </div>

      {movieData.videos?.results?.length > 0 && findTrailerKey() !== null && (
        <div className="movie-details-trailers">
          <ReactPlayer
            width={"100%"}
            height={"100%"}
            url={`https://www.youtube.com/watch?v=${findTrailerKey()}`}
          />
        </div>
      )}

      <MovieCastCrew movieData={movieData} />

      {recommending.length > 0 && (
        <div className="movie-details-recommendations-wrapper">
          <h1 className="movie-details-titles">More like this</h1>
          <div className="movie-details-recommendations-container">
            {recommending}
          </div>
        </div>
      )}
    </div>
  )
}
