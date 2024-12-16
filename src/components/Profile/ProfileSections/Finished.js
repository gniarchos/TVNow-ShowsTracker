import { Button, Divider } from "@mui/material"
import React, { useContext, useEffect, useState } from "react"
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded"
import apiCaller from "../../../Api/ApiCaller_NEW"
import { LayoutContext } from "../../../components/Layout/Layout"
import SectionsLoader from "./SectionsLoader"
import "./ProfileSections.css"
import ProfileEpisodes from "../ProfileEpisodes/ProfileEpisodes"

export default function Finished({
  mobileLayout,
  finishedShows,
  loading,
  setLoading,
  setFinishedShowsFetchOK,
}) {
  const [finishedSection, setFinishedSection] = useState(
    localStorage.getItem("watchlistSection")
      ? JSON.parse(localStorage.getItem("finishedSection"))
      : true
  )
  const [emptySection, setEmptySection] = useState(false)
  const [showsInfo, setShowsInfo] = useState([])
  const [seasonInfo, setSeasonInfo] = useState([])

  const { setOpenSnackbar, setSnackbarMessage, setSnackbarSeverity } =
    useContext(LayoutContext)

  function toggleSection() {
    setFinishedSection(!finishedSection)
    localStorage.setItem("finishedSection", JSON.stringify(!finishedSection))
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setShowsInfo([])
      setSeasonInfo([])

      try {
        if (finishedShows.length === 0) {
          setEmptySection(true)
        } else {
          const results = await Promise.all(
            finishedShows
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
        }
      } catch (error) {
        setOpenSnackbar(true)
        setSnackbarSeverity("error")
        setSnackbarMessage(error.message)
      } finally {
        setFinishedShowsFetchOK(true)
        if (finishedShows.length === 0) {
          setEmptySection(true)
        } else {
          setEmptySection(false)
        }
      }
    }

    fetchData()
  }, [finishedShows])

  if (loading) {
    return <SectionsLoader sectionType="Finished" />
  }

  console.log(showsInfo)

  return (
    <div className="profile-sections-wrapper" id="finished">
      <div className="profile-section-header">
        <h1 className="profile-section-title">Finished</h1>

        <Button onClick={toggleSection} variant="contained" size="small">
          {finishedSection ? "Hide" : "Show"}
        </Button>
      </div>

      {finishedSection ? (
        <>
          <div className="profile-sections-container">
            <div className="profile-sections">
              {showsInfo.map((show, index) => (
                <ProfileEpisodes
                  mobileLayout={mobileLayout}
                  key={index}
                  showInfo={show}
                  seasonInfo={null}
                  seasonNumber={show.number_of_seasons}
                  episodeNumber={show.number_of_episodes}
                  handleMarkAsWatched={() => null}
                  index={index}
                  sectionType="finished"
                  spinnerLoader={[]}
                  finishedInfo={finishedShows[index]}
                />
              ))}
            </div>
          </div>

          {emptySection && (
            <div className="profile-empty-section">
              <AutoAwesomeRoundedIcon /> No finished shows yet
            </div>
          )}
        </>
      ) : (
        <Divider color="white" />
      )}
    </div>
  )
}
