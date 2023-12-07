import { useState } from "react"
import { Icon } from "@iconify/react"
import "./ShowTrackingInfo.css"

export default function ShowTrackingInfo(props) {
  const [showDaysUntil, setShowDaysUntil] = useState(false)

  const today = new Date()

  const [latest_year, latest_month, latest_day] =
    props.showData?.last_episode_to_air !== null &&
    props.showData?.last_episode_to_air?.air_date !== undefined
      ? props.showData?.last_episode_to_air?.air_date?.split("-")
      : ["-", "-", "-"]

  const lastEpisodeDate =
    latest_day !== "-" ? `${latest_day}-${latest_month}-${latest_year}` : "-"

  const [upcoming_year, upcoming_month, upcoming_day] =
    props.showData.next_episode_to_air !== null
      ? props.showData?.next_episode_to_air?.air_date?.split("-")
      : ["-", "-", "-"]

  const nextEpisodeDate_DateFormat =
    props.showData?.next_episode_to_air !== null
      ? new Date(props.showData?.next_episode_to_air?.air_date)
      : new Date(0)

  const nextEpisodeDate =
    upcoming_day === "-" &&
    (props.showData.status === "Canceled" || props.showData.status === "Ended")
      ? "Ended Series"
      : props.showData.next_episode_to_air === null
      ? "TBA"
      : `${upcoming_day}-${upcoming_month}-${upcoming_year}`

  const differenceOfDates =
    nextEpisodeDate_DateFormat.getTime() - today.getTime()
  const TotalDaysUntilEpisode =
    props.showData.status !== "Ended"
      ? nextEpisodeDate === "TBA"
        ? "--"
        : props.showData.status === "Canceled" ||
          props.showData.status === "Ended"
        ? "-"
        : Math.ceil(differenceOfDates / (1000 * 3600 * 24))
      : "-"

  function swapVisualDays() {
    setShowDaysUntil(!showDaysUntil)
  }

  return (
    <div className="show-info-container">
      <div className="top-info-div">
        {props.showData.homepage !== "" &&
          props.showData.homepage !== null &&
          (props.streamServicesAvailable !== undefined ||
            !props.streamServicesAvailable[0]?.link) && (
            <div className="info-div">
              <h1>Where to watch</h1>
              {props.streamServicesAvailable !== undefined &&
              props.streamServicesAvailable[0]?.link ? (
                <a
                  className="whereToWatch-link"
                  href={props.streamServicesAvailable[0]?.link}
                >
                  <Icon icon="ci:play-circle-outline" />
                  Streaming Here
                </a>
              ) : (
                props.showData.homepage !== "" &&
                props.showData.homepage !== null && (
                  <a
                    className="whereToWatch-link"
                    href={props.showData.homepage}
                  >
                    <Icon icon="ci:play-circle-outline" />
                    Official Site
                  </a>
                )
              )}
            </div>
          )}

        {lastEpisodeDate !== "-" && (
          <div className="info-div">
            <h1>Latest Episode</h1>
            <p className="episodes-dates lastDate">{lastEpisodeDate}</p>
          </div>
        )}

        <div className="info-div">
          <h1>
            {lastEpisodeDate === "-" &&
            (props.showData.status !== "Ended" ||
              props.showData.status !== "Canceled")
              ? "Premiere"
              : "Next Episode"}
          </h1>
          <p
            onClick={swapVisualDays}
            className={
              TotalDaysUntilEpisode !== "-"
                ? "episodes-dates"
                : "episodes-dates ended"
            }
          >
            {showDaysUntil
              ? TotalDaysUntilEpisode === "-"
                ? "Ended Series"
                : TotalDaysUntilEpisode !== 1
                ? `${TotalDaysUntilEpisode} Days`
                : `${TotalDaysUntilEpisode} Day`
              : nextEpisodeDate}
          </p>
        </div>
      </div>
    </div>
  )
}
