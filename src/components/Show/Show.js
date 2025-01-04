import React, { useContext, useEffect, useState } from "react"
import "./Show.css"
import { useLocation, useSearchParams } from "react-router-dom"
import { LayoutContext } from "../Layout/Layout"
import apiCaller from "../../Api/ApiCaller"
import ScrollToTop from "../Other/ScrollToTop"
import ShowBanner from "./ShowBanner/ShowBanner"
import Loader from "../Other/Loader/Loader"
import ShowTrackingInfo from "./ShowTrackingInfo/ShowTrackingInfo"
import ShowDetails from "./ShowDetails/ShowDetails"
import { Divider, useMediaQuery } from "@mui/material"
import ShowGeneralInfo from "./ShowGeneralInfo/ShowGeneralInfo"
import { useTheme } from "@emotion/react"

export default function Show() {
  const user_id = localStorage.getItem("user_id")
  const [searchParams, setSearchParams] = useSearchParams()
  const param_show_name = searchParams.get("show_name")
  const param_show_id = searchParams.get("show_id")
  const [showData, setShowData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [imdbRating, setImdbRating] = useState(0.0)
  const [rottenTomatoesRating, setRottenTomatoesRating] = useState(0)
  const [traktRating, setTraktRating] = useState(0)
  const [seasonNumber, setSeasonNumber] = useState(1)
  const [seasonInfo, setSeasonInfo] = useState(null)
  const location = useLocation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const [allUserShows, setAllUserShows] = useState([])
  const [userShowInfo, setUserShowInfo] = useState([])
  const [extrasInfoFetchesDone, setExtrasInfoFetchesDone] = useState(false)
  const [showInUserList, setShowInUserList] = useState(false)
  const [loadingEpisodes, setLoadingEpisodes] = useState(true)

  const { setOpenSnackbar, setSnackbarMessage, setSnackbarSeverity } =
    useContext(LayoutContext)

  useEffect(() => {
    setLoading(true)
    window.scrollTo(0, 0)
  }, [location])

  useEffect(() => {
    setShowInUserList(false)
    setLoadingEpisodes(true)
    const fetchAPIs = async () => {
      try {
        const promises = [
          apiCaller({
            url: `${process.env.REACT_APP_THEMOVIEDB_URL}/tv/${param_show_id}?api_key=${process.env.REACT_APP_THEMOVIEDB_API}&language=en-US&append_to_response=external_ids,videos,aggregate_credits,content_ratings,recommendations,similar,watch/providers,images`,
            method: "GET",
            contentType: "application/json",
            body: null,
            calledFrom: "showInfo",
            isResponseJSON: true,
            extras: null,
          }),
          apiCaller({
            url: `${process.env.REACT_APP_THEMOVIEDB_URL}/tv/${param_show_id}/season/${seasonNumber}?api_key=${process.env.REACT_APP_THEMOVIEDB_API}&language=en-US`,
            method: "GET",
            contentType: "application/json",
            body: null,
            calledFrom: "seasonInfo",
            isResponseJSON: true,
            extras: null,
          }),
        ]

        // Add the user-specific API call only if the user is logged in
        if (user_id) {
          promises.push(
            apiCaller({
              url: `${process.env.REACT_APP_BACKEND_API_URL}/users/${user_id}/all-shows`,
              method: "GET",
              contentType: "application/json",
              body: null,
              calledFrom: "allUserShows",
              isResponseJSON: true,
              extras: null,
            })
          )
        }

        // Wait for all resolved promises
        const data = await Promise.all(promises)

        setShowData(data[0])
        setSeasonInfo(data[1])
        if (user_id) {
          setAllUserShows(data[2])
        }
      } catch (error) {
        setOpenSnackbar(true)
        setSnackbarMessage(error.message)
        setSnackbarSeverity("error")
      }
    }

    fetchAPIs()
  }, [seasonNumber, location, searchParams])

  useEffect(() => {
    if (showData && showData.external_ids && showData.external_ids.imdb_id) {
      apiCaller({
        url: `${process.env.REACT_APP_BACKEND_API_URL}/proxy/mdblist?imdb_id=${showData.external_ids.imdb_id}`,
        method: "GET",
        contentType: "application/json",
        body: null,
        calledFrom: "mdblistProxy",
        isResponseJSON: true,
        extras: null,
      })
        .then((data) => {
          setImdbRating(data.ratings?.[0]?.value || 0.0)
          setRottenTomatoesRating(data.ratings?.[4]?.value || 0)
          setTraktRating(data.ratings?.[3]?.value || 0)
        })
        .catch((error) => {
          setOpenSnackbar(true)
          setSnackbarMessage(error.message || "An error occurred.")
          setSnackbarSeverity("error")
        })
    } else {
      setImdbRating(0.0)
      setRottenTomatoesRating(0)
      setTraktRating(0)
    }

    if (user_id && allUserShows.length > 0) {
      if (userShowInfo.length === 0 && showInUserList) {
        allUserShows.forEach((show) => {
          if (show.show_id === showData.id) {
            apiCaller({
              url: `${process.env.REACT_APP_BACKEND_API_URL}/users/${user_id}/show-info/${param_show_id}`,
              method: "GET",
              contentType: "application/json",
              body: null,
              calledFrom: "userShowInfo",
              isResponseJSON: true,
              extras: null,
            })
              .then((data) => {
                setUserShowInfo(data)
              })
              .catch((error) => {
                setOpenSnackbar(true)
                setSnackbarMessage(error.message || "An error occurred.")
                setSnackbarSeverity("error")
              })
          }
        })
      }
    }

    setExtrasInfoFetchesDone(true)
  }, [showData, allUserShows])

  useEffect(() => {
    if (showData !== null && seasonInfo !== null && extrasInfoFetchesDone) {
      if (userShowInfo.length === 0 && !showInUserList) {
        setLoading(false)
        setLoadingEpisodes(false)
      }
    }
  }, [showData, seasonInfo, extrasInfoFetchesDone, userShowInfo])

  if (loading) {
    return <Loader />
  }

  return (
    <div className="show-wrapper">
      <ScrollToTop />

      <ShowBanner
        showData={showData}
        imdbRating={imdbRating}
        rottenTomatoesRating={rottenTomatoesRating}
        traktRating={traktRating}
        allUserShows={allUserShows}
        showInUserList={showInUserList}
        setShowInUserList={setShowInUserList}
        userShowInfo={userShowInfo}
        setUserShowInfo={setUserShowInfo}
      />

      <ShowTrackingInfo showData={showData} />

      <div className="show-container">
        <ShowDetails
          showData={showData}
          seasonNumber={seasonNumber}
          setSeasonNumber={setSeasonNumber}
          seasonInfo={seasonInfo}
          userShowInfo={userShowInfo}
          showInUserList={showInUserList}
          loadingEpisodes={loadingEpisodes}
        />

        <Divider
          color="white"
          orientation={isMobile ? "horizontal" : "vertical"}
          flexItem
        />

        <ShowGeneralInfo showData={showData} />
      </div>
    </div>
  )
}
