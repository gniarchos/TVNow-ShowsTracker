import React from "react"
import ProfileEpisodes from "./ProfileEpisodes"
import "./ProfileSectionsStyles.css"
import { Icon } from "@iconify/react"
import { Link } from "react-router-dom"

export default function ProfileWatchlist(props) {
  let countShows = 0
  const watchlistShows = props.userShowAllData
    .filter((show) => show.status === "not_started")
    .map((show) => {
      const show_banner = props.showsData
        .filter((all_show) => parseInt(all_show.id) === parseInt(show.show_id))
        .map((show) => {
          return show.backdrop_path
        })

      const episode_date = new Date(
        props.seasonData
          .filter(
            (season) => parseInt(season.show_id) === parseInt(show.show_id)
          )
          .map((season) => {
            return (
              season.episodes !== undefined &&
              season.episodes[show.episode_number]?.air_date
            )
          })
      )

      const show_all_seasons = props.showsData
        .filter((all_show) => parseInt(all_show.id) === parseInt(show.show_id))
        .map((show) => {
          return show.number_of_seasons
        })

      const episode_name = props.seasonData
        .filter((season) => parseInt(season.show_id) === parseInt(show.show_id))
        .map((season) => {
          return (
            season.episodes !== undefined &&
            season.episodes[show.episode_number]?.name
          )
        })

      const curr_season_episodes = props.seasonData
        .filter(
          (all_show) => parseInt(all_show.show_id) === parseInt(show.show_id)
        )
        .map((season) => {
          return season.seasonTotalEpisodes
        })

      const episode_time = props.seasonData
        .filter((season) => parseInt(season.show_id) === parseInt(show.show_id))
        .map((season) => {
          return season.episodes !== undefined
            ? season.episodes[show.episode_number]?.runtime
            : 0
        })

      const is_premiering = props.showsData
        .filter((allData) => allData.name === show.show_name)
        .map((allData) => {
          return allData.last_air_date === null ? true : false
        })

      const nextEpisodeDate = props.showsData
        .filter((allData) => allData.name === show.show_name)
        .map((allData) => {
          let air_date_fix = allData.next_episode_to_air?.air_date.split("-")
          let new_air_date =
            air_date_fix !== undefined &&
            `${air_date_fix[2]}/${air_date_fix[1]}/${air_date_fix[0]}`

          return new_air_date
        })

      const today = new Date()
      const difference = episode_date.getTime() - today.getTime()
      const daysUntilCurrentEpisode = Math.ceil(difference / (1000 * 3600 * 24))

      countShows++
      return (
        <ProfileEpisodes
          key={show.show_id}
          mobileLayout={props.mobileLayout}
          backdrop_path={show_banner}
          showName={show.show_name}
          episode_name={episode_name}
          currentUserID={props.currentUser}
          episode_number={show.episode_number}
          season_number={show.season_number}
          daysUntilCurrentEpisode={daysUntilCurrentEpisode}
          show_all_seasons={show_all_seasons}
          curr_season_episodes={curr_season_episodes}
          show_id={show.show_id}
          episode_time={episode_time}
          is_premiering={is_premiering.join("")}
          is_notStarted={true}
          nextEpisodeDate={nextEpisodeDate}
        />
      )
    })

  return (
    <div id="watchlist">
      <div className="title-button">
        <h1 className="profile-section-title">Your Watchlist</h1>
        <button
          id="watchlist"
          className="viewMore-button-profile"
          onClick={(e) => props.toggleSections(e)}
        >
          {props.watchlistSection ? "Hide" : "Show"}
        </button>
      </div>
      {watchlistShows.length > 0 && props.watchlistSection && (
        <div>
          {countShows === 0 ? (
            <div>
              <p className="no-upcoming-msg">
                <Icon icon="fluent-emoji:detective" width={30} />
                Start searching for shows
                <Link className="find-shows-msg" to="/">
                  HERE
                </Link>
                .
              </p>
            </div>
          ) : (
            <div className="details-container">{watchlistShows}</div>
          )}

          <div className="divider line glow"></div>
        </div>
      )}
    </div>
  )
}
