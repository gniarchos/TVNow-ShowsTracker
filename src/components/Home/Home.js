import React, { useState, useEffect, useContext } from "react"
import "./Home.css"
import MySuggestions from "./MySuggestions/MySuggestions"
import Loader from "../Other/Loader/Loader"
import apiCaller from "../../Api/ApiCaller"
import { LayoutContext } from "../Layout/Layout"
import HomeShowsLists from "./HomeShowsLists/HomeShowsLists"
import dayjs from "dayjs"

export default function Home() {
  const [allTrending, setAllTrending] = useState([])
  const [allDiscover, setAllDiscover] = useState([])
  const [allTrendingNetflix, setAllTrendingNetflix] = useState([])
  const [allTrendingHBO, setAllTrendingHBO] = useState([])
  const [allTrendingAmazonPrime, setAllTrendingAmazonPrime] = useState([])
  const [allTrendingDisney, setAllTrendingDisney] = useState([])
  const [allTrendingAppleTV, setAllTrendingAppleTV] = useState([])
  const [loading, setLoading] = useState(true)
  const [onCinemaList, setOnCinemaList] = useState([])
  const [comingSoonList, setComingSoonList] = useState([])

  const {
    setOpenSnackbar,
    setSnackbarMessage,
    setSnackbarSeverity,
    showsORmovies,
  } = useContext(LayoutContext)

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

    if (showsORmovies === "movies") {
      Promise.all([
        apiCaller({
          url: `${process.env.REACT_APP_THEMOVIEDB_URL}/trending/movie/day?api_key=${process.env.REACT_APP_THEMOVIEDB_API}&region=US`,
          method: "GET",
          contentType: "application/json",
          body: null,
          calledFrom: "trendingList",
          isResponseJSON: true,
          extras: null,
        }),
        apiCaller({
          url: `${process.env.REACT_APP_THEMOVIEDB_URL}/movie/now_playing?api_key=${process.env.REACT_APP_THEMOVIEDB_API}&region=US`,
          method: "GET",
          contentType: "application/json",
          body: null,
          calledFrom: "onCinemaList",
          isResponseJSON: true,
          extras: null,
        }),
        apiCaller({
          url: `${process.env.REACT_APP_THEMOVIEDB_URL}/movie/upcoming?api_key=${process.env.REACT_APP_THEMOVIEDB_API}&region=US`,
          method: "GET",
          contentType: "application/json",
          body: null,
          calledFrom: "upcomingList",
          isResponseJSON: true,
          extras: null,
        }),
      ])
        .then((data) => {
          setLoading(false)
          setAllTrending(data[0].results)
          setOnCinemaList(data[1].results)
          const filteredTrending = data[2].results.filter((movie) => {
            if (
              dayjs(movie.release_date).format("YYYY-MM-DD") >
              dayjs().format("YYYY-MM-DD")
            ) {
              return movie
            }
          })
          setComingSoonList(filteredTrending)
        })
        .catch((error) => {
          setSnackbarSeverity("error")
          setSnackbarMessage(error.message)
          setOpenSnackbar(true)
        })
    } else {
      Promise.all([
        apiCaller({
          url: `${process.env.REACT_APP_THEMOVIEDB_URL}/trending/tv/day?api_key=${process.env.REACT_APP_THEMOVIEDB_API}&page=1`,
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
        apiCaller({
          url: `https://api.themoviedb.org/3/discover/tv?api_key=${process.env.REACT_APP_THEMOVIEDB_API}&language=en-US&sort_by=popularity.desc&with_networks=213&with_status=0|1&watch_region=US`,
          method: "GET",
          contentType: "application/json",
          body: null,
          calledFrom: "trendingListNetflix",
          isResponseJSON: true,
          extras: null,
        }),
        apiCaller({
          url: `https://api.themoviedb.org/3/discover/tv?api_key=${process.env.REACT_APP_THEMOVIEDB_API}&language=en-US&sort_by=popularity.desc&with_networks=49|3186|3308|7869&with_status=0|1`,
          method: "GET",
          contentType: "application/json",
          body: null,
          calledFrom: "trendingListHBO",
          isResponseJSON: true,
          extras: null,
        }),
        apiCaller({
          url: `https://api.themoviedb.org/3/discover/tv?api_key=${process.env.REACT_APP_THEMOVIEDB_API}&language=en-US&sort_by=popularity.desc&with_networks=1024&with_status=0|1&watch_region=US`,
          method: "GET",
          contentType: "application/json",
          body: null,
          calledFrom: "trendingAmazonPrime",
          isResponseJSON: true,
          extras: null,
        }),
        apiCaller({
          url: `https://api.themoviedb.org/3/discover/tv?api_key=${process.env.REACT_APP_THEMOVIEDB_API}&language=en-US&sort_by=popularity.desc&with_networks=2739&with_status=0|1&watch_region=US`,
          method: "GET",
          contentType: "application/json",
          body: null,
          calledFrom: "trendingDisneyPlus",
          isResponseJSON: true,
          extras: null,
        }),
        apiCaller({
          url: `https://api.themoviedb.org/3/discover/tv?api_key=${process.env.REACT_APP_THEMOVIEDB_API}&language=en-US&sort_by=popularity.desc&with_networks=2552&with_status=0|1&watch_region=US`,
          method: "GET",
          contentType: "application/json",
          body: null,
          calledFrom: "trendingAppleTV",
          isResponseJSON: true,
          extras: null,
        }),
      ])
        .then((data) => {
          setAllTrending(data[0].results)
          setAllDiscover(data[1].results)
          setAllTrendingNetflix(data[2].results)
          setAllTrendingHBO(data[3].results)
          setAllTrendingAmazonPrime(data[4].results)
          setAllTrendingDisney(data[5].results)
          setAllTrendingAppleTV(data[6].results)
          setLoading(false)
        })
        .catch((error) => {
          setSnackbarSeverity("error")
          setSnackbarMessage(error.message)
          setOpenSnackbar(true)
        })
    }
  }, [showsORmovies])

  if (loading) {
    return <Loader />
  }

  return (
    <>
      <MySuggestions />

      <div className="home-content">
        <HomeShowsLists
          listOfShows={allTrending}
          section="Trending Now"
          urlTitle="Trending Now"
          type="trending"
        />

        {showsORmovies === "shows" ? (
          <>
            <HomeShowsLists
              listOfShows={allTrendingNetflix}
              section="Hot on Netflix"
              urlTitle="Hot on Netflix"
              type="trendingNetflix"
            />

            <HomeShowsLists
              listOfShows={allTrendingAppleTV}
              section="Hot on Apple TV+"
              urlTitle="Hot on Apple TV%2B"
              type="trendingAppleTVPlus"
            />
            <HomeShowsLists
              listOfShows={allTrendingHBO}
              section="Hot on HBO"
              urlTitle="Hot on HBO"
              type="trendingHBO"
            />
            <HomeShowsLists
              listOfShows={allTrendingAmazonPrime}
              section="Hot on Prime Video"
              urlTitle="Hot on Prime Video"
              type="trendingAmazonPrime"
            />
            <HomeShowsLists
              listOfShows={allTrendingDisney}
              section="Hot on Disney+"
              urlTitle="Hot on Disney%2B"
              type="trendingDisneyPlus"
            />
            <HomeShowsLists
              listOfShows={allDiscover}
              urlTitle="Discover"
              section="Discover"
              type="discover"
            />
          </>
        ) : (
          <>
            <HomeShowsLists
              listOfShows={onCinemaList}
              urlTitle="Now Playing"
              section="Now Playing"
              type="nowPlaying"
            />

            <HomeShowsLists
              listOfShows={comingSoonList}
              urlTitle="Coming Soon"
              section="Coming Soon"
              type="comingSoon"
            />
          </>
        )}
      </div>
    </>
  )
}
