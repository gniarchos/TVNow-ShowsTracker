import React, { useContext, useEffect, useState } from "react"
import "./ProfileStatistics.css"
import { Chip, Divider } from "@mui/material"
import apiCaller from "../../../Api/ApiCaller_NEW"
import { LayoutContext } from "../../../components/Layout/Layout"

export default function ProfileStatistics({ allUserShows, triggerRefresh }) {
  const [userWatchingTime, setUserWatching] = useState({
    months: 0,
    days: 0,
    hours: 0,
  })
  const [userWatchedEpisodesCount, setUserWatchedEpisodesCount] = useState(0)
  const { setOpenSnackbar, setSnackbarMessage, setSnackbarSeverity } =
    useContext(LayoutContext)

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
            {localStorage.getItem("watchNextShowsCount")}
          </span>
          <span>|</span>
          <span className="profile-stats-title">Watching Now</span>
        </div>

        <div className="profile-stats-container">
          <span className="profile-stats-num">0</span>
          <span>|</span>
          <span className="profile-stats-title">Up To Date</span>
        </div>

        <div className="profile-stats-container">
          <span className="profile-stats-num">
            {localStorage.getItem("watchListShowsCount")}
          </span>
          <span>|</span>
          <span className="profile-stats-title">Not Started</span>
        </div>

        <div className="profile-stats-container">
          <span className="profile-stats-num">
            {localStorage.getItem("finishedShowsCount")}
          </span>
          <span>|</span>
          <span className="profile-stats-title">Finished Shows</span>
        </div>

        <div className="profile-stats-container">
          <span className="profile-stats-num">0</span>
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
          <h1 className="profile-single-statistic-title">Episodes Watched</h1>
          <Divider flexItem />
          <p className="profile-episodes-watched">{userWatchedEpisodesCount}</p>
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
          <h1 className="profile-single-statistic-title">Current Streak</h1>
          <Divider flexItem />
          <p className="profile-episodes-watched">-</p>
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
          <h1 className="profile-single-statistic-title">Best Streak</h1>
          <Divider flexItem />
          <p className="profile-episodes-watched">-</p>
        </div>
      </div>
    </div>
  )
}
