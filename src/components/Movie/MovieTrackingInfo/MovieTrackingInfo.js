import React from "react"
import "./MovieTrackingInfo.css"
import dayjs from "dayjs"
import { Divider } from "@mui/material"

export default function MovieTrackingInfo({ movieData }) {
  function showDaysUntil(type) {
    const nextEpisodeDate =
      type === "official"
        ? dayjs(movieData.release_date)
        : dayjs(
            movieData?.release_dates.results.filter(
              (date) => date.iso_3166_1 === localStorage.getItem("userCountry")
            )[0]?.release_dates[0].release_date
          )

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

      <Divider color="white" orientation="vertical" flexItem />

      {movieData.release_dates && (
        <div className="movie-info-details">
          <span className="movie-info-titles">Local Premiere</span>
          <span className="movie-info-values">
            {movieData.release_dates.results?.filter(
              (date) => date.iso_3166_1 === localStorage.getItem("userCountry")
            ).length === 1
              ? dayjs(
                  movieData.release_dates.results?.filter(
                    (date) =>
                      date.iso_3166_1 === localStorage.getItem("userCountry")
                  )[0].release_dates[0].release_date
                ).format("DD-MM-YYYY")
              : "Not Available"}
          </span>
        </div>
      )}

      {movieData.status !== "Released" && (
        <>
          <Divider color="white" orientation="vertical" flexItem />

          <div className="movie-info-details">
            <span className="movie-info-titles">Countdown</span>
            <span
              className={
                dayjs(movieData.release_date).diff(dayjs(), "day") === 0 ||
                dayjs(movieData.release_date).format("DD-MM-YYYY") ===
                  dayjs().format("DD-MM-YYYY")
                  ? "movie-info-values rainbow rainbow_text_animated"
                  : "movie-info-values"
              }
            >
              {showDaysUntil("official")}
            </span>
          </div>
        </>
      )}

      {movieData.status === "Released" &&
        movieData.release_dates.results &&
        (() => {
          const localRelease = movieData.release_dates.results.find(
            (date) => date.iso_3166_1 === localStorage.getItem("userCountry")
          )

          if (localRelease && localRelease.release_dates.length > 0) {
            const localReleaseDate = dayjs(
              localRelease.release_dates[0].release_date
            )
            const globalReleaseDate = dayjs(movieData.release_date)

            if (
              localReleaseDate.format("YYYY-MM-DD") !==
              globalReleaseDate.format("YYYY-MM-DD")
            ) {
              const daysUntilRelease = localReleaseDate.diff(dayjs(), "day")

              // Show countdown only if the local premiere is in the future
              if (daysUntilRelease > 0) {
                return (
                  <>
                    <Divider color="white" orientation="vertical" flexItem />

                    <div className="movie-info-details">
                      <span className="movie-info-titles">Countdown</span>
                      <span
                        className={
                          daysUntilRelease === 0
                            ? "movie-info-values rainbow rainbow_text_animated"
                            : "movie-info-values"
                        }
                      >
                        {daysUntilRelease} Days
                      </span>
                    </div>
                  </>
                )
              }
            }
          }

          return null
        })()}
    </div>
  )
}
