import React, { useContext, useEffect, useState } from "react"
import "./Show.css"
import { useSearchParams } from "react-router-dom"
import { LayoutContext } from "../Layout/Layout"
import apiCaller from "../../Api/ApiCaller"
import ScrollToTop from "../Other/ScrollToTop"

export default function Show() {
  const [searchParams, setSearchParams] = useSearchParams()
  const param_show_name = searchParams.get("show_name")
  const param_show_id = searchParams.get("show_id")
  const [showData, setShowData] = useState()
  const [loading, setLoading] = useState(true)

  const { setOpenSnackbar, setSnackbarMessage, setSnackbarSeverity } =
    useContext(LayoutContext)

  useEffect(() => {
    setLoading(true)
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
      // apiCaller({
      //   url:  `https://streaming-availability.p.rapidapi.com/get?output_language=en&country=gr&imdb_id=${showData?.external_ids?.imdb_id}&api_key=${process.env.REACT_APP_STREAMING_AVAILABILITY_API}`,
      //   method: "GET",
      //   contentType: "application/json",
      //   body: null,
      //   calledFrom: "streamingAvailability",
      //   isResponseJSON: true,
      //   extras: null,
      // }),
    ])
      .then((data) => {
        setShowData(data[0])
        // setStreamServicesAvailable(data[1].result?.streamingInfo[userCountry])
        setLoading(false)
      })
      .catch((error) => {
        setOpenSnackbar(true)
        setSnackbarMessage(error.message)
        setSnackbarSeverity("error")
      })
  }, [])

  return (
    <div>
      <ScrollToTop />
    </div>
  )
}
