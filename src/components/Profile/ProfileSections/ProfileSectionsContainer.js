import React, { useContext, useEffect, useState } from "react"
import apiCaller from "../../../Api/ApiCaller_NEW"
import { LayoutContext } from "../../../components/Layout/Layout"
import WatchList from "./WatchList"
import WatchNext from "./WatchNext"
import "./ProfileSections.css"

export default function ProfileSectionsContainer({
  mobileLayout,
  triggerRefresh,
  setTriggerRefresh,
}) {
  const user_id = localStorage.getItem("user_id")
  const [watchNextShows, setWatchNextShows] = useState([])
  const [watchListShows, setWatchListShows] = useState([])
  const [loading, setLoading] = useState(true)

  const { setOpenSnackbar, setSnackbarMessage, setSnackbarSeverity } =
    useContext(LayoutContext)

  useEffect(() => {
    setLoading(true)
    Promise.all([
      apiCaller({
        url: `${process.env.REACT_APP_BACKEND_API_URL}/shows/all-shows/watching/${user_id}`,
        method: "GET",
        contentType: "application/json",
        body: null,
        calledFrom: `watchListShows`,
        isResponseJSON: true,
        extras: null,
      }),
      apiCaller({
        url: `${process.env.REACT_APP_BACKEND_API_URL}/shows/all-shows/not-started/${user_id}`,
        method: "GET",
        contentType: "application/json",
        body: null,
        calledFrom: `watchListShows`,
        isResponseJSON: true,
        extras: null,
      }),
    ])
      .then((data) => {
        // setShowsWithSectionType(data)
        setWatchNextShows(data[0])
        localStorage.setItem("watchNextShowsCount", data[0].length)

        setWatchListShows(data[1])
        localStorage.setItem("watchListShowsCount", data[1].length)
      })
      .catch((error) => {
        setOpenSnackbar(true)
        setSnackbarSeverity("error")
        setSnackbarMessage(error.message)
      })
  }, [triggerRefresh])

  return (
    <>
      <WatchNext
        mobileLayout={mobileLayout}
        watchNextShows={watchNextShows}
        triggerRefresh={triggerRefresh}
        setTriggerRefresh={setTriggerRefresh}
        loading={loading}
        setLoading={setLoading}
      />

      <WatchList
        mobileLayout={mobileLayout}
        watchListShows={watchListShows}
        triggerRefresh={triggerRefresh}
        setTriggerRefresh={setTriggerRefresh}
        loading={loading}
        setLoading={setLoading}
      />
    </>
  )
}
