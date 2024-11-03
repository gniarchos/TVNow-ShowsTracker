import React from "react"
import "./ProfileStatistics.css"
import { Chip, Divider } from "@mui/material"

export default function ProfileStatistics({ allUserShows }) {
  return (
    <div className="profile-stats-wrapper">
      <div className="profile-stats-shows-info">
        <div className="profile-stats-container">
          <span className="profile-stats-num">{allUserShows.length}</span>
          <span>|</span>
          <span className="profile-stats-title">Shows Added</span>
        </div>

        <div className="profile-stats-container">
          <span className="profile-stats-num">0</span>
          <span>|</span>
          <span className="profile-stats-title">Watching Now</span>
        </div>

        <div className="profile-stats-container">
          <span className="profile-stats-num">0</span>
          <span>|</span>
          <span className="profile-stats-title">Up To Date</span>
        </div>

        <div className="profile-stats-container">
          <span className="profile-stats-num">0</span>
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
          <Divider fullWidth flexItem />
          <div className="profile-single-statistic-content">
            <div>
              <p className="profile-single-statistic-number">0</p>
              <p className="profile-single-statistic-subtitle">
                {/* {watchingStatistic[0] === 1 ? "MONTH" : "MONTHS"} */}
                MONTHS
              </p>
            </div>
            <div>
              <p className="profile-single-statistic-number">0</p>
              <p className="profile-single-statistic-subtitle">
                {/* {watchingStatistic[1] === 1 ? "DAY" : "DAYS"} */}
                DAYS
              </p>
            </div>
            <div>
              <p className="profile-single-statistic-number">0</p>
              <p className="profile-single-statistic-subtitle">
                {/* {watchingStatistic[2] === 1 ? "HOUR" : "HOURS"} */}
                HOURS
              </p>
            </div>
          </div>
        </div>

        <div className="profile-single-statistic-container">
          <h1 className="profile-single-statistic-title">Episodes Watched</h1>
          <Divider fullWidth flexItem />
          <p className="profile-episodes-watched">0</p>
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
          <Divider fullWidth flexItem />
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
          <h1 className="profile-single-statistic-title">Favorite Genre</h1>
          <Divider fullWidth flexItem />
          <p className="profile-episodes-watched">-</p>
        </div>
      </div>
    </div>
  )
}
