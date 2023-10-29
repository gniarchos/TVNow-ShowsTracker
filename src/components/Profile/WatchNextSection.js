import React from "react"
import ProfileEpisodes from "./ProfileEpisodes"

export default function WatchNextSection(props) {
  //   console.log(props.userShowData)

  const watchNextShows = props.userShowData
    .filter((show) => show.status === "watching")
    .map((show) => {
      const relevantSeasonData = props.seasonData.filter(
        (season) => season.show_id === show.show_id
      )

      const relevantShowData = props.showsData.filter(
        (allData) => allData.name === show.show_name
      )

      if (relevantSeasonData.length === 0 || relevantShowData.length === 0) {
        return null // Skip rendering if relevant data is missing
      }

      const show_date = new Date(
        relevantSeasonData.map(
          (episodes) =>
            (episodes !== undefined || episodes?.length > 0) &&
            episodes[show.episodeNumber]?.air_date
        )
      )

      const today = new Date()
      const difference = show_date.getTime() - today.getTime()
      const daysUntilCurrentEpisode = Math.ceil(difference / (1000 * 3600 * 24))

      if (daysUntilCurrentEpisode <= 0 && !isNaN(daysUntilCurrentEpisode)) {
        var counter = counter++
        return (
          <ProfileEpisodes
            key={show.show_id}
            mobileLayout={props.mobileLayout}
            backdrop_path={relevantShowData.map(
              (allData) => allData.backdrop_path
            )}
            showName={show.show_name}
            episode_name={relevantSeasonData.map((episodes) =>
              episodes[show.episodeNumber]?.name !== undefined
                ? episodes[show.episodeNumber]?.name
                : "TBA"
            )}
            currentUserID={props.currentUser}
            episode_number={show.episodeNumber}
            season_number={show.seasonNumber}
            today={today}
            difference={difference}
            daysUntilCurrentEpisode={daysUntilCurrentEpisode}
            show_all_seasons={relevantShowData.map(
              (allData) => allData.number_of_seasons
            )}
            curr_season_episodes={relevantSeasonData[0].seasonTotalEpisodes}
            showID={show.show_id}
            episode_time={relevantSeasonData.map(
              (episodes) => episodes[show.episodeNumber]?.runtime || 0
            )}
            triggerLoadDataLocalStorage={props.triggerLoadDataLocalStorage}
            resetSeasonData={props.resetSeasonData}
            show_status={relevantShowData
              .map((allData) => allData.status)
              .join("")}
            temp_total_episodes={localStorage.getItem("total_episodes")}
            temp_watching_time={localStorage.getItem("watching_time")}
          />
        )
      }

      return null
    })

  return (
    <>
      <div id="watching" className="title-button">
        <h1 className="profile-section-title">Watch Next</h1>
        <button
          id="watchNext"
          className="viewMore-button"
          onClick={(e) => props.toggleSections(e)}
        >
          {props.watchNextSection ? "Hide" : "Show"}
        </button>
      </div>
      {watchNextShows.length > 0 && props.watchNextSection && (
        <div>
          <div className="details-container">{watchNextShows}</div>
          <div className="divider line glow"></div>
        </div>
      )}
    </>
  )
}
