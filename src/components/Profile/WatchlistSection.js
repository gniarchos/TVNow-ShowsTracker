import React from "react"
import ProfileEpisodes from "./ProfileEpisodes"

export default function WatchlistSection(props) {
  const watchlistShows = props.userShowData
    .filter((show) => show.status === "not_started")
    .map((show) => {
      const show_date = new Date(
        props.seasonData
          .filter((season) => season.show_id === show.show_id)
          .map((episodes) => {
            return (
              episodes !== undefined && episodes[show?.episodeNumber]?.air_date
            )
          })
      )

      const today = new Date()
      const difference = show_date.getTime() - today.getTime()
      const daysUntilCurrentEpisode = Math.ceil(difference / (1000 * 3600 * 24))

      return (
        <ProfileEpisodes
          key={show.show_id}
          mobileLayout={props.mobileLayout}
          backdrop_path={props.showsData
            .filter((allData) => allData.name === show.show_name)
            .map((allData) => {
              return allData.backdrop_path
            })}
          showName={show.show_name}
          episode_name={props.seasonData
            .filter((season) => season.show_id === show.show_id)
            .map((episodes) => {
              return episodes !== undefined && episodes[show.episodeNumber].name
            })}
          currentUserID={props.currentUser}
          episode_number={show.episodeNumber}
          season_number={show.seasonNumber}
          today={today}
          difference={difference}
          daysUntilCurrentEpisode={daysUntilCurrentEpisode}
          show_all_seasons={props.showsData
            .filter((allData) => allData.name === show.show_name)
            .map((allData) => {
              return allData.number_of_seasons
            })}
          curr_season_episodes={props.seasonData
            .filter((season) => season.show_id === show.show_id)
            .map((episodes) => {
              return episodes !== undefined && episodes.length
            })}
          showID={show.show_id}
          episode_time={props.seasonData
            .filter((season) => season.show_id === show.show_id)
            ?.map((episodes) => {
              if (episodes !== undefined) {
                return episodes[show.episodeNumber].runtime !== null
                  ? episodes[show.episodeNumber].runtime
                  : 0
              }
            })}
          triggerLoadDataLocalStorage={props.triggerLoadDataLocalStorage}
          resetSeasonData={props.resetSeasonData}
          is_premiering={props.showsData
            .filter((allData) => allData.name === show.show_name)
            .map((allData) => {
              return allData.last_air_date === null ? true : false
            })
            .join("")}
          is_notStarted={true}
          nextEpisodeDate={props.showsData
            .filter((allData) => allData.name === show.show_name)
            .map((allData) => {
              let air_date_fix =
                allData.next_episode_to_air?.air_date.split("-")
              let new_air_date =
                air_date_fix !== undefined &&
                `${air_date_fix[2]}/${air_date_fix[1]}/${air_date_fix[0]}`

              return new_air_date
            })}
        />
      )
    })

  return (
    <>
      <div id="watching" className="title-button">
        <h1 className="profile-section-title">Your Watchlist</h1>
        <button
          id="watchlist"
          className="viewMore-button"
          onClick={(e) => props.toggleSections(e)}
        >
          {props.watchlistSection ? "Hide" : "Show"}
        </button>
      </div>
      {watchlistShows.length > 0 && props.watchlistSection && (
        <div>
          <div className="details-container">{watchlistShows}</div>
          <div className="divider line glow"></div>
        </div>
      )}
    </>
  )
}
