import React, { useEffect, useRef } from "react"
import "./ShowSeasonsEpisodes.css"
import noImg from "../../../../images/no-image.png"
import TodayRoundedIcon from "@mui/icons-material/TodayRounded"
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded"
import dayjs from "dayjs"
import { Alert } from "@mui/material"

export default function ShowSeasonsEpisodes({
  showData,
  seasonNumber,
  setSeasonNumber,
  seasonInfo,
}) {
  const divSeasonRef = useRef("")
  const zeroPad = (num, places) => String(num).padStart(places, "0")

  useEffect(() => {
    for (let i = 0; i < divSeasonRef.current.childNodes.length; i++) {
      divSeasonRef.current.childNodes[i].classList.remove("active")
    }
    divSeasonRef.current.childNodes[0].classList.add("active")
  }, [])

  let seasons = []
  for (let i = 1; i <= showData.number_of_seasons; i++) {
    seasons.push(
      <div
        key={i}
        id={i - 1}
        onClick={() => setSeasonNumber(i)}
        className={
          i === seasonNumber
            ? "show-single-season active"
            : "show-single-season"
        }
      >
        <span>{i}</span>
      </div>
    )
  }

  function defineDaysUntil(date) {
    if (dayjs(date).format("DD-MM-YYYY") === dayjs().format("DD-MM-YYYY")) {
      return "TODAY"
    }

    if (dayjs(date).diff(dayjs(), "day") > 0) {
      if (dayjs(date).diff(dayjs(), "day") > 1) {
        return `${dayjs(date).diff(dayjs(), "day")} Days`
      } else {
        return `${dayjs(date).diff(dayjs(), "day")} Day`
      }
    }

    if (dayjs(date).diff(dayjs(), "day") === 0) {
      return "1 Day"
    }
  }

  return (
    <div>
      <h1 className="show-details-titles">Seasons & Episodes</h1>

      <div className="show-seasons-episodes-container">
        <div ref={divSeasonRef} className="show-all-seasons">
          {seasons}
        </div>

        <div className="show-episodes-container">
          {seasonInfo.episodes.length > 0 ? (
            seasonInfo.episodes.map((episode) => (
              <div
                key={episode.id}
                className="show-episode"
                onClick={() => setSeasonNumber(episode.season_number)}
              >
                <div className="show-episode-image-container">
                  {episode.still_path !== null ? (
                    <img
                      className="show-episode-img"
                      src={`https://image.tmdb.org/t/p/w500/${episode.still_path}`}
                      alt="episode-img"
                    />
                  ) : (
                    <img
                      className="show-episode-img"
                      src={noImg}
                      alt="no-img-found"
                    />
                  )}
                </div>

                <div className="show-episode-info-wrapper">
                  <div className="show-episode-info-container">
                    <span className="show-episode-num ">
                      S{zeroPad(episode.season_number, 2)} | E
                      {zeroPad(episode.episode_number, 2)}
                    </span>

                    <div className="show-episode-more-info">
                      <span className="show-episode-info">
                        <TodayRoundedIcon
                          sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}
                        />
                        {episode.air_date !== null
                          ? dayjs(episode.air_date).format("DD-MM-YYYY")
                          : "Coming Soon"}
                      </span>
                      {episode.runtime !== null && (
                        <span className="episode-more-info">•</span>
                      )}
                      {episode.runtime !== null && (
                        <span className="show-episode-info">
                          <AccessTimeRoundedIcon
                            sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}
                          />
                          {episode.runtime}'
                        </span>
                      )}
                    </div>

                    <h3 className="show-episode-name">{episode.name}</h3>

                    {/* <p>{episode.overview}</p> */}
                  </div>
                  <div className="show-episode-marker">
                    {/* TODO: if user is logged in and is watching this show, show a marker */}
                    <span
                      className={
                        dayjs(episode.air_date).diff(dayjs(), "day") === 0
                          ? "show-episode-daysUntil rainbow rainbow_text_animated"
                          : "show-episode-daysUntil"
                      }
                    >
                      {defineDaysUntil(episode.air_date)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <Alert severity="info">More episodes coming soon!</Alert>
          )}
        </div>
      </div>
    </div>
  )
}
