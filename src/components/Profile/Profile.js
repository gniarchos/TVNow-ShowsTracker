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

export const ProfileContext = createContext()

export default function Profile() {
  document.title = `TVTime | TV Shows Tracker`

  const { currentUser } = useAuth()
  const [seasonData, setSeasonData] = useState([])
  const [showsData, setShowsData] = useState([])
  const [userAllShows, setUserAllShows] = useState([])
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

    const getUserAllShow = async () => {
      try {
        const snapshot = await db
          .collection(`watchlist-${currentUser.uid}`)
          .orderBy("date_watched", "desc")
          .get()

        const userShows = snapshot.docs.map((doc) => ({
          show_id: doc.data().show_id,
          show_name: doc.data().show_name,
          seasonNumber: doc.data().season_number,
          episodeNumber: doc.data().episode_number,
          status: doc.data().status,
          date_watched: doc.data().date_watched,
        }))

        setUserAllShows(userShows)
        return userShows // Return the user shows array
      } catch (error) {
        console.error("Error fetching user shows:", error)
        return [] // Return an empty array in case of an error
      }
    }

    const fetchShowData = async () => {
      try {
        const userShows = await getUserAllShow()
        const fetchUserShowData = userShows.map((show) =>
          fetch(
            `https://api.themoviedb.org/3/tv/${show.show_id}?api_key=${process.env.REACT_APP_THEMOVIEDB_API}&language=en-US&include_image_language=en,null&append_to_response=external_ids,videos,aggregate_credits,content_ratings,recommendations,similar,watch/providers,images`
          ).then((res) => res.json())
        )

        const fetchedShowsData = await Promise.all(fetchUserShowData)
        setShowsData(fetchedShowsData)
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }

    const fetchSeasonData = async () => {
      try {
        const user_shows = await getUserAllShow()
        const fetchSeasonsData = user_shows.map((show) =>
          fetch(
            `https://api.themoviedb.org/3/tv/${show.show_id}/season/${show.seasonNumber}?api_key=${process.env.REACT_APP_THEMOVIEDB_API}&language=en-US`
          )
            .then((res) => res.json())
            .then((data) => {
              return {
                episodes: data.episodes,
                show_id: show.show_id,
                seasonTotalEpisodes:
                  data.episodes?.length !== null ||
                  data.episodes?.length !== undefined
                    ? data.episodes?.length
                    : 0,
              }
            })
        )

        const fetchedSeasonsData = await Promise.all(fetchSeasonsData)
        setSeasonData(fetchedSeasonsData)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching data:", error)
        // setLoading(false)
      }
    }

    fetchShowData()
    fetchSeasonData()
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
        userShowAllData={userAllShows}
        currentUser={currentUser.uid}
        changeLayoutMobile={changeLayoutMobile}
      />

      <ProfileContext.Provider value={contextValues}>
        <ProfileStatistics currentUser={currentUser.uid} />

        <div className="profile-main-content-wrapper">
          <ProfileWatchNext
            seasonData={seasonData}
            showsData={showsData}
            userShowAllData={userAllShows}
            mobileLayout={mobileLayout}
            currentUser={currentUser.uid}
            watchNextSection={watchNextSection}
            toggleSections={toggleSections}
          />
          <ProfileUpToDate
            seasonData={seasonData}
            showsData={showsData}
            userShowAllData={userAllShows}
            mobileLayout={mobileLayout}
            currentUser={currentUser.uid}
            upToDateSection={upToDateSection}
            toggleSections={toggleSections}
            upToDateFilter={upToDateFilter}
            handleFilterUpToDate={handleFilterUpToDate}
          />
          <ProfileWatchList
            userShowAllData={userAllShows}
            showsData={showsData}
            seasonData={seasonData}
            mobileLayout={mobileLayout}
            currentUser={currentUser.uid}
            toggleSections={toggleSections}
            watchlistSection={watchlistSection}
          />
          <ProfileFinishedStopped
            calledFrom="finished"
            userShowAllData={userAllShows}
            mobileLayout={mobileLayout}
            showsData={showsData}
            currentUser={currentUser.uid}
            toggleSections={toggleSections}
            finishedSection={finishedSection}
          />

          <ProfileFinishedStopped
            calledFrom="stopped"
            userShowAllData={userAllShows}
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
