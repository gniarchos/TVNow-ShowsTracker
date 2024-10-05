import { useState, useEffect, createContext, lazy } from "react"
import "./ShowOverview.css"
import { useAuth } from "../../authentication/AuthContext"
import { useSearchParams } from "react-router-dom"
import { db } from "../../services/firebase"
import PuffLoader from "react-spinners/PuffLoader"
import Loader from "../Other/Loader/Loader"
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
        `${process.env.REACT_APP_THEMOVIEDB_URL}/tv/${param_show_id}?api_key=${process.env.REACT_APP_THEMOVIEDB_API}&language=en-US&append_to_response=external_ids,videos,aggregate_credits,content_ratings,recommendations,similar,watch/providers,images`
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

    Promise.all([fetchShowData(), fetchUserStatusOfShow()]).catch((error) => {
      console.error("Error fetching data:", error)
    })

    window.addEventListener("resize", handleWindowSizeChange)
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange)
    }
  }, [param_show_id])

  useEffect(() => {
    const userCountry = localStorage.getItem("userCountry")

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

    Promise.all([fetchAvailabilityData()]).catch((error) => {
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
          />
        </ShowOverviewContext.Provider>
        <ShowDetailedGeneralInfo showData={showData} />
      </div>
    </div>
  )
}
