import React, { useContext, useEffect, useState } from "react"
import ProfileEpisodes from "../ProfileEpisodes/ProfileEpisodes"
import { Button, Divider } from "@mui/material"
import apiCaller from "../../../Api/ApiCaller_NEW"
import { LayoutContext } from "../../../components/Layout/Layout"
import SectionsLoader from "./SectionsLoader"

export default function WatchNext({
  mobileLayout,
  watchNextShows,
  triggerRefresh,
  setTriggerRefresh,
  loading,
  setLoading,
  setWatchNextShowsFetchOK,
}) {
  const user_id = localStorage.getItem("user_id")
  const [showsInfo, setShowsInfo] = useState([])
  const [seasonInfo, setSeasonInfo] = useState([])
  const [emptySection, setEmptySection] = useState(false)

  const [watchNextSection, setWatchNextSection] = useState(
    localStorage.getItem("watchNextSection")
      ? JSON.parse(localStorage.getItem("watchNextSection"))
      : true
  )

  const { setOpenSnackbar, setSnackbarMessage, setSnackbarSeverity } =
    useContext(LayoutContext)

  function toggleSection() {
    setWatchNextSection(!watchNextSection)
    localStorage.setItem("watchNextSection", JSON.stringify(!watchNextSection))
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setShowsInfo([])
      setSeasonInfo([])

      try {
        const results = await Promise.all(
          watchNextShows
            ?.sort(
              (a, b) => new Date(b.last_updated) - new Date(a.last_updated)
            )
            .map((show) =>
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
                  url: `${process.env.REACT_APP_THEMOVIEDB_URL}/tv/${
                    show.show_id
                  }/season/${show.season + 1}?api_key=${
                    process.env.REACT_APP_THEMOVIEDB_API
                  }&language=en-US`,
                  method: "GET",
                  contentType: "application/json",
                  body: null,
                  calledFrom: "seasonInfo",
                  isResponseJSON: true,
                  extras: null,
                }),
              ])
            )
        )

        const shows = results.map((res) => res[0])

        const seasons = results.map((res) => {
          if (res[1] !== undefined) {
            return res[1]
          } else {
            return null
          }
        })

        setShowsInfo(shows)
        setSeasonInfo(seasons)
      } catch (error) {
        setOpenSnackbar(true)
        setSnackbarSeverity("error")
        setSnackbarMessage(error.message)
      } finally {
        setWatchNextShowsFetchOK(true)
      }
    }

    fetchData()
  }, [watchNextShows])

  console.log(seasonInfo)

  function handleMarkAsWatched(showId, seasonNumber, episodeNumber, index) {
    const isSeasonLastEpisode =
      seasonInfo[index].episodes.length === episodeNumber + 1

    const data_to_post = {
      episode: isSeasonLastEpisode ? 0 : episodeNumber + 1,
      season: isSeasonLastEpisode ? seasonNumber + 1 : seasonNumber,
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
    return <SectionsLoader sectionType="Watch Next" />
  }

  return (
    <div className="profile-sections-wrapper" id="watchNext">
      <div className="profile-section-header">
        <h1 className="profile-section-title">Watch Next</h1>

        <Button onClick={toggleSection} variant="contained" size="small">
          {watchNextSection ? "Hide" : "Show"}
        </Button>
      </div>

      {watchNextSection ? (
        <div className="profile-sections-container">
          <div className="profile-sections">
            {showsInfo.map((show, index) => {
              if (
                new Date(
                  seasonInfo[index]?.episodes[
                    watchNextShows[index].episode
                  ].air_date
                ) < new Date() &&
                seasonInfo[index]?.season_number <= show.number_of_seasons
              ) {
                return (
                  <ProfileEpisodes
                    mobileLayout={mobileLayout}
                    key={index}
                    showInfo={show}
                    seasonInfo={seasonInfo[index]}
                    seasonNumber={watchNextShows[index].season}
                    episodeNumber={watchNextShows[index].episode}
                    handleMarkAsWatched={handleMarkAsWatched}
                    index={index}
                  />
                )
              }
            })}
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
