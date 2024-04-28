import React, { useState, useEffect, createContext } from "react"
import HistoryEpisodes from "./ProfileHistoryEpisodes"
import { db } from "../../services/firebase"
import "./ProfileSectionsStyles.css"
import SyncLoader from "react-spinners/SyncLoader"
import { databaseCaller } from "../../Api/DatabaseCaller"

export const HistoryContext = createContext()

export default function ProfileHistory(props) {
  const [historyData, setHistoryData] = useState([])
  const [currentPageHistory, setCurrentPageHistory] = useState(1)
  const [waitForDelete, setWaitForDelete] = useState(false)
  const itemsPerPage = 10

  const contextValues = {
    setWaitForDelete,
  }

  useEffect(() => {
    databaseCaller({
      collectionName: `history-${props.currentUser}`,
      calledFrom: "profileHistory",
    }).then((data) => {
      console.log(data)
      setHistoryData(data)
    })
  }, [])

  function loadMoreHistoryData() {
    setCurrentPageHistory((prevPage) => prevPage + 1)
  }

  const watchedHistory = historyData
    .slice(0, currentPageHistory * itemsPerPage)
    .map((history, index) => {
      return (
        <HistoryContext.Provider value={contextValues}>
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
        </HistoryContext.Provider>
      )
    })
  return (
    <>
      <div className="title-button">
        <h1 className="profile-section-title">Watched History</h1>
        <button
          id="history"
          className="viewMore-button-profile"
          onClick={(e) => props.toggleSections(e)}
        >
          {props.historySection ? "Hide" : "Show"}
        </button>
      </div>
      {props.historySection && watchedHistory.length > 0 && (
        <div className="details-container history-container">
          {!waitForDelete ? (
            watchedHistory
          ) : (
            <div align="center">
              <SyncLoader color={"white"} size={15} />
            </div>
          )}
          <button className="loadMoreHistory-btn" onClick={loadMoreHistoryData}>
            Load More
          </button>
        </div>
      )}
    </>
  )
}
