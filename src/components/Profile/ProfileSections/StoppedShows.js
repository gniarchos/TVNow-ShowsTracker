import { Button, Divider } from "@mui/material"
import React, { useContext, useEffect, useState } from "react"
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded"
import apiCaller from "../../../Api/ApiCaller_NEW"
import { LayoutContext } from "../../../components/Layout/Layout"
import SectionsLoader from "./SectionsLoader"
import "./ProfileSections.css"
import ProfileEpisodes from "../ProfileEpisodes/ProfileEpisodes"

export default function StoppedShows({
  mobileLayout,
  stoppedShows,
  loading,
  setLoading,
  setStoppedShowsFetchOK,
}) {
  const [stoppedSection, setStoppedSection] = useState(
    localStorage.getItem("watchlistSection")
      ? JSON.parse(localStorage.getItem("stoppedSection"))
      : true
  )
  const [emptySection, setEmptySection] = useState(false)
  const [showsInfo, setShowsInfo] = useState([])

  const { setOpenSnackbar, setSnackbarMessage, setSnackbarSeverity } =
    useContext(LayoutContext)

  function toggleSection() {
    setStoppedSection(!stoppedSection)
    localStorage.setItem("stoppedSection", JSON.stringify(!stoppedSection))
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setShowsInfo([])

      try {
        if (stoppedShows.length === 0) {
          setEmptySection(true)
        } else {
          const results = await Promise.all(
            stoppedShows
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
                ])
              )
          )

          const shows = results.map((res) => res[0])
          setShowsInfo(shows)
        }
      } catch (error) {
        setOpenSnackbar(true)
        setSnackbarSeverity("error")
        setSnackbarMessage(error.message)
      } finally {
        setStoppedShowsFetchOK(true)
        if (stoppedShows.length === 0) {
          setEmptySection(true)
        } else {
          setEmptySection(false)
        }
      }
    }

    fetchData()
  }, [stoppedShows])

  if (loading) {
    return <SectionsLoader sectionType="Stopped" />
  }

  return (
    <div className="profile-sections-wrapper" id="finished">
      <div className="profile-section-header">
        <h1 className="profile-section-title">Stopped</h1>

        <Button onClick={toggleSection} variant="contained" size="small">
          {stoppedSection ? "Hide" : "Show"}
        </Button>
      </div>

      {stoppedSection ? (
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
                  sectionType="stopped"
                  spinnerLoader={[]}
                  stoppedInfo={stoppedShows[index]}
                />
              ))}
            </div>
          </div>

          {emptySection && (
            <div className="profile-empty-section">
              <AutoAwesomeRoundedIcon /> You have no stopped shows
            </div>
          )}
        </>
      ) : (
        <Divider color="white" />
      )}
    </div>
  )
}
