import React, { useContext, useEffect, useState } from "react"
import ProfileEpisodes from "../ProfileEpisodes/ProfileEpisodes"
import { Button, Divider } from "@mui/material"
import apiCaller from "../../../Api/ApiCaller_NEW"
import { LayoutContext } from "../../Layout/Layout"
import SectionsLoader from "./SectionsLoader"
import "./ProfileSections.css"

export default function UpToDate({
  mobileLayout,
  watchNextShows,
  loading,
  setLoading,
  setUpToDateShowsFetchOK,
}) {
  const [showsInfo, setShowsInfo] = useState([])
  const [seasonInfo, setSeasonInfo] = useState([])
  const [emptySection, setEmptySection] = useState(false)

  const [upToDateSection, setUpToDateSection] = useState(
    localStorage.getItem("upToDateSection")
      ? JSON.parse(localStorage.getItem("upToDateSection"))
      : true
  )

  const { setOpenSnackbar, setSnackbarMessage, setSnackbarSeverity } =
    useContext(LayoutContext)

  function toggleSection() {
    setUpToDateSection(!upToDateSection)
    localStorage.setItem("upToDateSection", JSON.stringify(!upToDateSection))
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
        // const seasons = results.map((res) => res[1])
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
        setUpToDateShowsFetchOK(true)
      }
    }

    fetchData()
  }, [watchNextShows])

  if (loading) {
    return <SectionsLoader sectionType="Up To Date" />
  }

  return (
    <div className="profile-sections-wrapper" id="upToDate">
      <div className="profile-section-header">
        <h1 className="profile-section-title">Up To Date</h1>

        <Button onClick={toggleSection} variant="contained" size="small">
          {upToDateSection ? "Hide" : "Show"}
        </Button>
      </div>

      {upToDateSection ? (
        <div className="profile-sections-container">
          <div className="profile-sections">
            {showsInfo.map((show, index) => {
              // console.log(watchNextShows[index])
              if (seasonInfo[index] === null) {
                return (
                  <ProfileEpisodes
                    mobileLayout={mobileLayout}
                    key={index}
                    showInfo={show}
                    seasonInfo={seasonInfo[index]}
                    seasonNumber={watchNextShows[index].season}
                    episodeNumber={watchNextShows[index].episode}
                    handleMarkAsWatched={() => null}
                    index={index}
                    sectionType="upToDate"
                    spinnerLoader={[]}
                  />
                )
              }
              if (
                new Date(
                  seasonInfo[index]?.episodes[
                    watchNextShows[index].episode
                  ].air_date
                ) > new Date() &&
                seasonInfo[index]?.season_number === show.number_of_seasons
              ) {
                return (
                  <ProfileEpisodes
                    mobileLayout={mobileLayout}
                    key={index}
                    showInfo={show}
                    seasonInfo={seasonInfo[index]}
                    seasonNumber={watchNextShows[index].season}
                    episodeNumber={watchNextShows[index].episode}
                    handleMarkAsWatched={() => null}
                    index={index}
                    sectionType="upToDate"
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
        <div className="empty-section">No Shows In Up To Date</div>
      )}
    </div>
  )
}
