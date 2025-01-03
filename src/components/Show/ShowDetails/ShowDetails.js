import React from "react"
import "./ShowDetails.css"
import ReactPlayer from "react-player"
import dayjs from "dayjs"
import ShowSeasonsEpisodes from "./ShowSeasonsEpisodes/ShowSeasonsEpisodes"
import ShowCastCrew from "./ShowCastCrew/ShowCastCrew"
import { Link } from "react-router-dom"
import noImg from "../../../images/no-image.png"

export default function ShowDetails({
  showData,
  seasonNumber,
  setSeasonNumber,
  seasonInfo,
  userShowInfo,
  showInUserList,
  loadingEpisodes,
}) {
  function findTrailerKey() {
    const key = showData.videos.results
      .sort((a, b) => dayjs(a.published_at) - dayjs(b.published_at))
      .filter((vid) => vid.type.includes("Trailer"))

    if (key.length === 0) {
      return null
    } else {
      return key[0].key
    }
  }
  const recommending = showData.recommendations?.results
    .slice(0, 10)
    .map((recommend) => {
      return (
        <Link
          onClick={() => window.scrollTo(0, 0)}
          key={recommend.id}
          to={`/show?show_name=${recommend.name}&show_id=${recommend.id}`}
          className="show-details-recommending-show"
        >
          <div className="show-details-recommending-img-wrapper">
            {recommend.backdrop_path !== null ? (
              <img
                className="show-details-recommending-img"
                src={`https://image.tmdb.org/t/p/w500/${recommend.backdrop_path}`}
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
          <h3 className="show-details-recommending-name">{recommend.name}</h3>
        </Link>
      )
    })

  return (
    <div className="show-details-wrapper">
      <div className="show-details-synopsis">
        {showData.overview !== "" && (
          <h1 className="show-details-titles">Storyline</h1>
        )}
        {showData.overview !== "" && (
          <p className="show-details-synopsis-text">{showData.overview}</p>
        )}
      </div>

      {/* TODO: if user has started watching the show show trailer based on latest season */}
      {showData.videos?.results?.length > 0 && findTrailerKey() !== null && (
        <div className="show-details-trailers">
          <ReactPlayer
            width={"100%"}
            height={"100%"}
            url={`https://www.youtube.com/watch?v=${findTrailerKey()}`}
          />
        </div>
      )}

      <ShowSeasonsEpisodes
        showData={showData}
        seasonNumber={seasonNumber}
        setSeasonNumber={setSeasonNumber}
        seasonInfo={seasonInfo}
        userShowInfo={userShowInfo}
        showInUserList={showInUserList}
        loadingEpisodes={loadingEpisodes}
      />

      <ShowCastCrew showData={showData} />

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
