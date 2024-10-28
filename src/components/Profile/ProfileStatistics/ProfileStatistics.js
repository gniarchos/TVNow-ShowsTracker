import React from "react"
import "./ProfileStatistics.css"
import { Divider } from "@mui/material"

export default function ProfileStatistics() {
  return (
    <div className="profile-stats-wrapper">
      <div className="profile-stats-shows-info">
        <div className="profile-stats-container">
          <span className="profile-stats-title">Total Shows</span>
          <span className="profile-stats-num">0</span>
        </div>

        <div className="profile-stats-container">
          <span className="profile-stats-title">Watching Now</span>
          <span className="profile-stats-num">0</span>
        </div>

        <div className="profile-stats-container">
          <span className="profile-stats-title">Up To Date</span>
          <span className="profile-stats-num">0</span>
        </div>

        <div className="profile-stats-container">
          <span className="profile-stats-title">Finished Shows</span>
          <span className="profile-stats-num">0</span>
        </div>

        <div className="profile-stats-container">
          <span className="profile-stats-title">Stopped Watching</span>
          <span className="profile-stats-num">0</span>
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
      </div>
    </div>
  )
}
