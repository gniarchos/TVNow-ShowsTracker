import React from "react"
import ProfileEpisodes from "./ProfileEpisodes"

export default function FinishedStoppedSections(props) {
  const finishedStoppedShows = props.userShowData
    .filter((show) => show.status === props.calledFrom)
    .map((show) => {
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
          currentUserID={props.currentUser}
          episode_number={
            props.calledFrom === "finished"
              ? props.showsData
                  .filter((allData) => allData.name === show.show_name)
                  .map((allData) => {
                    return allData.number_of_episodes
                  })
              : show.episodeNumber
          }
          season_number={props.showsData
            .filter((allData) => allData.name === show.show_name)
            .map((allData) => {
              return allData.number_of_seasons
            })}
          today={0}
          difference={0}
          daysUntilCurrentEpisode={0}
          finishedShow={true}
          stoppedShows={props.calledFrom === "finished" ? false : true}
          showID={show.show_id}
          triggerLoadDataLocalStorage={props.triggerLoadDataLocalStorage}
          resetSeasonData={props.resetSeasonData}
        />
      )
    })

  return (
    <>
      <div id="watching" className="title-button">
        <h1 className="profile-section-title">
          {props.calledFrom === "finished" ? "Finished" : "Stopped"}
        </h1>
        <button
          id={props.calledFrom === "finished" ? "finished" : "stopped"}
          className="viewMore-button"
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
      {finishedStoppedShows.length > 0 && props.finishedSection && (
        <div>
          <div className="details-container">{finishedStoppedShows}</div>
          <div className="divider line glow"></div>
        </div>
      )}

      {finishedStoppedShows.length > 0 && props.stoppedSection && (
        <div>
          <div className="details-container">{finishedStoppedShows}</div>
          <div className="divider line glow"></div>
        </div>
      )}
    </>
  )
}
