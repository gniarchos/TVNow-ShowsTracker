import React, { useContext, useEffect, useState } from "react"
import "./Show.css"
import { useSearchParams } from "react-router-dom"
import { LayoutContext } from "../Layout/Layout"
import apiCaller from "../../Api/ApiCaller_NEW"
import ScrollToTop from "../Other/ScrollToTop"
import ShowBanner from "./ShowBanner/ShowBanner"
import Loader from "../Other/Loader/Loader"
import ShowTrackingInfo from "./ShowTrackingInfo/ShowTrackingInfo"
import ShowDetails from "./ShowDetails/ShowDetails"
import { Divider } from "@mui/material"
import ShowGeneralInfo from "./ShowGeneralInfo/ShowGeneralInfo"

export default function Show() {
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

  const { setOpenSnackbar, setSnackbarMessage, setSnackbarSeverity } =
    useContext(LayoutContext)

  useEffect(() => {
    Promise.all([
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
    ])
      .then((data) => {
        setShowData(data[0])
        setSeasonInfo(data[1])
      })
      .catch((error) => {
        setOpenSnackbar(true)
        setSnackbarMessage(error.message)
        setSnackbarSeverity("error")
      })
  }, [seasonNumber])

  useEffect(() => {
    if (showData !== null) {
      Promise.all([
        // apiCaller({
        //   url: `https://mdblist.p.rapidapi.com/?i=${showData?.external_ids?.imdb_id}`,
        //   method: "GET",
        //   contentType: "application/json",
        //   body: null,
        //   calledFrom: "mdblist",
        //   isResponseJSON: true,
        //   extras: null,
        // }),
        // apiCaller({
        //   url: `https://streaming-availability.p.rapidapi.com/get/basic?country=us&imdb_id=${showData?.external_ids?.imdb_id}`,
        //   method: "GET",
        //   contentType: "application/json",
        //   body: null,
        //   calledFrom: "streamingAvailability",
        //   isResponseJSON: true,
        //   extras: null,
        // }),
      ])
      // .then((data) => {
      //   // setShowData(data[0])
      //   // setStreamServicesAvailable(data[1].result?.streamingInfo[userCountry])
      //   setLoading(false)
      //   setImdbRating(data[0].ratings[0]?.value)
      //   setRottenTomatoesRating(data[0].ratings[4]?.value)
      //   setTraktRating(data[0].ratings[3]?.value)
      // })
      // .catch((error) => {
      //   setOpenSnackbar(true)
      //   setSnackbarMessage(error.message)
      //   setSnackbarSeverity("error")
      // })
    }
  }, [showData])

  useEffect(() => {
    if (showData !== null && seasonInfo !== null) {
      setLoading(false)
    }
  }, [showData, seasonInfo])

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
      />

      <ShowTrackingInfo showData={showData} />

      <div className="show-container">
        <ShowDetails
          showData={showData}
          seasonNumber={seasonNumber}
          setSeasonNumber={setSeasonNumber}
          seasonInfo={seasonInfo}
        />

        <Divider color="white" orientation="vertical" flexItem />

        <ShowGeneralInfo showData={showData} />
      </div>
    </div>
  )
}
