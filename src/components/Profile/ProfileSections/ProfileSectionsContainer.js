import React, { useContext, useEffect, useState } from "react"
import apiCaller from "../../../Api/ApiCaller"
import { LayoutContext } from "../../../components/Layout/Layout"
import WatchList from "./WatchList"
import WatchNext from "./WatchNext"
import "./ProfileSections.css"
import UpToDate from "./UpToDate"
import Finished from "./Finished"
import StoppedShows from "./StoppedShows"

export default function ProfileSectionsContainer({
  triggerRefresh,
  setTriggerRefresh,
  setDisableBannerActions,
}) {
  const user_id = localStorage.getItem("user_id")
  const [watchNextShows, setWatchNextShows] = useState([])
  const [watchListShows, setWatchListShows] = useState([])
  const [finishedShows, setFinishedShows] = useState([])
  const [stoppedShows, setStoppedShows] = useState([])
  const [loading, setLoading] = useState(true)

  const [watchNextShowsFetchOK, setWatchNextShowsFetchOK] = useState(false)
  const [watchListShowsFetchOK, setWatchListShowsFetchOK] = useState(false)
  const [upToDateShowsFetchOK, setUpToDateShowsFetchOK] = useState(false)
  const [finishedShowsFetchOK, setFinishedShowsFetchOK] = useState(false)
  const [stoppedShowsFetchOK, setStoppedShowsFetchOK] = useState(false)

  const { setOpenSnackbar, setSnackbarMessage, setSnackbarSeverity } =
    useContext(LayoutContext)

  useEffect(() => {
    setLoading(true)

    setWatchNextShowsFetchOK(false)
    setWatchListShowsFetchOK(false)
    setUpToDateShowsFetchOK(false)
    setFinishedShowsFetchOK(false)
    setStoppedShowsFetchOK(false)

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
      apiCaller({
        url: `${process.env.REACT_APP_BACKEND_API_URL}/shows/all-shows/finished/${user_id}`,
        method: "GET",
        contentType: "application/json",
        body: null,
        calledFrom: `finishedShows`,
        isResponseJSON: true,
        extras: null,
      }),
      apiCaller({
        url: `${process.env.REACT_APP_BACKEND_API_URL}/shows/all-shows/stopped/${user_id}`,
        method: "GET",
        contentType: "application/json",
        body: null,
        calledFrom: `stoppedShows`,
        isResponseJSON: true,
        extras: null,
      }),
    ])
      .then((data) => {
        setWatchNextShows(data[0])
        localStorage.setItem("watchNextShowsCount", data[0].length)

        setWatchListShows(data[1])
        localStorage.setItem("watchListShowsCount", data[1].length)

        setFinishedShows(data[2])
        localStorage.setItem("finishedShowsCount", data[2].length)

        setStoppedShows(data[3])
        localStorage.setItem("stoppedShowsCount", data[3].length)
      })
      .catch((error) => {
        setOpenSnackbar(true)
        setSnackbarSeverity("error")
        setSnackbarMessage(error.message)
      })
  }, [triggerRefresh])

  useEffect(() => {
    if (
      watchNextShowsFetchOK &&
      watchListShowsFetchOK &&
      upToDateShowsFetchOK &&
      finishedShowsFetchOK &&
      stoppedShowsFetchOK
    ) {
      setLoading(false)
      setDisableBannerActions(false)
    }
  }, [
    watchNextShowsFetchOK,
    watchListShowsFetchOK,
    upToDateShowsFetchOK,
    finishedShowsFetchOK,
    stoppedShowsFetchOK,
  ])

  return (
    <div>
      <WatchNext
        watchNextShows={watchNextShows}
        triggerRefresh={triggerRefresh}
        setTriggerRefresh={setTriggerRefresh}
        loading={loading}
        setLoading={setLoading}
        setWatchNextShowsFetchOK={setWatchNextShowsFetchOK}
      />

      <UpToDate
        watchNextShows={watchNextShows}
        loading={loading}
        setLoading={setLoading}
        setUpToDateShowsFetchOK={setUpToDateShowsFetchOK}
      />

      <WatchList
        watchListShows={watchListShows}
        triggerRefresh={triggerRefresh}
        setTriggerRefresh={setTriggerRefresh}
        loading={loading}
        setLoading={setLoading}
        setWatchListShowsFetchOK={setWatchListShowsFetchOK}
      />

      <StoppedShows
        stoppedShows={stoppedShows}
        loading={loading}
        setLoading={setLoading}
        setStoppedShowsFetchOK={setStoppedShowsFetchOK}
      />

      <Finished
        finishedShows={finishedShows}
        loading={loading}
        setLoading={setLoading}
        setFinishedShowsFetchOK={setFinishedShowsFetchOK}
      />
    </div>
  )
}
