import React from "react"
import "./ProfileEpisodes.css"
import { Link } from "react-router-dom"
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded"
import { IconButton } from "@mui/material"

export default function ProfileEpisodes({
  showInfo,
  seasonInfo,
  seasonNumber,
  episodeNumber,
  handleMarkAsWatched,
  index,
}) {
  const zeroPad = (num, places) => String(num).padStart(places, "0")

  function defineEpisodesInfo() {
    if (seasonNumber === 0 && episodeNumber === 0) return false

    if (seasonNumber === parseInt(showInfo.number_of_seasons) - 1) return false

    if (seasonInfo.episodes.length - (episodeNumber + 1) === 0) return false

    return true
  }

  function definePremiereOrFinale() {
    if (seasonNumber === 0 && episodeNumber === 0) return "PREMIERE"

    if (seasonNumber === parseInt(showInfo.number_of_seasons) - 1)
      return "SERIES FINALE"

    return "Season Finale"
  }

  return (
    <div className="profile-episode-wrapper">
      <div className="profile-episode-img-container">
        <img
          className="profile-episode-img"
          src={`https://image.tmdb.org/t/p/w500/${showInfo.backdrop_path}`}
          alt="show"
        />
      </div>

      <div className="profile-episode-container">
        <div className="profile-episode-info">
          <Link
            className="profile-show-name"
            to={`/show?show_name=${showInfo.name}&show_id=${showInfo.id}`}
          >
            {showInfo.name}
          </Link>

          <div className="profile-episode-numbers-container">
            <span className="profile-season-episode-number">
              S{zeroPad(seasonNumber + 1, 2)} | E{zeroPad(episodeNumber + 1, 2)}
            </span>

            {/* TODO: show episodes left for only aired episodes */}
            {defineEpisodesInfo() ? (
              <span className="profile-episodes-left">
                +{seasonInfo.episodes.length - (episodeNumber + 1)} More
              </span>
            ) : (
              <span className="profile-episodes-left">
                {definePremiereOrFinale()}
              </span>
            )}
          </div>

          <span className="profile-episode-name">
            {seasonInfo.episodes[episodeNumber]?.name}
          </span>
        </div>

        <div className="profile-episode-action">
          <IconButton
            onClick={() => {
              handleMarkAsWatched(
                showInfo.id,
                seasonNumber,
                episodeNumber,
                index
              )
            }}
          >
            <CheckCircleRoundedIcon sx={{ fontSize: 30 }} />
          </IconButton>
        </div>
      </div>
    </div>
  )
}
