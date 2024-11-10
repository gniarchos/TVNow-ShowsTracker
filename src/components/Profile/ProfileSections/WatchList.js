import React, { useContext, useEffect, useState } from "react"
import ProfileEpisodes from "../ProfileEpisodes/ProfileEpisodes"
import { Button, Divider } from "@mui/material"
import apiCaller from "../../../Api/ApiCaller_NEW"
import { LayoutContext } from "../../../components/Layout/Layout"
import SectionsLoader from "./SectionsLoader"
import "./ProfileSections.css"

export default function WatchList({
  mobileLayout,
  watchListShows,
  triggerRefresh,
  setTriggerRefresh,
  loading,
  setLoading,
}) {
  const user_id = localStorage.getItem("user_id")
  const [showsInfo, setShowsInfo] = useState([])
  const [seasonInfo, setSeasonInfo] = useState([])
  const [emptySection, setEmptySection] = useState(false)

  const [watchlistSection, setWatchlistSection] = useState(
    localStorage.getItem("watchlistSection")
      ? JSON.parse(localStorage.getItem("watchlistSection"))
      : true
  )

  const { setOpenSnackbar, setSnackbarMessage, setSnackbarSeverity } =
    useContext(LayoutContext)

  function toggleSection() {
    setWatchlistSection(!watchlistSection)
    localStorage.setItem("watchlistSection", JSON.stringify(!watchlistSection))
  }

  useEffect(() => {
    setLoading(true)
    setShowsInfo([])
    setSeasonInfo([])
    watchListShows.forEach((show) => {
      Promise.all([
        apiCaller({
          url: `${process.env.REACT_APP_THEMOVIEDB_URL}/tv/${show.show_id}?api_key=${process.env.REACT_APP_THEMOVIEDB_API}&language=en-US`,
          method: "GET",
          contentType: "application/json",
          body: null,
          calledFrom: "showInfo",
          isResponseJSON: true,
          extras: null,
        }),
        apiCaller({
          url: `${process.env.REACT_APP_THEMOVIEDB_URL}/tv/${show.show_id}/season/1?api_key=${process.env.REACT_APP_THEMOVIEDB_API}&language=en-US`,
          method: "GET",
          contentType: "application/json",
          body: null,
          calledFrom: "seasonInfo",
          isResponseJSON: true,
          extras: null,
        }),
      ])
        .then((data) => {
          setLoading(false)
          setShowsInfo((prevData) => [...prevData, data[0]])
          setSeasonInfo((prevData) => [...prevData, data[1]])
        })
        .catch((error) => {
          setOpenSnackbar(true)
          setSnackbarSeverity("error")
          setSnackbarMessage(error.message)
        })
    })
  }, [watchListShows])

  function handleMarkAsWatched(showId, seasonNumber, episodeNumber, index) {
    const data_to_post = {
      episode: episodeNumber + 1,
      season: seasonNumber,
      episode_duration:
        seasonInfo[index].episodes[episodeNumber].runtime !== null
          ? seasonInfo[index].episodes[episodeNumber].runtime
          : 0,
    }

    apiCaller({
      url: `${process.env.REACT_APP_BACKEND_API_URL}/shows/mark-episode-as-watched?user_id=${user_id}&show_id=${showId}`,
      method: "POST",
      contentType: "application/json",
      body: JSON.stringify(data_to_post),
      calledFrom: "markEpisodeAsWatched",
      isResponseJSON: true,
      extras: null,
    })
      .then(() => {
        setTriggerRefresh(!triggerRefresh)
      })
      .catch((error) => {
        setOpenSnackbar(true)
        setSnackbarSeverity("error")
        setSnackbarMessage(error.message)
      })
  }

  if (loading) {
    return <SectionsLoader sectionType="Your WatchList" />
  }

  return (
    <div className="profile-sections-wrapper" id="watchlist">
      <div className="profile-section-header">
        <h1 className="profile-section-title">Your Watchlist</h1>

        <Button onClick={toggleSection} variant="contained" size="small">
          {watchlistSection ? "Hide" : "Show"}
        </Button>
      </div>

      {watchlistSection ? (
        <div className="profile-sections-container">
          <div className="profile-sections">
            {showsInfo.map((show, index) => (
              <ProfileEpisodes
                mobileLayout={mobileLayout}
                key={index}
                showInfo={show}
                seasonInfo={seasonInfo[index]}
                seasonNumber={0}
                episodeNumber={0}
                handleMarkAsWatched={handleMarkAsWatched}
                index={index}
              />
            ))}
          </div>
        </div>
      ) : (
        <Divider color="white" />
      )}

      {emptySection && (
        <div className="empty-section">No Shows In Watchlist</div>
      )}
    </div>
  )
}
