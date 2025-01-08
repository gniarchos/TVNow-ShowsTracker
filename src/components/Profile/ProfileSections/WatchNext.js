import React, { useContext, useEffect, useState } from "react"
import ProfileEpisodes from "../ProfileEpisodes/ProfileEpisodes"
import { Button, Divider } from "@mui/material"
import apiCaller from "../../../Api/ApiCaller"
import { LayoutContext } from "../../../components/Layout/Layout"
import SectionsLoader from "./SectionsLoader"
import "./ProfileSections.css"
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded"

export default function WatchNext({
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
  const [spinnerLoader, setSpinnerLoader] = useState([])
  let episodesExists = false

  const [watchNextSection, setWatchNextSection] = useState(
    localStorage.getItem("watchNextSection")
      ? JSON.parse(localStorage.getItem("watchNextSection"))
      : true
  )
  // const [seasonEpisodesRatingsIMDB, setSeasonEpisodesRatingsIMDB] = useState([])

  const { setOpenSnackbar, setSnackbarMessage, setSnackbarSeverity } =
    useContext(LayoutContext)

  function toggleSection() {
    setWatchNextSection(!watchNextSection)
    localStorage.setItem("watchNextSection", JSON.stringify(!watchNextSection))
  }

  useEffect(() => {
    const fetchData = async () => {
      setSpinnerLoader([])
      setLoading(true)
      setShowsInfo([])
      setSeasonInfo([])

      try {
        if (watchNextShows.length === 0) {
          setEmptySection(true)
          setWatchNextShowsFetchOK(true)
          episodesExists = false
        } else {
          const results = await Promise.all(
            watchNextShows
              ?.sort(
                (a, b) => new Date(b.last_updated) - new Date(a.last_updated)
              )
              .map((show) =>
                Promise.all([
                  apiCaller({
                    url: `${process.env.REACT_APP_THEMOVIEDB_URL}/tv/${show.show_id}?api_key=${process.env.REACT_APP_THEMOVIEDB_API}&language=en-US&append_to_response=external_ids`,
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
          const seasons = results.map((res) =>
            res[1] !== undefined ? res[1] : null
          )

          setSpinnerLoader((prev) => [...prev, false])
          setShowsInfo(shows)
          setSeasonInfo(seasons)
        }
      } catch (error) {
        setOpenSnackbar(true)
        setSnackbarSeverity("error")
        setSnackbarMessage(error.message)
      } finally {
        // Check if watchNextShows are empty or data was fetched correctly
        if (watchNextShows.length === 0) {
          setEmptySection(true) // Set it to true if no watchNext episodes
        } else {
          setEmptySection(false) // Set it to false if there are episodes
        }
        setWatchNextShowsFetchOK(true)
      }
    }

    fetchData()
  }, [watchNextShows])

  // useEffect(() => {
  //   if (watchNextShows.length > 0) {
  //     if (showsInfo.length > 0 && seasonInfo.length > 0) {
  //       let pendingRequests = 0 // Track pending API requests
  //       // let ratingsFetched = [...seasonEpisodesRatingsIMDB] // Clone current state
  //       let foundValidEpisode = false // Flag to track if there's a valid episode

  //       const fetchRatings = async () => {
  //         for (let index = 0; index < showsInfo.length; index++) {
  //           const show = showsInfo[index]
  //           const episode =
  //             seasonInfo[index]?.episodes[watchNextShows[index]?.episode]

  //           // Check if the episode is valid
  //           const isValidEpisode =
  //             episode &&
  //             new Date(episode.air_date) < new Date() && // Episode air date is in the past
  //             episode.air_date !== null && // Ensure air date is not null
  //             seasonInfo[index]?.season_number <= show.number_of_seasons // Season is valid

  //           if (isValidEpisode) {
  //             foundValidEpisode = true // Mark that we found a valid episode
  //             pendingRequests++

  //             try {
  //               const response = await apiCaller({
  //                 url: `${process.env.REACT_APP_BACKEND_API_URL}/proxy/omdb/ratings?imdb_id=${show.external_ids.imdb_id}&season_number=${seasonInfo[index]?.season_number}`,
  //                 method: "GET",
  //                 contentType: "application/json",
  //                 body: null,
  //                 calledFrom: "seasonRatings",
  //                 isResponseJSON: true,
  //                 extras: null,
  //               })

  //               ratingsFetched[index] = response.Episodes
  //             } catch (error) {
  //               setOpenSnackbar(true)
  //               setSnackbarSeverity("error")
  //               setSnackbarMessage(error.message)
  //             } finally {
  //               pendingRequests--
  //               if (pendingRequests === 0) {
  //                 // When all requests are resolved
  //                 setSeasonEpisodesRatingsIMDB([...ratingsFetched]) // Update state once all ratings are fetched
  //                 setWatchNextShowsFetchOK(true) // Mark fetching as complete
  //                 if (!foundValidEpisode) {
  //                   setEmptySection(true) // Set empty section if no valid episodes found
  //                 }
  //               }
  //             }
  //           }
  //         }

  //         // If no valid episodes are found, mark empty section
  //         if (!foundValidEpisode) {
  //           setEmptySection(true)
  //           setWatchNextShowsFetchOK(true) // Mark as complete even if no valid episodes
  //         }
  //       }

  //       fetchRatings()
  //     }
  //   }
  // }, [showsInfo, seasonInfo])

  function handleMarkAsWatched(
    showInfo,
    showId,
    seasonNumber,
    episodeNumber,
    index
  ) {
    setSpinnerLoader((prev) => [...prev.slice(0, index), true])
    const isSeasonLastEpisode =
      seasonInfo[index].episodes.length === episodeNumber + 1

    const data_to_post = {
      episode: episodeNumber,
      season: seasonNumber,
      episode_duration:
        seasonInfo[index].episodes[episodeNumber].runtime !== null
          ? seasonInfo[index].episodes[episodeNumber].runtime
          : 0,
    }

    let isFinishedShow = false

    if (
      seasonNumber === parseInt(showInfo.number_of_seasons) &&
      isSeasonLastEpisode
    ) {
      isFinishedShow = true
    }

    apiCaller({
      url: `${process.env.REACT_APP_BACKEND_API_URL}/shows/mark-episode-as-watched?user_id=${user_id}&show_id=${showId}&final_episode=${isFinishedShow}&is_season_last_episode=${isSeasonLastEpisode}`,
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
        <>
          <div className="profile-sections-container">
            <div className="profile-sections">
              {showsInfo.map((show, index) => {
                if (
                  new Date(
                    seasonInfo[index]?.episodes[
                      watchNextShows[index].episode
                    ]?.air_date
                  ) < new Date() &&
                  seasonInfo[index]?.episodes[watchNextShows[index].episode]
                    ?.air_date !== null &&
                  seasonInfo[index]?.season_number <= show.number_of_seasons
                ) {
                  episodesExists = true
                  return (
                    <ProfileEpisodes
                      key={index}
                      showInfo={show}
                      seasonInfo={seasonInfo[index]}
                      seasonNumber={watchNextShows[index].season}
                      episodeNumber={watchNextShows[index].episode}
                      handleMarkAsWatched={handleMarkAsWatched}
                      index={index}
                      spinnerLoader={spinnerLoader}
                      // seasonEpisodesRatingsIMDB={
                      //   seasonEpisodesRatingsIMDB[0][index]
                      // }
                      sectionType="watchNext"
                    />
                  )
                }
              })}
            </div>
          </div>

          {emptySection ||
            (!episodesExists && (
              <div className="profile-empty-section">
                <AutoAwesomeRoundedIcon /> Watch next section is empty
              </div>
            ))}
        </>
      ) : (
        <Divider color="white" />
      )}
    </div>
  )
}
