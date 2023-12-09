import React, { useState, useEffect } from "react"
import "./Home.css"
import PuffLoader from "react-spinners/PuffLoader"
import MySuggestions from "./MySuggestions"
import ShowsList from "./ShowsList"
import Loader from "../Other/Loader"

export default function Home() {
  const [allTrending, setAllTrending] = useState([])
  const [allPopular, setAllPopular] = useState([])
  const [allOnTheAir, setAllOnTheAir] = useState([])
  const [allDiscover, setAllDiscover] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

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

    const fetchAndSetData = async (url, setter) => {
      const res = await fetch(url)
      const data = await res.json()
      setter(data.results)
    }

    const trendingPromise = fetchAndSetData(
      `https://api.themoviedb.org/3/trending/tv/week?api_key=${process.env.REACT_APP_THEMOVIEDB_API}&page=1`,
      setAllTrending
    )
    const popularPromise = fetchAndSetData(
      `https://api.themoviedb.org/3/tv/popular?api_key=${process.env.REACT_APP_THEMOVIEDB_API}&language=en-US&page=1`,
      setAllPopular
    )
    const onTheAirPromise = fetchAndSetData(
      `https://api.themoviedb.org/3/tv/on_the_air?api_key=${process.env.REACT_APP_THEMOVIEDB_API}&language=en-US&page=1`,
      setAllOnTheAir
    )
    const discoverPromise = fetchAndSetData(
      `https://api.themoviedb.org/3/discover/tv?api_key=${process.env.REACT_APP_THEMOVIEDB_API}&language=en-US&page=1`,
      setAllDiscover
    )

    Promise.all([
      trendingPromise,
      popularPromise,
      onTheAirPromise,
      discoverPromise,
    ]).finally(() => {
      setLoading(false)
    })
  }, [])

  if (loading) {
    return <Loader />
  }

  return (
    <div>
      <div className="mySuggestions">
        <MySuggestions />
      </div>

      <div className="home-wrapper">
        <ShowsList
          listOfShows={allTrending}
          section="Trending Now"
          type="trending"
        />
        <ShowsList
          listOfShows={allPopular}
          section="Popular Today"
          type="popular"
        />
        <ShowsList
          listOfShows={allOnTheAir}
          section="On The Air"
          type="on_the_air"
        />
        <ShowsList
          listOfShows={allDiscover}
          section="Discover"
          type="discover"
        />
      </div>
    </div>
  )
}
