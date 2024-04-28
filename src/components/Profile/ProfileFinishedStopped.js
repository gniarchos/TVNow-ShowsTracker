import React from "react"
import ProfileEpisodes from "./ProfileEpisodes"
import "./ProfileSectionsStyles.css"
import { Icon } from "@iconify/react"

export default function ProfileFinishedStopped(props) {
  const finishedStoppedShows = props.userShowAllData
    .filter((show) => show.status === props.calledFrom)
    .map((show) => {
      const show_banner = props.showsData
        .filter((all_show) => parseInt(all_show.id) === parseInt(show.show_id))
        .map((show) => {
          return show.backdrop_path
        })

      const episode_number_finished =
        props.calledFrom === "finished"
          ? props.showsData
              .filter((allData) => allData.name === show.show_name)
              .map((allData) => {
                return allData.number_of_episodes
              })
          : show.episode_number === 0
          ? show.episode_number
          : show.episode_number - 1

      const season_number =
        props.calledFrom === "finished"
          ? props.showsData
              .filter((allData) => allData.name === show.show_name)
              .map((allData) => {
                return allData.number_of_seasons
              })
          : show.season_number

      return (
        <ProfileEpisodes
          key={show.show_id}
          mobileLayout={props.mobileLayout}
          backdrop_path={show_banner}
          showName={show.show_name}
          currentUserID={props.currentUser}
          episode_number={episode_number_finished}
          season_number={season_number}
          daysUntilCurrentEpisode={0}
          finishedShow={true}
          stoppedShows={props.calledFrom === "stopped" ? true : false}
          showID={show.show_id}
          episode_time={0}
        />
      )
    })

  return (
    <>
      <div id={props.calledFrom} className="title-button">
        <h1 className="profile-section-title">
          {props.calledFrom === "finished" ? "Finished" : "Stopped"}
        </h1>
        <button
          id={props.calledFrom === "finished" ? "finished" : "stopped"}
          className="viewMore-button-profile"
          onClick={(e) => props.toggleSections(e)}
        >
          {props.calledFrom === "finished"
            ? props.finishedSection
              ? "Hide"
              : "Show"
            : props.stoppedSection
            ? "Hide"
            : "Show"}
        </button>
      </div>
      {props.calledFrom === "finished" && props.finishedSection && (
        <div>
          {finishedStoppedShows.length === 0 &&
          props.calledFrom === "finished" ? (
            <div>
              <p className="no-upcoming-msg">
                <Icon icon="fluent-emoji:television" width={30} />
                No finished shows.
              </p>
            </div>
          ) : (
            <div className="details-container">{finishedStoppedShows}</div>
          )}
          <div className="divider line glow"></div>
        </div>
      )}

      {props.calledFrom === "stopped" && props.stoppedSection && (
        <div>
          {finishedStoppedShows.length === 0 &&
          props.calledFrom === "stopped" ? (
            <div>
              <p className="no-upcoming-msg">
                <Icon icon="fluent-emoji:television" width={30} />
                No stopped shows.
              </p>
            </div>
          ) : (
            <div className="details-container">{finishedStoppedShows}</div>
          )}
          <div className="divider line glow"></div>
        </div>
      )}
    </>
  )
}
