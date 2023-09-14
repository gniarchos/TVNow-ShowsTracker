import React from "react"
import Slider from "./Slider"
import Navbar from "./Navbar"
import MySuggestions from "./MySuggestions"
import "./Home.css"
import Footer from "./Footer"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../authentication/AuthContext"
import PuffLoader from "react-spinners/PuffLoader"
import useGeoLocation from "react-ipgeolocation"

export default function Home() {
  const navigate = useNavigate()
  const isLoggedIn = true
  const [allTrending, setAllTrending] = React.useState([])
  const [allPopular, setAllPopular] = React.useState([])
  const [allOnTheAir, setAllOnTheAir] = React.useState([])
  const [discover, setDiscover] = React.useState([])
  const { currentUser } = useAuth()
  const [loading, setLoading] = React.useState(true)
  const locationIP = useGeoLocation()

  localStorage.setItem("currentPage", 1)

  if (locationIP.isLoading === false) {
    localStorage.setItem("userCountry", locationIP.country.toLowerCase())
  }

  React.useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  localStorage.setItem("genresFiltersName", "Show All")
  localStorage.setItem("genresFilters", "Show All")

  React.useEffect(() => {
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
      setDiscover
    )

    Promise.all([
      trendingPromise,
      popularPromise,
      onTheAirPromise,
      discoverPromise,
    ])
      .then(() => {
        // All fetch requests have completed successfully
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  function toggleFindMore(section) {
    if (section === "Trending Now") {
      navigate("/discover", {
        state: {
          fetchLink: `https://api.themoviedb.org/3/trending/tv/week?api_key=${process.env.REACT_APP_THEMOVIEDB_API}&page=`,
          sectionTitle: section,
          userId: currentUser.uid,
        },
      })
    } else if (section === "Popular Today") {
      navigate("/discover", {
        state: {
          fetchLink: `https://api.themoviedb.org/3/tv/popular?api_key=${process.env.REACT_APP_THEMOVIEDB_API}&language=en-US&page=`,
          sectionTitle: section,
          userId: currentUser.uid,
        },
      })
    } else if (section === "On The Air") {
      navigate("/discover", {
        state: {
          fetchLink: `https://api.themoviedb.org/3/tv/on_the_air?api_key=${process.env.REACT_APP_THEMOVIEDB_API}&language=en-US&page=`,
          sectionTitle: section,
          userId: currentUser.uid,
        },
      })
    } else if (section === "Discover") {
      navigate("/discover", {
        state: {
          fetchLink: `https://api.themoviedb.org/3/discover/tv?api_key=${process.env.REACT_APP_THEMOVIEDB_API}&language=en-US&page=`,
          sectionTitle: section,
          userId: currentUser.uid,
        },
      })
    }
  }

  return (
    <>
      <div className="bg"></div>
      <Navbar isLoggedIn={isLoggedIn} isHome={true} />

      {loading === true && (
        <div className="spinner-div-home">
          <PuffLoader color={"white"} size={100} />
          <h3>Reloading Data...</h3>
        </div>
      )}

      {loading === false && <MySuggestions />}
      {loading === false && (
        <div className="home-wrapper">
          <Slider
            listOfShows={allTrending}
            section="Trending Now"
            toggleFindMore={toggleFindMore}
          />
          <Slider
            listOfShows={allPopular}
            section="Popular Today"
            toggleFindMore={toggleFindMore}
          />
          <Slider
            listOfShows={allOnTheAir}
            section="On The Air"
            toggleFindMore={toggleFindMore}
          />
          <Slider
            listOfShows={discover}
            section="Discover"
            toggleFindMore={toggleFindMore}
          />
        </div>
      )}

      <Footer />
    </>
  )
}
