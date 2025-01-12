import React, { useContext, useEffect, useState } from "react"
import "./ProfileStatistics.css"
import { Chip, Divider, useMediaQuery } from "@mui/material"
import apiCaller from "../../../Api/ApiCaller"
import { LayoutContext } from "../../../components/Layout/Layout"
import { useTheme } from "@emotion/react"

export default function ProfileStatistics({
  allUserShows,
  triggerRefresh,
  setSelectedCoverImage,
  allGenres,
}) {
  const [userWatchingTime, setUserWatching] = useState({
    months: 0,
    days: 0,
    hours: 0,
  })
  const [userWatchedEpisodesCount, setUserWatchedEpisodesCount] = useState(0)
  const { setOpenSnackbar, setSnackbarMessage, setSnackbarSeverity } =
    useContext(LayoutContext)
  const [favoriteGenre, setFavoriteGenre] = useState([])
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  function convertMinutesToMonthsDaysHours(totalMinutes) {
    // Define conversion ratios
    const minutesPerHour = 60
    const hoursPerDay = 24
    const daysPerMonth = 30 // Approximate a month as 30 days

    // Calculate months, days, and hours
    const months = Math.floor(
      totalMinutes / (minutesPerHour * hoursPerDay * daysPerMonth)
    )
    const remainingMinutesAfterMonths =
      totalMinutes % (minutesPerHour * hoursPerDay * daysPerMonth)

    const days = Math.floor(
      remainingMinutesAfterMonths / (minutesPerHour * hoursPerDay)
    )
    const remainingMinutesAfterDays =
      remainingMinutesAfterMonths % (minutesPerHour * hoursPerDay)

    const hours = Math.floor(remainingMinutesAfterDays / minutesPerHour)

    return { months, days, hours }
  }

  useEffect(() => {
    apiCaller({
      url: `${process.env.REACT_APP_BACKEND_API_URL}/users/me`,
      method: "GET",
      contentType: "application/json",
      body: null,
      calledFrom: "userInfo",
      isResponseJSON: true,
      extras: null,
    })
      .then((response) => {
        const time = convertMinutesToMonthsDaysHours(
          response.total_watching_time
        )
        setUserWatching(time)
        setUserWatchedEpisodesCount(response.total_episodes)
        if (response.profile_cover_image !== null) {
          localStorage.setItem(
            "userProfileCover",
            JSON.stringify(response.profile_cover_image)
          )
          setSelectedCoverImage(response.profile_cover_image)
        }

        if (response.favorite_genre_shows !== null) {
          setFavoriteGenre(
            response.favorite_genre_shows.replace(/"/g, "").split(",")
          )
        }
      })
      .catch((error) => {
        setOpenSnackbar(true)
        setSnackbarSeverity("error")
        setSnackbarMessage(error.message)
      })
  }, [triggerRefresh])

  return (
    <div className="profile-stats-wrapper">
      <div className="profile-stats-shows-info">
        <div className="profile-stats-container">
          <span className="profile-stats-num">{allUserShows.length}</span>
          <span>|</span>
          <span className="profile-stats-title">Shows Added</span>
        </div>
        <div className="profile-stats-container">
          <span className="profile-stats-num">
            {localStorage.getItem("watchNextShowsCount") || 0}
          </span>
          <span>|</span>
          <span className="profile-stats-title">Watching</span>
        </div>

        <div className="profile-stats-container">
          <span className="profile-stats-num">
            {localStorage.getItem("watchListShowsCount") || 0}
          </span>
          <span>|</span>
          <span className="profile-stats-title">Not Started</span>
        </div>

        <div className="profile-stats-container">
          <span className="profile-stats-num">
            {localStorage.getItem("finishedShowsCount") || 0}
          </span>
          <span>|</span>
          <span className="profile-stats-title">Finished Shows</span>
        </div>

        <div className="profile-stats-container">
          <span className="profile-stats-num">
            {localStorage.getItem("stoppedShowsCount") || 0}
          </span>
          <span>|</span>
          <span className="profile-stats-title">Stopped Watching</span>
        </div>
      </div>

      <div className="profile-single-statistics">
        <div className="profile-single-statistic-container">
          <h1 className="profile-single-statistic-title">Your TV Time</h1>
          <Divider flexItem />
          <div
            style={{ marginTop: "5px" }}
            className="profile-single-statistic-content"
          >
            <div>
              <p className="profile-single-statistic-number">
                {userWatchingTime.months}
              </p>
              <p className="profile-single-statistic-subtitle">
                {userWatchingTime.months === 1 ? "MONTH" : "MONTHS"}
              </p>
            </div>
            <div>
              <p className="profile-single-statistic-number">
                {userWatchingTime.days}
              </p>
              <p className="profile-single-statistic-subtitle">
                {userWatchingTime.days === 1 ? "DAY" : "DAYS"}
              </p>
            </div>
            <div>
              <p className="profile-single-statistic-number">
                {userWatchingTime.hours}
              </p>
              <p className="profile-single-statistic-subtitle">
                {userWatchingTime.hours === 1 ? "HOUR" : "HOURS"}
              </p>
            </div>
          </div>
        </div>

        <div className="profile-single-statistic-container">
          <h1
            style={{ marginTop: "5px" }}
            className="profile-single-statistic-title"
          >
            Episodes Watched
          </h1>
          <span
            style={{
              fontSize: "0.9rem",
              fontWeight: "500",
              marginTop: "-10px",
            }}
          >
            - Total -
          </span>
          <Divider flexItem />
          <p className="profile-episodes-watched">{userWatchedEpisodesCount}</p>
        </div>

        <div
          style={{ position: "relative" }}
          className="profile-single-statistic-container"
        >
          <h1
            style={{ marginTop: "5px" }}
            className="profile-single-statistic-title"
          >
            Favorite Genres
          </h1>
          <span
            style={{
              fontSize: "0.9rem",
              fontWeight: "500",
              marginTop: "-10px",
            }}
          >
            - Top 2 -
          </span>
          <Divider flexItem />
          <p className="profile-favorite-genres-container">
            {favoriteGenre.length > 0 ? (
              favoriteGenre.map((genre, index) => {
                return (
                  <span className="profile-favorite-genres">
                    <Chip
                      color="primaryFaded"
                      sx={{
                        borderRadius: "5px",
                        fontSize: isMobile ? "0.8rem" : "1rem",
                      }}
                      size="small"
                      label={
                        allGenres.find((g) => g.id === parseInt(genre)).name
                      }
                    />
                  </span>
                )
              })
            ) : (
              <span
                style={{ marginTop: "10px" }}
                className="profile-episodes-watched"
              >
                -
              </span>
            )}
          </p>
        </div>

        <div
          style={{ position: "relative" }}
          className="profile-single-statistic-container"
        >
          <Chip
            color="primaryFaded"
            sx={{ borderRadius: "5px" }}
            size="small"
            style={{ position: "absolute", bottom: 0, right: 0 }}
            label="Coming Soon"
          />
          <h1
            style={{ marginTop: "5px" }}
            className="profile-single-statistic-title"
          >
            Episodes Watched
          </h1>
          <span
            style={{
              fontSize: "0.9rem",
              fontWeight: "500",
              marginTop: "-10px",
            }}
          >
            - Per Month -
          </span>
          <Divider flexItem />
          <p className="profile-episodes-watched">-</p>
        </div>

        {/* <div
          style={{ position: "relative" }}
          className="profile-single-statistic-container"
        >
          <Chip
            color="primaryFaded"
            sx={{ borderRadius: "5px" }}
            size="small"
            style={{ position: "absolute", bottom: 0, right: 0 }}
            label="Coming Soon"
          />
          <h1 className="profile-single-statistic-title">Best Streak</h1>
          <Divider flexItem />
          <p className="profile-episodes-watched">-</p>
        </div> */}
      </div>
    </div>
  )
}
