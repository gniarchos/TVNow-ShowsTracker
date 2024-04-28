import { useEffect, useState, createContext } from "react"
import Loader from "../Other/Loader"
import ScrollToTop from "../Other/ScrollToTop"
import CancelledShows from "./CancelledShows"
import ProfileCover from "./ProfileCover"
import { useAuth } from "../../authentication/AuthContext"
import ProfileStatistics from "./ProfileStatistics"
import ProfileWatchNext from "./ProfileWatchNext"
import "./Profile.css"
import { db } from "../../services/firebase"
import ProfileUpToDate from "./ProfileUpToDate"
import ProfileWatchList from "./ProfileWatchlist"
import ProfileFinishedStopped from "./ProfileFinishedStopped"
import ProfileHistory from "./ProfileHistory"
import { databaseCaller } from "../../Api/DatabaseCaller"
import useApiCaller from "../../Api/ApiCaller"
import apiCaller from "../../Api/ApiCaller"

export const ProfileContext = createContext()

export default function Profile() {
  document.title = `TVTime | TV Shows Tracker`

  const { currentUser } = useAuth()
  const [seasonData, setSeasonData] = useState([])
  const [showsData, setShowsData] = useState([])
  const [userAllShowsData, setUserAllShowsData] = useState([])
  const [loading, setLoading] = useState(true)
  const [mobileLayout, setMobileLayout] = useState(
    localStorage.getItem("mobileLayoutSelection")
      ? localStorage.getItem("mobileLayoutSelection")
      : "cards"
  )
  const [showLayoutMessage, setShowLayoutMessage] = useState(false)
  const [triggerFetchUserData, setTriggerFetchUserData] = useState(false)
  const [isFirstLoad, setIsFirstLoad] = useState(true)
  const [watchNextSection, setWatchNextSection] = useState(
    localStorage.getItem("watchNextSection")
      ? JSON.parse(localStorage.getItem("watchNextSection"))
      : true
  )
  const [upToDateSection, setUpToDateSection] = useState(
    localStorage.getItem("upToDateSection")
      ? JSON.parse(localStorage.getItem("upToDateSection"))
      : true
  )
  const [watchlistSection, setWatchlistSection] = useState(
    localStorage.getItem("watchlistSection")
      ? JSON.parse(localStorage.getItem("watchlistSection"))
      : true
  )
  const [finishedSection, setFinishedSection] = useState(
    localStorage.getItem("finishedSection")
      ? JSON.parse(localStorage.getItem("finishedSection"))
      : true
  )
  const [stoppedSection, setStoppedSection] = useState(
    localStorage.getItem("stoppedSection")
      ? JSON.parse(localStorage.getItem("stoppedSection"))
      : true
  )
  const [historySection, setHistorySection] = useState(
    localStorage.getItem("historySection")
      ? JSON.parse(localStorage.getItem("historySection"))
      : true
  )
  const [upToDateFilter, setUpToDateFilter] = useState(
    localStorage.getItem("upToDateFilter")
      ? localStorage.getItem("upToDateFilter")
      : "all"
  )
  const [cancelled_shows, setCancelled_shows] = useState(new Set())
  const [show_modal, setShow_modal] = useState(false)

  const contextValues = {
    triggerFetchUserData,
    setTriggerFetchUserData,
    cancelled_shows,
    setCancelled_shows,
    setShow_modal,
  }

  useEffect(() => {
    if (isFirstLoad) {
      window.scrollTo(0, 0)
      setIsFirstLoad(false)
      setLoading(true)
    }

    databaseCaller({
      collectionName: `watchlist-${currentUser.uid}`,
      orderByField: "date_watched",
      orderByDirection: "desc",
      limit: null,
      calledFrom: "profileWatchlist",
    })
      .then((allData) => {
        setUserAllShowsData(allData)
        const showInfoUrls = allData?.map(
          (show) =>
            `https://api.themoviedb.org/3/tv/${show.show_id}?api_key=${process.env.REACT_APP_THEMOVIEDB_API}&language=en-US`
        )

        const showSeasonUrls = allData?.map(
          (show) =>
            `https://api.themoviedb.org/3/tv/${show.show_id}/season/${show.season_number}?api_key=${process.env.REACT_APP_THEMOVIEDB_API}&language=en-US`
        )

        Promise.all([
          apiCaller(showInfoUrls),
          apiCaller(showSeasonUrls, "seasonData"),
        ])
          .then((data) => {
            setShowsData(data[0])
            setSeasonData((prevData) => {
              return data[1].map((season, index) => {
                return {
                  episodes: season.episodes,
                  show_id: allData[index].show_id,
                  seasonTotalEpisodes:
                    season.episodes?.length !== null ||
                    season.episodes?.length !== undefined
                      ? season.episodes?.length
                      : 0,
                }
              })
            })
            setLoading(false)
          })
          .catch((error) => {
            console.error("Error fetching data:", error)
          })
      })
      .catch((error) => {
        console.error("Error fetching user shows:", error)
      })
  }, [triggerFetchUserData, show_modal])

  function changeLayoutMobile() {
    setMobileLayout((prevValue) => (prevValue === "cards" ? "grid" : "cards"))

    setShowLayoutMessage((show) => !show)
    var x = 0
    var intervalID = setInterval(() => {
      setShowLayoutMessage((show) => !show)

      if (++x === 1) {
        window.clearInterval(intervalID)
      }
    }, 2000)

    localStorage.setItem(
      "mobileLayoutSelection",
      mobileLayout === "cards" ? "grid" : "cards"
    )
  }

  function toggleSections(event) {
    const { id } = event.target

    if (id === "watchNext") {
      setWatchNextSection(!watchNextSection)
      localStorage.setItem("watchNextSection", !watchNextSection)
    } else if (id === "upToDate") {
      setUpToDateSection(!upToDateSection)
      localStorage.setItem("upToDateSection", !upToDateSection)
    } else if (id === "watchlist") {
      setWatchlistSection(!watchlistSection)
      localStorage.setItem("watchlistSection", !watchlistSection)
    } else if (id === "finished") {
      setFinishedSection(!finishedSection)
      localStorage.setItem("finishedSection", !finishedSection)
    } else if (id === "stopped") {
      setStoppedSection(!stoppedSection)
      localStorage.setItem("stoppedSection", !stoppedSection)
    } else if (id === "history") {
      setHistorySection(!historySection)
      localStorage.setItem("historySection", !historySection)
    }
  }

  function closeModal() {
    setShow_modal(false)
  }

  function handleFilterUpToDate(id) {
    if (id === "all") {
      setUpToDateFilter("all")
      localStorage.setItem("upToDateFilter", "all")
    } else if (id === "soon") {
      setUpToDateFilter("soon")
      localStorage.setItem("upToDateFilter", "soon")
    } else if (id === "returning") {
      setUpToDateFilter("returning")
      localStorage.setItem("upToDateFilter", "returning")
    }
  }

  if (loading) {
    return <Loader />
  }

  return (
    <div>
      <ScrollToTop />
      <CancelledShows
        cancelled_shows={cancelled_shows}
        state={show_modal}
        closeModal={closeModal}
        loading={loading}
      />

      <ProfileCover
        userShowAllData={userAllShowsData}
        currentUser={currentUser.uid}
        changeLayoutMobile={changeLayoutMobile}
      />

      <ProfileContext.Provider value={contextValues}>
        <ProfileStatistics currentUser={currentUser.uid} />

        <div className="profile-main-content-wrapper">
          <ProfileWatchNext
            seasonData={seasonData}
            showsData={showsData}
            userShowAllData={userAllShowsData}
            mobileLayout={mobileLayout}
            currentUser={currentUser.uid}
            watchNextSection={watchNextSection}
            toggleSections={toggleSections}
          />
          <ProfileUpToDate
            seasonData={seasonData}
            showsData={showsData}
            userShowAllData={userAllShowsData}
            mobileLayout={mobileLayout}
            currentUser={currentUser.uid}
            upToDateSection={upToDateSection}
            toggleSections={toggleSections}
            upToDateFilter={upToDateFilter}
            handleFilterUpToDate={handleFilterUpToDate}
          />
          <ProfileWatchList
            userShowAllData={userAllShowsData}
            showsData={showsData}
            seasonData={seasonData}
            mobileLayout={mobileLayout}
            currentUser={currentUser.uid}
            toggleSections={toggleSections}
            watchlistSection={watchlistSection}
          />
          <ProfileFinishedStopped
            calledFrom="finished"
            userShowAllData={userAllShowsData}
            mobileLayout={mobileLayout}
            showsData={showsData}
            currentUser={currentUser.uid}
            toggleSections={toggleSections}
            finishedSection={finishedSection}
          />

          <ProfileFinishedStopped
            calledFrom="stopped"
            userShowAllData={userAllShowsData}
            mobileLayout={mobileLayout}
            showsData={showsData}
            currentUser={currentUser.uid}
            toggleSections={toggleSections}
            stoppedSection={stoppedSection}
          />

          <ProfileHistory
            currentUser={currentUser.uid}
            historySection={historySection}
            toggleSections={toggleSections}
          />
        </div>
      </ProfileContext.Provider>
      <div className={showLayoutMessage === false ? "popup" : "popup show"}>
        <p className="message-popup">Layout changed to {mobileLayout}</p>
      </div>
    </div>
  )
}
