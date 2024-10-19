import React from "react"
import "./ShowTrackingInfo.css"
import dayjs from "dayjs"
import { Divider } from "@mui/material"

export default function ShowTrackingInfo({ showData }) {
  function showNextEpisodeDate() {
    if (showData.status === "Ended") {
      return "Ended Series"
    } else if (showData.status === "Canceled") {
      return "Canceled Series"
    } else {
      if (showData.next_episode_to_air === null) {
        return "TBA"
      } else {
        return dayjs(showData.next_episode_to_air?.air_date).format(
          "DD-MM-YYYY"
        )
      }
    }
  }

  function showDaysUntil() {
    if (
      dayjs(showData.next_episode_to_air?.air_date).format("DD-MM-YYYY") ===
      dayjs().format("DD-MM-YYYY")
    ) {
      return "TODAY"
    }

    if (
      dayjs(showData.next_episode_to_air?.air_date).diff(dayjs(), "day") === 0
    ) {
      return "1 Day"
    } else {
      if (
        dayjs(showData.next_episode_to_air?.air_date).diff(dayjs(), "day") !== 1
      ) {
        return `in ${dayjs(showData.next_episode_to_air?.air_date).diff(
          dayjs(),
          "day"
        )} Days`
      } else {
        return `in ${dayjs(showData.next_episode_to_air?.air_date).diff(
          dayjs(),
          "day"
        )} Day`
      }
    }
  }
  return (
    <div className="show-info-container">
      {showData.last_air_date !== "-" && (
        <div className="show-info-details">
          <span className="show-info-titles">Latest Episode</span>
          <span className="show-info-values">
            {dayjs(showData.last_air_date).format("DD-MM-YYYY")}
          </span>
        </div>
      )}

      <Divider color="white" orientation="vertical" flexItem />

      <div className="show-info-details">
        <span className="show-info-titles">
          {showData.last_air_date === "-" &&
          (showData.status !== "Ended" || showData.status !== "Canceled")
            ? "Premiere"
            : "Next Episode"}
        </span>
        <span className="show-info-values">{showNextEpisodeDate()}</span>
      </div>

      {showData.status !== "Ended" &&
        showData.status !== "Canceled" &&
        showData.next_episode_to_air !== null && (
          <>
            <Divider color="white" orientation="vertical" flexItem />

            <div className="show-info-details">
              <span className="show-info-titles">New Episode</span>
              <span
                className={
                  dayjs(showData.next_episode_to_air?.air_date).diff(
                    dayjs(),
                    "day"
                  ) === 0 ||
                  dayjs(showData.next_episode_to_air?.air_date).format(
                    "DD-MM-YYYY"
                  ) === dayjs().format("DD-MM-YYYY")
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
