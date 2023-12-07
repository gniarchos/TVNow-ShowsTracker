import React from "react"
import ProfileEpisodes from "./ProfileEpisodes"
import "./ProfileSectionsStyles.css"
import { Icon } from "@iconify/react"

export default function ProfileWatchNext(props) {
  let countShows = 0

  const watchNextShows = props.userShowAllData
    .filter((show) => show.status === "watching")
    .map((show) => {
      const show_banner = props.showsData
        .filter((all_show) => parseInt(all_show.id) === parseInt(show.show_id))
        .map((show) => {
          return show.backdrop_path
        })

      const show_all_seasons = props.showsData
        .filter((all_show) => parseInt(all_show.id) === parseInt(show.show_id))
        .map((show) => {
          return show.number_of_seasons
        })

      const curr_season_episodes = props.seasonData
        .filter(
          (all_show) => parseInt(all_show.show_id) === parseInt(show.show_id)
        )
        .map((season) => {
          return season.seasonTotalEpisodes
        })

      const episode_name = props.seasonData
        .filter((season) => parseInt(season.show_id) === parseInt(show.show_id))
        .map((season) => {
          return (
            season.episodes !== undefined &&
            season.episodes[show.episodeNumber]?.name
          )
        })

      const episode_time = props.seasonData
        .filter((season) => parseInt(season.show_id) === parseInt(show.show_id))
        .map((season) => {
          return season.episodes !== undefined
            ? season.episodes[show.episodeNumber]?.runtime
            : 0
        })

      const show_status = props.showsData
        .filter((all_show) => parseInt(all_show.id) === parseInt(show.show_id))
        .map((show) => {
          return show.status
        })

      const episode_date = new Date(
        props.seasonData
          .filter(
            (season) => parseInt(season.show_id) === parseInt(show.show_id)
          )
          .map((season) => {
            return (
              season.episodes !== undefined &&
              season.episodes[show.episodeNumber]?.air_date
            )
          })
      )

      const today = new Date()
      const difference = episode_date.getTime() - today.getTime()
      const daysUntilCurrentEpisode = Math.ceil(difference / (1000 * 3600 * 24))

      if (daysUntilCurrentEpisode <= 0 && !isNaN(daysUntilCurrentEpisode)) {
        countShows++
        return (
          <ProfileEpisodes
            key={show.show_id}
            backdrop_path={show_banner}
            showName={show.show_name}
            episode_name={episode_name}
            currentUserID={props.currentUser}
            episode_number={show.episodeNumber}
            season_number={show.seasonNumber}
            mobileLayout={props.mobileLayout}
            daysUntilCurrentEpisode={daysUntilCurrentEpisode}
            show_all_seasons={show_all_seasons}
            curr_season_episodes={curr_season_episodes}
            show_id={show.show_id}
            episode_time={episode_time}
            show_status={show_status.join("")}
            nextEpisodeDate={[false]}
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
          className="viewMore-button-profile"
          onClick={(e) => props.toggleSections(e)}
        >
          {props.watchNextSection ? "Hide" : "Show"}
        </button>
      </div>
      {watchNextShows.length > 0 && props.watchNextSection && (
        <div>
          {countShows === 0 ? (
            <div>
              <p className="no-upcoming-msg">
                <Icon icon="fluent-emoji:party-popper" width={30} />
                No episodes to watch.
              </p>
            </div>
          ) : (
            <div className="details-container">{watchNextShows}</div>
          )}
          <div className="divider line glow"></div>
        </div>
      )}
    </>
  )
}
