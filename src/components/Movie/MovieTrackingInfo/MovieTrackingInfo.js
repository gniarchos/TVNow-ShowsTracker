import React from "react"
import "./MovieTrackingInfo.css"
import dayjs from "dayjs"
import { Divider } from "@mui/material"

export default function MovieTrackingInfo({ movieData }) {
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
    <div className="movie-info-container">
      {movieData.release_date && (
        <div className="movie-info-details">
          <span className="movie-info-titles">Release Date</span>
          <span className="movie-info-values">
            {dayjs(movieData.release_date).format("DD-MM-YYYY")}
          </span>
        </div>
      )}

      {movieData.status !== "Released" && (
        <>
          <Divider color="white" orientation="vertical" flexItem />

          <div className="movie-info-details">
            <span className="movie-info-titles">Premiere Countdown</span>
            <span
              className={
                dayjs(movieData.release_date).diff(dayjs(), "day") === 0 ||
                dayjs(movieData.release_date).format("DD-MM-YYYY") ===
                  dayjs().format("DD-MM-YYYY")
                  ? "movie-info-values rainbow rainbow_text_animated"
                  : "movie-info-values"
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
