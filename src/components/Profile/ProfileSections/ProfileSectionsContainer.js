import React, { useContext, useEffect, useState } from "react"
import apiCaller from "../../../Api/ApiCaller_NEW"
import { LayoutContext } from "../../../components/Layout/Layout"
import WatchList from "./WatchList"
import WatchNext from "./WatchNext"
import "./ProfileSections.css"
import UpToDate from "./UpToDate"

export default function ProfileSectionsContainer({
  mobileLayout,
  triggerRefresh,
  setTriggerRefresh,
}) {
  const user_id = localStorage.getItem("user_id")
  const [watchNextShows, setWatchNextShows] = useState([])
  const [watchListShows, setWatchListShows] = useState([])
  const [loading, setLoading] = useState(true)

  const [watchNextShowsFetchOK, setWatchNextShowsFetchOK] = useState(false)
  const [watchListShowsFetchOK, setWatchListShowsFetchOK] = useState(false)
  const [upToDateShowsFetchOK, setUpToDateShowsFetchOK] = useState(false)

  const { setOpenSnackbar, setSnackbarMessage, setSnackbarSeverity } =
    useContext(LayoutContext)

  useEffect(() => {
    setLoading(true)

    setWatchNextShowsFetchOK(false)
    setWatchListShowsFetchOK(false)
    setUpToDateShowsFetchOK(false)

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

  useEffect(() => {
    if (watchNextShowsFetchOK && watchListShowsFetchOK && upToDateShowsFetchOK)
      setLoading(false)
  }, [watchNextShowsFetchOK, watchListShowsFetchOK, upToDateShowsFetchOK])

  return (
    <>
      <WatchNext
        mobileLayout={mobileLayout}
        watchNextShows={watchNextShows}
        triggerRefresh={triggerRefresh}
        setTriggerRefresh={setTriggerRefresh}
        loading={loading}
        setLoading={setLoading}
        setWatchNextShowsFetchOK={setWatchNextShowsFetchOK}
      />

      <UpToDate
        mobileLayout={mobileLayout}
        watchNextShows={watchNextShows}
        loading={loading}
        setLoading={setLoading}
        setUpToDateShowsFetchOK={setUpToDateShowsFetchOK}
      />

      <WatchList
        mobileLayout={mobileLayout}
        watchListShows={watchListShows}
        triggerRefresh={triggerRefresh}
        setTriggerRefresh={setTriggerRefresh}
        loading={loading}
        setLoading={setLoading}
        setWatchListShowsFetchOK={setWatchListShowsFetchOK}
      />
    </>
  )
}
