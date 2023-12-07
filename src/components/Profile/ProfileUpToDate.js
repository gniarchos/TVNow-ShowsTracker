import React, { useContext, useEffect, useState } from "react"
import ProfileEpisodes from "./ProfileEpisodes"
import { db } from "../../services/firebase"
import { Icon } from "@iconify/react"
import { ProfileContext } from "./Profile"
import "./ProfileSectionsStyles.css"

export default function ProfileUpToDate(props) {
  const { cancelled_shows, setCancelled_shows, setShow_modal } =
    useContext(ProfileContext)

  const [upToDateSettings, setUpToDateSettings] = useState(false)
  let countShows = 0
  const upToDateShows = props.userShowAllData
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
            setTimeout(() => {
              setShow_modal(true)
            }, 2000)

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

            setCancelled_shows(cancelled_shows.add(data.name))
          }
        })

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
              season.episodes[show.episodeNumber]?.air_date
            )
          })
      )

      const episode_name = props.seasonData
        .filter((season) => parseInt(season.show_id) === parseInt(show.show_id))
        .map((season) => {
          return (
            season.episodes !== undefined &&
            season.episodes[show.episodeNumber]?.name
          )
        })

      const show_all_seasons = props.showsData
        .filter((all_show) => parseInt(all_show.id) === parseInt(show.show_id))
        .map((show) => {
          return show.number_of_seasons
        })

      const episode_time = props.seasonData
        .filter((season) => parseInt(season.show_id) === parseInt(show.show_id))
        .map((season) => {
          return season.episodes !== undefined
            ? season.episodes[show.episodeNumber]?.runtime
            : 0
        })

      const curr_season_episodes = props.seasonData
        .filter(
          (all_show) => parseInt(all_show.show_id) === parseInt(show.show_id)
        )
        .map((season) => {
          return season.seasonTotalEpisodes
        })

      const show_status = props.showsData
        .filter((all_show) => parseInt(all_show.id) === parseInt(show.show_id))
        .map((show) => {
          return show.status
        })

      const today = new Date()
      const difference = episode_date.getTime() - today.getTime()
      const daysUntilCurrentEpisode = Math.ceil(difference / (1000 * 3600 * 24))

      const nextEpisodeDate = props.showsData
        .filter((allData) => allData.name === show.show_name)
        .map((allData) => {
          let air_date_fix = allData.next_episode_to_air?.air_date.split("-")
          let new_air_date =
            air_date_fix !== undefined &&
            `${air_date_fix[2]}/${air_date_fix[1]}/${air_date_fix[0]}`

          return new_air_date
        })

      if (daysUntilCurrentEpisode > 0 || isNaN(daysUntilCurrentEpisode)) {
        if (props.upToDateFilter === "all") {
          countShows++
          return (
            <ProfileEpisodes
              key={show.show_id}
              backdrop_path={show_banner}
              showName={show.show_name}
              episode_name={episode_name.join("")}
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
              nextEpisodeDate={nextEpisodeDate}
              isInSectionUpToDate={true}
              filter={props.upToDateFilter}
            />
          )
        } else if (
          props.upToDateFilter === "soon" &&
          parseInt(nextEpisodeDate) >= 0
        ) {
          countShows++
          return (
            <ProfileEpisodes
              key={show.show_id}
              backdrop_path={show_banner}
              showName={show.show_name}
              episode_name={episode_name.join("")}
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
              nextEpisodeDate={nextEpisodeDate}
              isInSectionUpToDate={true}
              filter={props.upToDateFilter}
            />
          )
        } else if (
          props.upToDateFilter === "returning" &&
          JSON.stringify(nextEpisodeDate) === "[false]"
        ) {
          countShows++
          return (
            <ProfileEpisodes
              key={show.show_id}
              backdrop_path={show_banner}
              showName={show.show_name}
              episode_name={episode_name.join("")}
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
              nextEpisodeDate={nextEpisodeDate}
              isInSectionUpToDate={true}
              filter={props.upToDateFilter}
            />
          )
        }
      }
    })

  function toggleUpToDateSettings() {
    setUpToDateSettings(!upToDateSettings)
  }

  useEffect(() => {
    if (countShows === 0) {
      if (props.upToDateFilter === "soon") {
        props.handleFilterUpToDate("all")
      }
    }
  }, [])

  return (
    <>
      <div className="title-button">
        <h1 className="profile-section-title upToDate-settings">
          Up to Date
          {props.upToDateSection && (
            <Icon
              className="setting-icon"
              icon="akar-icons:settings-horizontal"
              onClick={toggleUpToDateSettings}
            />
          )}
        </h1>
        <button
          id="upToDate"
          className="viewMore-button-profile"
          onClick={(e) => props.toggleSections(e)}
        >
          {props.upToDateSection ? "Hide" : "Show"}
        </button>
      </div>
      {upToDateSettings && props.upToDateSection && (
        <div className="upToDate-filters">
          <p
            className={
              props.upToDateFilter === "all"
                ? "filter-title active"
                : "filter-title"
            }
            onClick={() => props.handleFilterUpToDate("all")}
          >
            All
          </p>
          <p
            className={
              props.upToDateFilter === "soon"
                ? "filter-title active"
                : "filter-title"
            }
            onClick={() => props.handleFilterUpToDate("soon")}
          >
            Coming Soon
          </p>
          <p
            className={
              props.upToDateFilter === "returning"
                ? "filter-title active"
                : "filter-title"
            }
            onClick={() => props.handleFilterUpToDate("returning")}
          >
            Returning
          </p>
        </div>
      )}
      {upToDateShows.length > 0 && props.upToDateSection && (
        <div>
          {countShows === 0 && props.upToDateFilter === "soon" ? (
            <div>
              <p className="no-upcoming-msg withFilters">
                <Icon icon="fluent-emoji:anguished-face" width={30} />
                No Upcoming shows.
              </p>
            </div>
          ) : countShows === 0 && props.upToDateFilter === "all" ? (
            <div>
              <p className="no-upcoming-msg withFilters">
                <Icon icon="fluent-emoji:flexed-biceps" width={30} />
                All shows are up to date.
              </p>
            </div>
          ) : countShows === 0 && props.upToDateFilter === "returning" ? (
            <div>
              <p className="no-upcoming-msg withFilters">
                <Icon icon="fluent-emoji:anguished-face" width={30} />
                No Returning shows.
              </p>
            </div>
          ) : (
            <div className="details-container">{upToDateShows}</div>
          )}
          <div className="divider line glow"></div>
        </div>
      )}
    </>
  )
}
