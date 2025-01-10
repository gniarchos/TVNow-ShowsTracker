import React from "react"
import "./MovieTrackingInfo.css"
import dayjs from "dayjs"
import { Divider } from "@mui/material"

export default function MovieTrackingInfo({ movieData }) {
  function showNextEpisodeDate() {
    if (movieData.status === "Ended") {
      return "Ended Series"
    } else if (movieData.status === "Canceled") {
      return "Canceled Series"
    } else {
      if (movieData.next_episode_to_air === null) {
        return "TBA"
      } else {
        return dayjs(movieData.next_episode_to_air?.air_date).format(
          "DD-MM-YYYY"
        )
      }
    }
  }

  function showDaysUntil() {
    const nextEpisodeDate = dayjs(movieData.release_date)
    const today = dayjs()

    // Calculate the difference in days
    const daysUntil = nextEpisodeDate
      .startOf("day")
      .diff(today.startOf("day"), "day")

    if (daysUntil === 0) {
      return "TODAY"
    }

    // Handle singular or plural days
    if (daysUntil === 1) {
      return "1 Day"
    } else {
      return `${daysUntil} Days`
    }
  }

  return (
    <div className="show-info-container">
      {movieData.release_date && (
        <div className="show-info-details">
          <span className="show-info-titles">Release Date</span>
          <span className="show-info-values">
            {dayjs(movieData.release_date).format("DD-MM-YYYY")}
          </span>
        </div>
      )}

      {/* {movieData.last_air_date !== null && (
        <Divider color="white" orientation="vertical" flexItem />
      )} */}

      {/* <div className="show-info-details">
        <span className="show-info-titles">
          {movieData.last_air_date === null &&
          (movieData.status !== "Ended" || movieData.status !== "Canceled")
            ? "Premiere"
            : "Next Episode"}
        </span>
        <span className="show-info-values">{showNextEpisodeDate()}</span>
      </div> */}

      {movieData.status !== "Released" && (
        <>
          <Divider color="white" orientation="vertical" flexItem />

          <div className="show-info-details">
            <span className="show-info-titles">Premiere Countdown</span>
            <span
              className={
                dayjs(movieData.release_date).diff(dayjs(), "day") === 0 ||
                dayjs(movieData.release_date).format("DD-MM-YYYY") ===
                  dayjs().format("DD-MM-YYYY")
                  ? "show-info-values rainbow rainbow_text_animated"
                  : "show-info-values"
              }
            >
              {showDaysUntil()}
            </span>
          </div>
        </>
      )}
    </div>
  )
}
