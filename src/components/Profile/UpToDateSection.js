import React, { useContext } from "react"
import ProfileEpisodes from "./ProfileEpisodes"
import { db } from "../../services/firebase"
import { Icon } from "@iconify/react"
import { ProfileContext } from "./Profile"

export default function UpToDateSection(props) {
  const context = useContext(ProfileContext)

  const upToDateShows = props.userShowData
    .filter((show) => show.status === "watching")
    .map((show) => {
      fetch(
        `https://api.themoviedb.org/3/tv/${show.show_id}?api_key=${process.env.REACT_APP_THEMOVIEDB_API}&language=en-US`
      )
        .then((res) => res.json())
        .then((data) => {
          if (
            (data.status === "Canceled" || data.status === "Ended") &&
            data.number_of_seasons < show.seasonNumber
          ) {
            context.setShow_modal(true)

            db.collection(`watchlist-${props.currentUser}`)
              .where("show_name", "==", data.name)
              .get()
              .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                  doc.ref.update({
                    status: "finished",
                  })
                })
              })

            context.setCancelled_shows(context.cancelled_shows.add(data.name))
          }
        })

      // TODO: CHECH IF I NEED MAP OR FOREACH
      let show_date = new Date(
        props.seasonData
          .filter((season) => season.show_id === show.show_id)
          .map((episodes) => {
            return (
              (episodes !== undefined || episodes?.length > 0) &&
              episodes[show.episodeNumber]?.air_date
            )
          })
      )

      let today = new Date()
      let difference = show_date.getTime() - today.getTime()
      let daysUntilCurrentEpisode = Math.ceil(difference / (1000 * 3600 * 24))

      const nextEpisodeDate_data = props.showsData
        .filter((allData) => allData.name === show.show_name)
        .map((allData) => {
          let air_date_fix = allData.next_episode_to_air?.air_date.split("-")
          let new_air_date =
            air_date_fix !== undefined &&
            `${air_date_fix[2]}/${air_date_fix[1]}/${air_date_fix[0]}`

          return new_air_date
        })

      if (
        daysUntilCurrentEpisode > 0 ||
        isNaN(daysUntilCurrentEpisode) === true
      ) {
        if (props.upToDateFilter === "all") {
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
                  return (
                    (episodes !== undefined || episodes?.length > 0) &&
                    episodes[show.episodeNumber]?.name
                  )
                })
                .join("")}
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
              nextEpisodeDate={nextEpisodeDate_data}
              triggerLoadDataLocalStorage={props.triggerLoadDataLocalStorage}
              resetSeasonData={props.resetSeasonData}
              upToDate={true}
              show_status={props.showsData
                .filter((allData) => allData.name === show.show_name)
                .map((allData) => {
                  return allData.status
                })
                .join("")}
              filter={props.upToDateFilter}
            />
          )
        } else if (
          props.upToDateFilter === "soon" &&
          parseInt(nextEpisodeDate_data) >= 0
        ) {
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
                  return (
                    (episodes !== undefined || episodes?.length > 0) &&
                    episodes[show.episodeNumber]?.name
                  )
                })
                .join("")}
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
              nextEpisodeDate={nextEpisodeDate_data}
              triggerLoadDataLocalStorage={props.triggerLoadDataLocalStorage}
              resetSeasonData={props.resetSeasonData}
              upToDate={true}
              show_status={props.showsData
                .filter((allData) => allData.name === show.show_name)
                .map((allData) => {
                  return allData.status
                })
                .join("")}
              filter={props.upToDateFilter}
            />
          )
        } else if (
          props.upToDateFilter === "returning" &&
          JSON.stringify(nextEpisodeDate_data) === "[false]"
        ) {
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
                  return (
                    (episodes !== undefined || episodes?.length > 0) &&
                    episodes[show.episodeNumber]?.name
                  )
                })
                .join("")}
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
              nextEpisodeDate={nextEpisodeDate_data}
              triggerLoadDataLocalStorage={props.triggerLoadDataLocalStorage}
              resetSeasonData={props.resetSeasonData}
              upToDate={true}
              show_status={props.showsData
                .filter((allData) => allData.name === show.show_name)
                .map((allData) => {
                  return allData.status
                })
                .join("")}
              filter={props.upToDateFilter}
            />
          )
        }
      }
    })

  return (
    <>
      <div className="title-button">
        <h1 className="profile-section-title uptodate-settings">
          Up to Date
          {props.upToDateSection && (
            <Icon
              className="setting-icon"
              icon="akar-icons:settings-horizontal"
              onClick={() => props.toggleUpToDateSettings()}
            />
          )}
        </h1>
        <button
          id="upToDate"
          className="viewMore-button"
          onClick={(e) => props.toggleSections(e)}
        >
          {props.upToDateSection ? "Hide" : "Show"}
        </button>
      </div>
      {props.upToDateSettings && props.upToDateSection && (
        <div className="upToDate-filters">
          <p
            className={
              props.upToDateFilter === "all"
                ? "filter-title active"
                : "filter-title"
            }
            id="all"
            onClick={(e) => props.handleFilterUpToDate(e)}
          >
            All
          </p>
          <p
            className={
              props.upToDateFilter === "soon"
                ? "filter-title active"
                : "filter-title"
            }
            id="soon"
            onClick={(e) => props.handleFilterUpToDate(e)}
          >
            Coming Soon
          </p>
          <p
            className={
              props.upToDateFilter === "returning"
                ? "filter-title active"
                : "filter-title"
            }
            id="returning"
            onClick={(e) => props.handleFilterUpToDate(e)}
          >
            Returning
          </p>
        </div>
      )}
      {upToDateShows.length > 0 && props.upToDateSection && (
        <div>
          <div className="details-container">{upToDateShows}</div>
          <div className="divider line glow"></div>
        </div>
      )}
    </>
  )
}
