import React from "react"
import "./ProfileEpisodes.css"
import { Link } from "react-router-dom"
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded"
import { IconButton, useMediaQuery } from "@mui/material"
import dayjs from "dayjs"
import { ColorRing } from "react-loader-spinner"
import TodayRoundedIcon from "@mui/icons-material/TodayRounded"
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded"
import { useTheme } from "@emotion/react"
import RemoveRedEyeRoundedIcon from "@mui/icons-material/RemoveRedEyeRounded"
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded"

export default function ProfileEpisodes({
  showInfo,
  seasonInfo,
  seasonNumber,
  episodeNumber,
  handleMarkAsWatched,
  index,
  sectionType,
  spinnerLoader,
  finishedInfo,
  stoppedInfo,
}) {
  const zeroPad = (num, places) => String(num).padStart(places, "0")
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  function showDaysUntil() {
    if (showInfo.next_episode_to_air === null) {
      return "TBA"
    }

    const episodeAirDate = dayjs(seasonInfo?.episodes[episodeNumber].air_date)
    const today = dayjs()

    // Check if the episode airs today
    if (episodeAirDate.isSame(today, "day")) {
      return "TODAY"
    }

    // Calculate the difference in days
    const daysUntil = episodeAirDate
      .startOf("day")
      .diff(today.startOf("day"), "day")

    if (daysUntil === 1) {
      return "1 Day"
    } else if (daysUntil > 1) {
      return `${daysUntil} Days`
    } else {
      return "TBA" // For cases where the air date has already passed or is invalid
    }
  }

  function defineEpisodesInfo() {
    if (seasonInfo !== null) {
      // PREMIERE
      if (episodeNumber === 0) return false

      // SERIES FINALE
      if (
        seasonNumber === parseInt(showInfo.number_of_seasons) - 1 &&
        episodeNumber === seasonInfo?.episodes.length - 1 &&
        showInfo.status === "Ended"
      )
        return false

      // SEASON FINALE
      if (seasonInfo?.episodes.length - (episodeNumber + 1) === 0) return false

      // OTHER
      return true
    } else {
      return false
    }
  }

  function definePremiereOrFinale() {
    if (seasonInfo === null) return ""

    if (seasonInfo?.episodes[episodeNumber]?.air_date === null) return ""

    if (episodeNumber === 0) return "Premiere"

    if (
      seasonNumber === parseInt(showInfo.number_of_seasons) - 1 &&
      episodeNumber === seasonInfo?.episodes.length - 1 &&
      showInfo.status === "Ended"
    )
      return "Series Finale"

    if (
      seasonInfo?.episodes.length - (episodeNumber + 1) === 0 &&
      seasonInfo?.episodes[episodeNumber].episode_type === "finale"
    ) {
      return "Season Finale"
    } else {
      return "Premiere"
    }
  }

  if (sectionType === "finished") {
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
          <div className="profile-episode-info finished-shows">
            <Link
              className="profile-show-name"
              to={`/show?show_name=${showInfo.name}&show_id=${showInfo.id}`}
            >
              {showInfo.name}
            </Link>

            <span className="profile-season-episode-number">
              Total Seasons: {seasonNumber + 1}
            </span>
            <span className="profile-season-episode-number">
              Total Episodes: {showInfo.number_of_episodes}
            </span>

            <span className="profile-season-episode-number finished-info">
              <RemoveRedEyeRoundedIcon sx={{ fontSize: "1.2rem" }} />{" "}
              {dayjs(finishedInfo.last_updated).format("DD-MM-YYYY")}
            </span>
          </div>
        </div>
      </div>
    )
  } else if (sectionType === "stopped") {
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
          <div className="profile-episode-info finished-shows">
            <Link
              className="profile-show-name"
              to={`/show?show_name=${showInfo.name}&show_id=${showInfo.id}`}
            >
              {showInfo.name}
            </Link>

            <span className="profile-season-episode-number">
              Stopped watching at: S{zeroPad(seasonNumber + 1, 2)} | E
              {zeroPad(episodeNumber + 1, 2)}
            </span>

            <span className="profile-season-episode-number finished-info">
              <RemoveRedEyeRoundedIcon sx={{ fontSize: "1.2rem" }} />{" "}
              {dayjs(stoppedInfo.last_updated).format("DD-MM-YYYY")}
            </span>
          </div>
        </div>
      </div>
    )
  } else if (sectionType === "history") {
    return (
      <div className="profile-episode-wrapper-history">
        <div className="profile-episode-img-container-history">
          <img
            className="profile-episode-img"
            src={`https://image.tmdb.org/t/p/w500/${showInfo.backdrop_path}`}
            alt="show"
          />
        </div>

        <div className="profile-episode-container-history">
          <div className="profile-episode-info history">
            <div className="profile-show-name-more-actions-history">
              <Link
                className="profile-show-name history"
                to={`/show?show_name=${showInfo.name}&show_id=${showInfo.id}`}
              >
                {showInfo.name}{" "}
              </Link>

              <IconButton
                aria-label="more"
                id="long-button"
                onClick={() => alert("Coming Soon!")}
              >
                <DeleteForeverRoundedIcon fontSize="small" color="error" />
              </IconButton>
            </div>

            <div className="profile-season-episode-number-history-container">
              <span className="profile-season-episode-number">
                S{zeroPad(seasonNumber + 1, 2)} | E
                {zeroPad(episodeNumber + 1, 2)}
              </span>
              &bull;
              <span className="profile-season-episode-number history-info">
                <RemoveRedEyeRoundedIcon sx={{ fontSize: "1.2rem" }} />{" "}
                {dayjs(stoppedInfo.watched_at).format("DD-MM-YYYY")}
              </span>
            </div>

            <span className="profile-episode-name">
              {seasonInfo.episodes[episodeNumber].name}
            </span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="profile-episode-wrapper">
      <div className="profile-episode-img-container">
        {showInfo.last_episode_to_air === null && (
          <span className="profile-episode-new-series">NEW SERIES</span>
        )}

        {showInfo.next_episode_to_air !== null &&
          sectionType === "upToDate" && (
            <span className="profile-episode-next-air-date">
              <TodayRoundedIcon
                sx={{ fontSize: isMobile ? "0.9rem" : "1rem" }}
              />{" "}
              {dayjs(seasonInfo?.episodes[episodeNumber].air_date).format(
                "DD-MM-YYYY"
              )}
            </span>
          )}

        {seasonInfo?.episodes[episodeNumber]?.runtime !== null &&
          sectionType !== "upToDate" &&
          showInfo.last_episode_to_air !== null && (
            <span className="profile-episode-runtime">
              <AccessTimeRoundedIcon
                sx={{ fontSize: isMobile ? "0.9rem" : "1rem" }}
              />{" "}
              {seasonInfo?.episodes[episodeNumber]?.runtime}'
            </span>
          )}

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
                +{seasonInfo?.episodes.length - (episodeNumber + 1)} More
              </span>
            ) : (
              <span className="profile-episodes-left">
                {definePremiereOrFinale()}
              </span>
            )}
          </div>

          <span className="profile-episode-name">
            {seasonInfo === null
              ? "TBA"
              : seasonInfo?.episodes[episodeNumber]?.name}
          </span>
        </div>

        {showInfo.last_episode_to_air !== null ? (
          <div className="profile-episode-action">
            {sectionType !== "upToDate" ? (
              spinnerLoader.length !== 0 && !spinnerLoader[index] ? (
                <IconButton
                  onClick={() => {
                    handleMarkAsWatched(
                      showInfo,
                      showInfo.id,
                      seasonNumber,
                      episodeNumber,
                      index
                    )
                  }}
                >
                  <CheckCircleRoundedIcon sx={{ fontSize: 30 }} />
                </IconButton>
              ) : (
                <ColorRing
                  visible={true}
                  height="35"
                  width="35"
                  ariaLabel="color-ring-loading"
                  wrapperStyle={{ marginTop: "5px", marginRight: "5px" }}
                  wrapperClass="color-ring-wrapper"
                  colors={[
                    "#e15b64",
                    "#f47e60",
                    "#f8b26a",
                    "#abbd81",
                    "#849b87",
                  ]}
                />
              )
            ) : seasonInfo !== null ? (
              <span
                className={
                  dayjs(seasonInfo?.episodes[episodeNumber]?.air_date).diff(
                    dayjs(),
                    "day"
                  ) === 0 ||
                  dayjs(seasonInfo?.episodes[episodeNumber]?.air_date).format(
                    "DD-MM-YYYY"
                  ) === dayjs().format("DD-MM-YYYY")
                    ? "profile-episode-days-until rainbow rainbow_text_animated"
                    : "profile-episode-days-until"
                }
              >
                {showDaysUntil()}
              </span>
            ) : (
              <span className="profile-episode-days-until">TBA</span>
            )}
          </div>
        ) : (
          <span
            className={
              dayjs(seasonInfo?.episodes[episodeNumber]?.air_date).diff(
                dayjs(),
                "day"
              ) === 0 ||
              dayjs(seasonInfo?.episodes[episodeNumber]?.air_date).format(
                "DD-MM-YYYY"
              ) === dayjs().format("DD-MM-YYYY")
                ? "profile-episode-days-until rainbow rainbow_text_animated"
                : "profile-episode-days-until"
            }
          >
            {showDaysUntil()}
          </span>
        )}
      </div>
    </div>
  )
}
