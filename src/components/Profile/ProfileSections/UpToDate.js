import React, { useContext, useEffect, useState } from "react"
import ProfileEpisodes from "../ProfileEpisodes/ProfileEpisodes"
import { Button, Divider, useMediaQuery } from "@mui/material"
import apiCaller from "../../../Api/ApiCaller_NEW"
import { LayoutContext } from "../../Layout/Layout"
import SectionsLoader from "./SectionsLoader"
import "./ProfileSections.css"
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded"
import TuneRoundedIcon from "@mui/icons-material/TuneRounded"
import { useTheme } from "@emotion/react"

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
  let episodesExists = false
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const [activeTab, setActiveTab] = useState(
    parseInt(localStorage.getItem("upToDateFilter")) || 0
  )
  const [showFilters, setShowFilters] = useState(false)

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
        if (watchNextShows.length === 0) {
          setEmptySection(true)
        } else {
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
        }
      } catch (error) {
        setOpenSnackbar(true)
        setSnackbarSeverity("error")
        setSnackbarMessage(error.message)
      } finally {
        setUpToDateShowsFetchOK(true)
        if (watchNextShows.length === 0) {
          setEmptySection(true)
        } else {
          setEmptySection(false)
        }
      }
    }

    fetchData()
  }, [watchNextShows])

  const filteredShowsAndSeasons = showsInfo
    .map((show, index) => ({
      show,
      season: seasonInfo[index],
      watchNext: watchNextShows[index],
    })) // Combine showsInfo and seasonInfo
    .filter(({ show, season }) => {
      return show
    }) // Filter based on the `show` property

  const filteredShowsInfo = filteredShowsAndSeasons.map(({ show }) => show)
  const filteredSeasonInfo = filteredShowsAndSeasons.map(({ season }) => season)
  const filteredWatchNextShows = filteredShowsAndSeasons.map(
    ({ watchNext }) => watchNext
  )

  if (loading) {
    return <SectionsLoader sectionType="Up To Date" />
  }

  return (
    <div className="profile-sections-wrapper" id="upToDate">
      <div className="profile-section-header">
        <h1 className="profile-section-title upToDate">
          Up To Date{" "}
          <TuneRoundedIcon
            onClick={() => setShowFilters(!showFilters)}
            sx={{ fontSize: isMobile ? "1.5rem" : "2rem", cursor: "pointer" }}
          />
        </h1>

        <Button onClick={toggleSection} variant="contained" size="small">
          {upToDateSection ? "Hide" : "Show"}
        </Button>
      </div>

      {showFilters && (
        <div className="profile-upToDate-filters-buttons">
          <Button
            variant="contained"
            onClick={() => {
              localStorage.setItem("upToDateFilter", 0)
              setActiveTab(0)
            }}
            color={activeTab === 0 ? "primary" : "primaryFaded"}
            sx={{ fontSize: isMobile ? "0.8rem" : "0.9rem" }}
            size={isMobile ? "small" : "medium"}
          >
            Show All
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              localStorage.setItem("upToDateFilter", 1)
              setActiveTab(1)
            }}
            color={activeTab === 1 ? "primary" : "primaryFaded"}
            sx={{ fontSize: isMobile ? "0.8rem" : "0.9rem" }}
            size={isMobile ? "small" : "medium"}
          >
            Coming Soon
          </Button>
        </div>
      )}

      {upToDateSection ? (
        <div className="profile-sections-container">
          <div className="profile-sections">
            {filteredShowsInfo.map((show, index) => {
              if (
                filteredSeasonInfo[index] === null ||
                seasonInfo[index].episodes.length === 0
              ) {
                episodesExists = true
                return (
                  <ProfileEpisodes
                    mobileLayout={mobileLayout}
                    key={index}
                    showInfo={show}
                    seasonInfo={null}
                    seasonNumber={filteredWatchNextShows[index].season}
                    episodeNumber={filteredWatchNextShows[index].episode}
                    handleMarkAsWatched={() => null}
                    index={index}
                    sectionType="upToDate"
                    spinnerLoader={[]}
                  />
                )
              }

              if (
                new Date(
                  filteredSeasonInfo[index]?.episodes[
                    filteredWatchNextShows[index].episode
                  ]?.air_date
                ) > new Date() ||
                (seasonInfo[index]?.episodes[watchNextShows[index].episode]
                  ?.air_date === null &&
                  filteredSeasonInfo[index]?.season_number ===
                    show.number_of_seasons)
              ) {
                episodesExists = true
                return (
                  <ProfileEpisodes
                    mobileLayout={mobileLayout}
                    key={index}
                    showInfo={show}
                    seasonInfo={
                      filteredSeasonInfo[index].episodes.length === 0
                        ? null
                        : filteredSeasonInfo[index]
                    }
                    seasonNumber={filteredWatchNextShows[index].season}
                    episodeNumber={filteredWatchNextShows[index].episode}
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

      {emptySection ||
        (!episodesExists && (
          <div className="profile-empty-section">
            <AutoAwesomeRoundedIcon />
            Up To Date section is empty
          </div>
        ))}
    </div>
  )
}
