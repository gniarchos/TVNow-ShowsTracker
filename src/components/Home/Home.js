import React, { useState, useEffect, useContext } from "react"
import "./Home.css"
import MySuggestions from "./MySuggestions/MySuggestions"
import ShowsList from "./ShowsList"
import Loader from "../Other/Loader/Loader"
import apiCaller from "../../Api/ApiCaller_NEW"
import { LayoutContext } from "../Layout/Layout"

export default function Home() {
  const [allTrending, setAllTrending] = useState([])
  const [allDiscover, setAllDiscover] = useState([])
  const [loading, setLoading] = useState(true)

  const { setOpenSnackbar, setSnackbarMessage, setSnackbarSeverity } =
    useContext(LayoutContext)

  // TODO: refactor later
  const value = localStorage.getItem("userCountry")
  if (value === null) {
    fetch("https://ipapi.co/json/")
      .then((res) => res.json())
      .then((data) => {
        localStorage.setItem("userCountry", data.country.toLowerCase())
      })
  }

  useEffect(() => {
    setLoading(true)

    Promise.all([
      apiCaller({
        url: `${process.env.REACT_APP_THEMOVIEDB_URL}/trending/tv/week?api_key=${process.env.REACT_APP_THEMOVIEDB_API}&page=1`,
        method: "GET",
        contentType: "application/json",
        body: null,
        calledFrom: "trendingList",
        isResponseJSON: true,
        extras: null,
      }),
      apiCaller({
        url: `${process.env.REACT_APP_THEMOVIEDB_URL}/tv/top_rated?api_key=${process.env.REACT_APP_THEMOVIEDB_API}&language=en-US&page=1`,
        method: "GET",
        contentType: "application/json",
        body: null,
        calledFrom: "discoverList",
        isResponseJSON: true,
        extras: null,
      }),
    ])
      .then((data) => {
        setAllTrending(data[0].results)
        setAllDiscover(data[1].results)
        setLoading(false)
      })
      .catch((error) => {
        setSnackbarSeverity("error")
        setSnackbarMessage(error.message)
        setOpenSnackbar(true)
      })
  }, [])

  if (loading) {
    return <Loader />
  }

  return (
    <>
      <MySuggestions />

      <div className="home-content">
        <ShowsList
          listOfShows={allTrending}
          section="Trending Now"
          type="trending"
        />

        <ShowsList
          listOfShows={allDiscover}
          section="Discover"
          type="discover"
        />
      </div>
    </>
  )
}
