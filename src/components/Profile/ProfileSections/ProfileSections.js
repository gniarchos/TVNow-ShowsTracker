import React, { useContext, useEffect, useState } from "react"
import "./ProfileSections.css"
import { Button, Divider, Skeleton, useMediaQuery } from "@mui/material"
import ProfileEpisodes from "../ProfileEpisodes/ProfileEpisodes"
import apiCaller from "../../../Api/ApiCaller_NEW"
import { LayoutContext } from "../../../components/Layout/Layout"
import { useTheme } from "@emotion/react"

export default function ProfileSections({
  sectionType,
  toggleSection,
  toggleSections,
  mobileLayout,
}) {
  const user_id = localStorage.getItem("user_id")
  const [showsWithSectionType, setShowsWithSectionType] = useState([])
  const [showsInfo, setShowsInfo] = useState([])
  const [seasonInfo, setSeasonInfo] = useState([])
  const [loading, setLoading] = useState(true)

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"))

  const { setOpenSnackbar, setSnackbarMessage, setSnackbarSeverity } =
    useContext(LayoutContext)

  useEffect(() => {
    switch (sectionType) {
      case "Watch Next":
        break
      case "Up To Date":
        break
      case "WatchList":
        watchlistSetup()
        break
      case "Finished":
        break
      case "Stopped":
        break
      case "Cancelled":
        break
      default:
        break
    }
  }, [])

  useEffect(() => {
    switch (sectionType) {
      case "Watch Next":
        break
      case "Up To Date":
        break
      case "WatchList":
        showsWithSectionType.forEach((show) => {
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

      case "Finished":
        break
      case "Stopped":
        break
      case "Cancelled":
        break
      default:
        break
    }
  }, [showsWithSectionType])

  function watchlistSetup() {
    apiCaller({
      url: `${process.env.REACT_APP_BACKEND_API_URL}/show/${user_id}/all-shows/not-started`,
      method: "GET",
      contentType: "application/json",
      body: null,
      calledFrom: "watchlistShows",
      isResponseJSON: true,
      extras: null,
    })
      .then((data) => {
        setShowsWithSectionType(data)
      })
      .catch((error) => {
        setOpenSnackbar(true)
        setSnackbarSeverity("error")
        setSnackbarMessage(error.message)
      })
  }

  if (loading) {
    return (
      <div className="profile-sections-wrapper" id="watchlist">
        <div className="profile-section-header">
          <h1 className="profile-section-title">{sectionType}</h1>

          <Button
            onClick={() => toggleSections("watchlist")}
            variant="contained"
            size="small"
          >
            {toggleSection ? "Hide" : "Show"}
          </Button>
        </div>
        <div className="profile-sections-container">
          <div className="profile-sections">
            <Skeleton
              sx={{ bgcolor: "grey.800" }}
              variant="rectangular"
              width={isMobile ? "calc(100vw - 20px)" : 500}
              height={isMobile ? 100 : 281}
            />

            <Skeleton
              sx={{ bgcolor: "grey.800" }}
              variant="rectangular"
              width={isMobile ? "calc(100vw - 20px)" : 500}
              height={isMobile ? 100 : 281}
            />

            <Skeleton
              sx={{ bgcolor: "grey.800" }}
              variant="rectangular"
              width={isMobile ? "calc(100vw - 20px)" : 500}
              height={isMobile ? 100 : 281}
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="profile-sections-wrapper" id="watchlist">
      <div className="profile-section-header">
        <h1 className="profile-section-title">{sectionType}</h1>

        <Button
          onClick={() => toggleSections("watchlist")}
          variant="contained"
          size="small"
        >
          {toggleSection ? "Hide" : "Show"}
        </Button>
      </div>

      {toggleSection ? (
        <div className="profile-sections-container">
          <div className="profile-sections">
            {showsInfo.map((show, index) => (
              <ProfileEpisodes
                sectionType={sectionType}
                mobileLayout={mobileLayout}
                key={index}
                showInfo={show}
                seasonInfo={seasonInfo[index]}
                seasonNumber={1}
                episodeNumber={1}
              />
            ))}
          </div>
        </div>
      ) : (
        <Divider color="white" />
      )}
    </div>
  )
}
