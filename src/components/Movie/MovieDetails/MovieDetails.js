import React from "react"
import "./MovieDetails.css"
import ReactPlayer from "react-player"
import dayjs from "dayjs"
import MovieCastCrew from "./MovieCastCrew/MovieCastCrew"
import { Link } from "react-router-dom"
import noImg from "../../../images/no-image.png"

export default function MovieDetails({
  movieData,
  seasonNumber,
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
          to={`/movie?movie_title=${recommend.title}&show_id=${recommend.id}`}
          className="show-details-recommending-show"
        >
          <div className="show-details-recommending-img-wrapper">
            {recommend.backdrop_path !== null ? (
              <img
                className="show-details-recommending-img"
                src={`https://image.tmdb.org/t/p/original/${recommend.backdrop_path}`}
                alt="show-recommendation"
              />
            ) : (
              <img
                className="show-details-recommending-img"
                src={noImg}
                alt="not-found"
              />
            )}
          </div>
          <h3 className="show-details-recommending-name">{recommend.title}</h3>
        </Link>
      )
    })

  return (
    <div className="show-details-wrapper">
      <div className="show-details-synopsis">
        {movieData.overview !== "" && (
          <h1 className="show-details-titles">Storyline</h1>
        )}
        {movieData.overview !== "" && (
          <p className="show-details-synopsis-text">{movieData.overview}</p>
        )}
      </div>

      {/* TODO: if user has started watching the show show trailer based on latest season */}
      {movieData.videos?.results?.length > 0 && findTrailerKey() !== null && (
        <div className="show-details-trailers">
          <ReactPlayer
            width={"100%"}
            height={"100%"}
            url={`https://www.youtube.com/watch?v=${findTrailerKey()}`}
          />
        </div>
      )}

      {/* <ShowSeasonsEpisodes
        movieData={movieData}
        seasonNumber={seasonNumber}
        setSeasonNumber={setSeasonNumber}
        seasonInfo={seasonInfo}
        userShowInfo={userShowInfo}
        showInUserList={showInUserList}
        loadingEpisodes={loadingEpisodes}
        setUserShowInfo={setUserShowInfo}
      /> */}

      <MovieCastCrew movieData={movieData} />

      {recommending.length > 0 && (
        <div className="show-details-recommendations-wrapper">
          <h1 className="show-details-titles">More like this</h1>
          <div className="show-details-recommendations-container">
            {recommending}
          </div>
        </div>
      )}
    </div>
  )
}
