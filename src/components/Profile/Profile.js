import React, { useContext, useEffect, useState } from "react"
import ProfileBanner from "./ProfileBanner/ProfileBanner"
import { LayoutContext } from "../Layout/Layout"
import { Navigate } from "react-router-dom"
import ProfileStatistics from "./ProfileStatistics/ProfileStatistics"
import apiCaller from "../../Api/ApiCaller_NEW"
import Loader from "../Other/Loader/Loader"
import ProfileEpisodes from "./ProfileEpisodes/ProfileEpisodes"
import ProfileSections from "./ProfileSections/ProfileSections"

export default function Profile() {
  const { isUserLoggedIn } = useContext(LayoutContext)
  const user_id = localStorage.getItem("user_id")
  const [allUserShows, setAllUserShows] = useState([])
  const [loading, setLoading] = useState(true)

  const [watchNextSection, setWatchNextSection] = useState(
    localStorage.getItem("watchNextSection")
      ? JSON.parse(localStorage.getItem("watchNextSection"))
      : true
  )
  const [upToDateSection, setUpToDateSection] = useState(
    localStorage.getItem("upToDateSection")
      ? JSON.parse(localStorage.getItem("upToDateSection"))
      : true
  )
  const [watchlistSection, setWatchlistSection] = useState(
    localStorage.getItem("watchlistSection")
      ? JSON.parse(localStorage.getItem("watchlistSection"))
      : true
  )
  const [finishedSection, setFinishedSection] = useState(
    localStorage.getItem("finishedSection")
      ? JSON.parse(localStorage.getItem("finishedSection"))
      : true
  )
  const [stoppedSection, setStoppedSection] = useState(
    localStorage.getItem("stoppedSection")
      ? JSON.parse(localStorage.getItem("stoppedSection"))
      : true
  )
  const [historySection, setHistorySection] = useState(
    localStorage.getItem("historySection")
      ? JSON.parse(localStorage.getItem("historySection"))
      : true
  )

  const [mobileLayout, setMobileLayout] = useState(
    localStorage.getItem("mobileLayoutSelection")
      ? localStorage.getItem("mobileLayoutSelection")
      : "cards"
  )

  const { setOpenSnackbar, setSnackbarMessage, setSnackbarSeverity } =
    useContext(LayoutContext)

  useEffect(() => {
    setLoading(true)
    apiCaller({
      url: `${process.env.REACT_APP_BACKEND_API_URL}/user/${user_id}/all-shows`,
      method: "GET",
      contentType: "application/json",
      body: null,
      calledFrom: "allUserShows",
      isResponseJSON: true,
      extras: null,
    })
      .then((data) => {
        setAllUserShows(data)
        setLoading(false)
      })
      .catch((error) => {
        setSnackbarSeverity("error")
        setSnackbarMessage(error.message)
        setOpenSnackbar(true)
      })
  }, [])

  function toggleSections(calledFrom) {
    switch (calledFrom) {
      case "watchNext":
        setWatchNextSection((prev) => !prev)
        localStorage.setItem("watchNextSection", !watchNextSection)
        break
      case "upToDate":
        setUpToDateSection((prev) => !prev)
        localStorage.setItem("upToDateSection", !upToDateSection)
        break
      case "watchlist":
        setWatchlistSection(!watchlistSection)
        localStorage.setItem("watchlistSection", !watchlistSection)
        break
      case "finished":
        setFinishedSection((prev) => !prev)
        localStorage.setItem("finishedSection", !finishedSection)
        break
      case "stopped":
        setStoppedSection((prev) => !prev)
        localStorage.setItem("stoppedSection", !stoppedSection)
        break
      case "history":
        setHistorySection((prev) => !prev)
        localStorage.setItem("historySection", !historySection)
        break
      default:
        break
    }
  }

  if (!isUserLoggedIn) {
    return <Navigate to="/" replace />
  }

  if (loading) {
    return <Loader />
  }

  return (
    <div>
      <ProfileBanner />

      <ProfileStatistics allUserShows={allUserShows} />

      <ProfileSections
        sectionType={"WatchList"}
        toggleSection={watchlistSection}
        toggleSections={toggleSections}
        mobileLayout={mobileLayout}
      />
    </div>
  )
}
