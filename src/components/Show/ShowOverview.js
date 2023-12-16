import { useState, useEffect, createContext, lazy } from "react"
import "./ShowOverview.css"
import { useAuth } from "../../authentication/AuthContext"
import { useSearchParams } from "react-router-dom"
import { db } from "../../services/firebase"
import PuffLoader from "react-spinners/PuffLoader"
import Loader from "../Other/Loader"
import ShowFullCast from "./ShowFullCast"
import ShowBanner from "./ShowBanner"

// const ShowBanner = lazy(() => import("./ShowBanner"))
const ScrollToTop = lazy(() => import("../Other/ScrollToTop"))
const ShowTrackingInfo = lazy(() => import("./ShowTrackingInfo"))
const ShowDetailedInfoContainer = lazy(() =>
  import("./DetailedInfoContainer/ShowDetailedInfoContainer")
)
// const ShowFullCast = lazy(() => import("./ShowFullCast"))
const ShowDetailedGeneralInfo = lazy(() => import("./ShowDetailedGeneralInfo"))

export const ShowOverviewContext = createContext()

export default function ShowOverview() {
  const { currentUser } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const param_show_name = searchParams.get("show_name")
  const param_show_id = searchParams.get("show_id")

  document.title = `TVTime | ${param_show_name}`

  const [showData, setShowData] = useState()
  const [isLoading, setIsLoading] = useState(true)
  const [imdbRating, setImdbRating] = useState(0.0)
  const [rottenTomatoesRating, setRottenTomatoesRating] = useState(0)
  const [traktRating, setTraktRating] = useState(0)
  const [streamServicesAvailable, setStreamServicesAvailable] = useState([])
  const [showUserStatus, setShowUserStatus] = useState()
  const [mobile, setMobile] = useState(window.innerWidth <= 499)
  const [toggleFullCast, setToggleFullCast] = useState(false)

  const handleWindowSizeChange = () => {
    setMobile(window.innerWidth <= 499)
  }

  useEffect(() => {
    window.scrollTo(0, 0)

    setIsLoading(true)

    const fetchShowData = async () => {
      return await fetch(
        `https://api.themoviedb.org/3/tv/${param_show_id}?api_key=${process.env.REACT_APP_THEMOVIEDB_API}&language=en-US&append_to_response=external_ids,videos,aggregate_credits,content_ratings,recommendations,similar,watch/providers,images`
      )
        .then((res) => res.json())
        .then((data) => {
          setShowData(data)
        })
        .finally(() => {
          setIsLoading(false)
        })
    }

    const fetchUserStatusOfShow = () => {
      return db
        .collection(`watchlist-${currentUser.uid}`)
        .where("show_id", "==", parseInt(param_show_id))
        .onSnapshot((snapshot) => {
          setShowUserStatus(
            snapshot.docs.map((doc) => ({
              status: doc.data().status,
            }))[0]?.status
          )
        })
    }

    Promise.all([fetchShowData(), fetchUserStatusOfShow()])
      .then(() => {
        // console.log("Both fetch calls finished.")
      })
      .catch((error) => {
        console.error("Error fetching data:", error)
      })

    window.addEventListener("resize", handleWindowSizeChange)
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange)
    }
  }, [param_show_id])

  useEffect(() => {
    const userCountry = localStorage.getItem("userCountry")

    const fetchRatingsData = async () => {
      return await fetch(
        `https://mdblist.p.rapidapi.com/?i=${showData?.external_ids?.imdb_id}`,
        {
          method: "GET",
          headers: {
            "X-RapidAPI-Key": process.env.REACT_APP_MDBLIST_API,
            "X-RapidAPI-Host": "mdblist.p.rapidapi.com",
          },
        }
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.response) {
            setImdbRating(data.ratings[0]?.value)
            setRottenTomatoesRating(data.ratings[4]?.value)
            setTraktRating(data.ratings[3]?.value)
          }
        })
        .catch((error) => {
          console.error("Error fetching data from endpoint 2:", error)
        })
    }

    const fetchAvailabilityData = async () => {
      return await fetch(
        `https://streaming-availability.p.rapidapi.com/get?output_language=en&country=gr&imdb_id=${showData?.external_ids?.imdb_id}`,
        {
          method: "GET",
          headers: {
            "X-RapidAPI-Key": `${process.env.REACT_APP_STREAMING_AVAILABILITY_API}`,
            "X-RapidAPI-Host": "streaming-availability.p.rapidapi.com",
          },
        }
      )
        .then((res) => res.json())
        .then((data) => {
          if (userCountry && data.result?.streamingInfo[userCountry]) {
            setStreamServicesAvailable(data.result?.streamingInfo[userCountry])
          }
        })
        .catch((error) => {
          console.error("Error fetching data from endpoint 3:", error)
        })
    }

    Promise.all([fetchRatingsData(), fetchAvailabilityData()])
      .then(() => {
        // console.log("Both API calls finished.")
      })
      .catch((error) => {
        console.error("Error fetching data:", error)
      })
  }, [showData])

  function showHideFullCast() {
    setToggleFullCast(!toggleFullCast)
  }

  if (isLoading) {
    return <Loader />
  } else if (toggleFullCast) {
    return (
      <div>
        <ScrollToTop />
        <ShowBanner
          showData={showData}
          imdbRating={imdbRating}
          rottenTomatoesRating={rottenTomatoesRating}
          traktRating={traktRating}
          currentUser={currentUser.uid}
          show_name={param_show_name}
          show_id={param_show_id}
          showUserStatus={showUserStatus}
        />
        <ShowOverviewContext.Provider value={{ showHideFullCast }}>
          <ShowFullCast showData={showData} />
        </ShowOverviewContext.Provider>
      </div>
    )
  }

  return (
    <div>
      <ScrollToTop />
      <ShowBanner
        showData={showData}
        imdbRating={imdbRating}
        rottenTomatoesRating={rottenTomatoesRating}
        traktRating={traktRating}
        currentUser={currentUser.uid}
        show_name={param_show_name}
        show_id={param_show_id}
        showUserStatus={showUserStatus}
      />
      <ShowTrackingInfo
        showData={showData}
        streamServicesAvailable={streamServicesAvailable}
      />

      <div className="show-main-container">
        <ShowOverviewContext.Provider value={{ showHideFullCast }}>
          <ShowDetailedInfoContainer
            showData={showData}
            show_id={param_show_id}
            show_name={param_show_name}
            isMobile={mobile}
            showUserStatus={showUserStatus}
            currentUser={currentUser.uid}
            imdbRating={imdbRating}
            rottenTomatoesRating={rottenTomatoesRating}
            traktRating={traktRating}
          />
        </ShowOverviewContext.Provider>
        <ShowDetailedGeneralInfo showData={showData} />
      </div>
    </div>
  )
}
