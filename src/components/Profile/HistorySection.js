import React from "react"
import HistoryEpisodes from "./HistoryEpisodes"

export default function HistorySection(props) {
  const watchedHistory = props.historyData.map((history, index) => {
    return (
      <HistoryEpisodes
        key={index}
        history_show_name={history.show_name}
        history_show_id={history.show_id}
        history_season_number={history.season_number}
        history_episode_number={history.episode_number}
        history_date_watched={history.episode_number}
        history_episode_name={history.episode_name}
        history_cover={history.show_cover}
        history_episode_time={history.history_episode_time}
        currentUserID={props.currentUser}
        resetSeasonData={props.resetSeasonData}
      />
    )
  })
  return (
    <>
      <div className="title-button">
        <h1 className="profile-section-title">Watched History</h1>
        <button
          id="history"
          className="viewMore-button"
          onClick={(e) => props.toggleSections(e)}
        >
          {props.historySection ? "Hide" : "Show"}
        </button>
      </div>
      {props.historySection && watchedHistory.length > 0 && (
        <div className="details-container history-container">
          {watchedHistory}
          <button className="loadMoreHistory-btn" onClick={props.loadMore}>
            Load More
          </button>
        </div>
      )}
    </>
  )
}
