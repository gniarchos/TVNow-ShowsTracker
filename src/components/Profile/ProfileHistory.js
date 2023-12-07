import React, { useState, useEffect, createContext } from "react"
import HistoryEpisodes from "./ProfileHistoryEpisodes"
import { db } from "../../services/firebase"
import "./ProfileSectionsStyles.css"
import SyncLoader from "react-spinners/SyncLoader"

export const HistoryContext = createContext()

export default function ProfileHistory(props) {
  const [historyData, setHistoryData] = useState([])
  const [loadMoreData, setLoadMoreData] = useState(true)
  const [currentPageHistory, setCurrentPageHistory] = useState(1)
  const [waitForDelete, setWaitForDelete] = useState(false)
  const itemsPerPage = 10

  const contextValues = {
    setWaitForDelete,
  }

  useEffect(() => {
    db.collection(`history-${props.currentUser}`)
      .orderBy("date_watched", "desc")
      .limit(currentPageHistory * itemsPerPage)
      .onSnapshot((snapshot) => {
        setHistoryData(
          snapshot.docs.map((doc) => ({
            show_name: doc.data().show_name,
            show_id: doc.data().show_id,
            season_number: doc.data().season_number,
            episode_number: doc.data().episode_number,
            date_watched: doc.data().date_watched,
            episode_name: doc.data().episode_name,
            show_cover: doc.data().show_cover,
            history_episode_time: doc.data().episode_time,
          }))
        )
      })
  }, [loadMoreData])

  function loadMoreHistoryData() {
    setCurrentPageHistory((prevPage) => prevPage + 1)
    setLoadMoreData(!loadMoreData)
  }

  const watchedHistory = historyData.map((history, index) => {
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
