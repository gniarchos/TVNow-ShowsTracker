import React from "react"
import Slider from "./Slider"
import Navbar from "./Navbar"
import MySuggestions from "./MySuggestions"
import "./Home.css"
import Footer from "./Footer"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../authentication/AuthContext"
import PuffLoader from "react-spinners/PuffLoader"

export default function Home() {
  const navigate = useNavigate()
  const isLoggedIn = true
  const [allTrendings, setAllTrendings] = React.useState([])
  const [allPopular, setAllPopular] = React.useState([])
  const [allOnTheAir, setAllOnTheAir] = React.useState([])
  const [discover, setDiscover] = React.useState([])
  const { currentUser } = useAuth()
  const [loading, setLoading] = React.useState(true)

  localStorage.setItem("currentPage", 1)

  React.useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  localStorage.setItem("genresFiltersName", "Show All")
  localStorage.setItem("genresFilters", "Show All")

  React.useEffect(() => {
    setLoading(true)

    fetch(
      "https://api.themoviedb.org/3/trending/tv/week?api_key=***REMOVED***&page=1"
    )
      .then((res) => res.json())
      .then((data) => {
        setAllTrendings(data.results)
      })

    fetch(
      "https://api.themoviedb.org/3/tv/popular?api_key=***REMOVED***&language=en-US&page=1"
    )
      .then((res) => res.json())
      .then((data) => {
        setAllPopular(data.results)
      })

    fetch(
      "https://api.themoviedb.org/3/tv/on_the_air?api_key=***REMOVED***&language=en-US&page=1"
    )
      .then((res) => res.json())
      .then((data) => {
        setAllOnTheAir(data.results)
      })

    fetch(
      "https://api.themoviedb.org/3/discover/tv?api_key=***REMOVED***&language=en-US&page=1"
    )
      .then((res) => res.json())
      .then((data) => {
        setDiscover(data.results)
      })

    setTimeout(function () {
      setLoading(false)
    }, 500)
  }, [])

  function toggleFindMore(section) {
    if (section === "Trending Now") {
      navigate("/discover", {
        state: {
          fetchLink:
            "https://api.themoviedb.org/3/trending/tv/week?api_key=***REMOVED***&page=",
          sectionTitle: section,
          userId: currentUser.uid,
        },
      })
    } else if (section === "Popular Today") {
      navigate("/discover", {
        state: {
          fetchLink:
            "https://api.themoviedb.org/3/tv/popular?api_key=***REMOVED***&language=en-US&page=",
          sectionTitle: section,
          userId: currentUser.uid,
        },
      })
    } else if (section === "On The Air") {
      navigate("/discover", {
        state: {
          fetchLink:
            "https://api.themoviedb.org/3/tv/on_the_air?api_key=***REMOVED***&language=en-US&page=",
          sectionTitle: section,
          userId: currentUser.uid,
        },
      })
    } else if (section === "Discover") {
      navigate("/discover", {
        state: {
          fetchLink:
            "https://api.themoviedb.org/3/discover/tv?api_key=***REMOVED***&language=en-US&page=",
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
            listOfShows={allTrendings}
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
