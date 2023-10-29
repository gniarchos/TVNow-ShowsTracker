import React, { useState, useEffect, createContext, lazy } from "react"
import Navbar from "../Navbar/Navbar"
import "./Profile.css"
import { db } from "../../services/firebase"
import { useLocation } from "react-router-dom"
import { useAuth } from "../../authentication/AuthContext"
import def_cover from "../../images/def-cover.jpg"
import Footer from "../Footer/Footer"
import PuffLoader from "react-spinners/PuffLoader"
import { Icon } from "@iconify/react"
import Modal from "../Other/Modal"
import ScrollToTop from "../Other/ScrollToTop"

export const ProfileContext = createContext()
const WatchNextSection = lazy(() => import("./WatchNextSection"))
const UpToDateSection = lazy(() => import("./UpToDateSection"))
const WatchlistSection = lazy(() => import("./WatchlistSection"))
const FinishedStoppedSections = lazy(() => import("./FinishedStoppedSections"))
const HistorySection = lazy(() => import("./HistorySection"))

export default function Profile() {
  document.title = `TVTime | TV Shows Tracker`

  const [showsData, setShowsData] = useState([])
  const [userShows, setUserShows] = useState([])
  const [seasonData, setSeasonData] = useState([])
  const [finished, setFinished] = useState(false)
  const location = useLocation()
  const { currentUser } = useAuth()
  const [showsImages, setShowsImages] = useState([])
  const [trackedShows, setTrackedShows] = useState(0)
  const [watchingShows, setWatchingShows] = useState(0)
  const [hasFinishedShows, setHasFinishedShows] = useState(0)
  const [notStartedYetShows, setNotStartedYetShows] = useState(0)
  const [readLocalStorage, setReadLocalStorage] = useState(false)
  const [resetSeason, setResetSeason] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isFirstLoad, setIsFirstLoad] = useState(true)
  const [historyData, setHistoryData] = useState([])
  const [userWatchingTime, setUserWatchingTime] = useState(
    localStorage.getItem("watching_time")
      ? localStorage.getItem("watching_time")
      : 0
  )
  const [userWatchedEpisodes, setUserWatchedEpisodes] = useState(
    localStorage.getItem("total_episodes")
      ? localStorage.getItem("total_episodes")
      : 0
  )
  const [isSelectCoverOpen, setIsSelectCoverOpen] = useState(false)
  const [userCoverSettings, setUserCoverSettings] = useState()
  const [hideShowsCoverSelection, setHideShowsCoverSelection] = useState(false)
  const [coverSelectionShowName, setCoverSelectionShowName] =
    useState("Edit your cover")
  const [selectedCoverImage, setSelectedCoverImage] =
    useState(userCoverSettings)
  const [mobileLayout, setMobileLayout] = useState(
    localStorage.getItem("mobileLayoutSelection")
      ? localStorage.getItem("mobileLayoutSelection")
      : "cards"
  )
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
  const [upToDateSettings, setUpToDateSettings] = useState(false)
  const [upToDateFilter, setUpToDateFilter] = useState(
    localStorage.getItem("upToDateFilter")
      ? localStorage.getItem("upToDateFilter")
      : "all"
  )
  const [coverImageSelected, setCoverImageSelected] = useState(false)
  const [showLayoutMessage, setShowLayoutMessage] = useState(false)
  const [cancelled_shows, setCancelled_shows] = useState(new Set())
  const [show_modal, setShow_modal] = useState(false)
  const [userTime, setUserTime] = useState(
    localStorage.getItem("watching_time")
      ? localStorage.getItem("watching_time")
      : userWatchingTime
  )
  const [userEpisodes, setUserEpisodes] = useState(
    localStorage.getItem("total_episodes")
      ? localStorage.getItem("total_episodes")
      : userWatchedEpisodes
  )
  const [watchingStatistic, setWatchingStatistic] = useState([])
  const [loadMoreData, setLoadMoreData] = useState(true)
  const [currentPageHistory, setCurrentPageHistory] = useState(1)
  const [mobile, setMobile] = useState(window.innerWidth <= 499)

  const itemsPerPage = 10

  const contextValues = {
    setShow_modal,
    cancelled_shows,
    setCancelled_shows,
  }

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location])

  const handleWindowSizeChange = () => {
    setMobile(window.innerWidth <= 499)
  }

  useEffect(() => {
    setLoading(true)

    db.collection(`watchlist-${currentUser.uid}`)
      .orderBy("date_watched", "desc")
      .onSnapshot((snapshot) => {
        setUserShows(
          snapshot.docs.map((doc) => ({
            show_id: doc.data().show_id,
            show_name: doc.data().show_name,
            seasonNumber: doc.data().season_number,
            episodeNumber: doc.data().episode_number,
            status: doc.data().status,
            date_watched: doc.data().date_watched,
          }))
        )

        setFinished(!finished)
      })

    window.addEventListener("resize", handleWindowSizeChange)
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange)
    }
  }, [])

  useEffect(() => {
    if (userCoverSettings === "default") {
      setSelectedCoverImage(def_cover)
    } else {
      setSelectedCoverImage(userCoverSettings)
    }
  }, [userCoverSettings])

  useEffect(() => {
    db.collection(`history-${currentUser.uid}`)
      .orderBy("date_watched", "desc")
      .limit(currentPageHistory * itemsPerPage)
      .onSnapshot((snapshot) => {
        setHistoryData(
          snapshot.docs.map((doc) => ({
            show_name: doc.data().show_name,
            show_id: doc.data().show_id,
            season_number: doc.data().season_number,
            episode_number: doc.data().episode_number,
            date_watched: doc.data().date_watched,
            episode_name: doc.data().episode_name,
            show_cover: doc.data().show_cover,
            history_episode_time: doc.data().episode_time,
          }))
        )
      })
  }, [finished, loadMoreData])

  useEffect(() => {
    Promise.all([
      db.collection("users").doc(currentUser.uid).get(),
      db.collection(`watchlist-${currentUser.uid}`).get(),
      db
        .collection(`watchlist-${currentUser.uid}`)
        .where("status", "==", "watching")
        .get(),
      db
        .collection(`watchlist-${currentUser.uid}`)
        .where("status", "==", "finished")
        .get(),
      db
        .collection(`watchlist-${currentUser.uid}`)
        .where("status", "==", "not_started")
        .get(),
    ])
      .then(
        ([
          userInfo,
          watchlistSnapshot,
          watchingSnapshot,
          finishedSnapshot,
          notStartedSnapshot,
        ]) => {
          const userDocInfo = userInfo.data()
          setUserCoverSettings(userDocInfo.profile_cover_selection)
          setUserWatchingTime(userDocInfo.watching_time)
          setUserWatchedEpisodes(userDocInfo.total_episodes)
          setTrackedShows(watchlistSnapshot.size)
          setWatchingShows(watchingSnapshot.size)
          setHasFinishedShows(finishedSnapshot.size)
          setNotStartedYetShows(notStartedSnapshot.size)

          const fetchPromises = userShows.map(async (userShows) => {
            const [showRes, seasonRes] = await Promise.all([
              fetch(
                `https://api.themoviedb.org/3/tv/${userShows.show_id}?api_key=${process.env.REACT_APP_THEMOVIEDB_API}&language=en-US&include_image_language=en,null&append_to_response=external_ids,videos,aggregate_credits,content_ratings,recommendations,similar,watch/providers,images`
              ),
              fetch(
                `https://api.themoviedb.org/3/tv/${userShows.show_id}/season/${userShows.seasonNumber}?api_key=${process.env.REACT_APP_THEMOVIEDB_API}&language=en-US`
              ),
            ])
            const [showData, seasonData] = await Promise.all([
              showRes.json(),
              seasonRes.json(),
            ])
            setShowsData((prevData) => [...prevData, showData])
            seasonData.success !== false &&
              setSeasonData((prevData) => [
                ...prevData,
                {
                  ...seasonData.episodes,
                  show_id: userShows.show_id,
                  seasonTotalEpisodes: seasonData.episodes.length,
                },
              ])
          })

          localStorage.setItem("total_episodes", userWatchedEpisodes)
          localStorage.setItem("watching_time", userWatchingTime)

          triggerLoadDataLocalStorage()

          return Promise.all(fetchPromises)
        }
      )
      .finally(() => {
        setLoading(false)
      })
  }, [finished])

  async function fetchShowImages(show_id, show_name) {
    await fetch(
      `https://api.themoviedb.org/3/tv/${show_id}?api_key=${process.env.REACT_APP_THEMOVIEDB_API}&language=en-US&include_image_language=en,null&append_to_response=images`
    )
      .then((res) => res.json())
      .then((data) => {
        setShowsImages((prevImages) => {
          return [...prevImages, data.images.backdrops]
        })
      })

    setHideShowsCoverSelection(true)
    setCoverSelectionShowName(show_name)
  }

  function updateCoverDefault() {
    setSelectedCoverImage(def_cover)
    setIsSelectCoverOpen(false)

    db.collection("users").doc(currentUser.uid).update({
      profile_cover_selection: def_cover,
    })
  }

  function goBackToSelectionCovers() {
    setHideShowsCoverSelection(false)
    setShowsImages([])
    setCoverSelectionShowName("Edit your cover")
  }

  function updateCoverImage() {
    db.collection("users")
      .doc(currentUser.uid)
      .update({
        profile_cover_selection:
          localStorage.getItem("cover_temp_selection") !== null
            ? localStorage.getItem("cover_temp_selection")
            : selectedCoverImage,
      })

    setSelectedCoverImage(
      localStorage.getItem("cover_temp_selection") !== null
        ? localStorage.getItem("cover_temp_selection")
        : selectedCoverImage
    )

    setCoverImageSelected(false)
  }

  function closeCoverSelector() {
    setCoverImageSelected(false)
    setIsSelectCoverOpen(false)
  }

  useEffect(() => {
    if (!isFirstLoad) {
      window.location.reload()
    } else {
      setIsFirstLoad(false)
    }
  }, [resetSeason])

  function triggerLoadDataLocalStorage() {
    setReadLocalStorage(!readLocalStorage)
  }

  function resetSeasonData(id) {
    setResetSeason(!resetSeason)
  }

  function toggleUpToDateSettings() {
    setUpToDateSettings(!upToDateSettings)
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

  function handleFilterUpToDate(event) {
    const { id } = event.target

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

  useEffect(() => {
    setUserTime(
      localStorage.getItem("watching_time")
        ? localStorage.getItem("watching_time")
        : userWatchingTime
    )

    setUserEpisodes(
      localStorage.getItem("total_episodes")
        ? localStorage.getItem("total_episodes")
        : userWatchedEpisodes
    )

    let minutes = userTime
    const months = Math.floor(minutes / (30 * 24 * 60))

    const days = Math.floor((minutes % (30 * 24 * 60)) / (24 * 60))

    const hours = Math.floor((minutes % (24 * 60)) / 60)

    setWatchingStatistic([months, days, hours])
  }, [readLocalStorage, userWatchingTime, userTime, historyData])

  function temporarySaveCoverSelection(image) {
    const fixed_image = image.replace("w500", "original")
    localStorage.setItem("cover_temp_selection", fixed_image)
    setCoverImageSelected(true)
  }

  function handleCoverSelector() {
    setIsSelectCoverOpen(!isSelectCoverOpen)
  }

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

  function closeModal() {
    setShow_modal(false)
  }

  function jumpToRelevantDiv(id) {
    const relevantDiv = document.getElementById(id)
    relevantDiv.scrollIntoView({ behavior: "smooth" })
  }

  function loadMore() {
    setCurrentPageHistory((prevPage) => prevPage + 1)
    setLoadMoreData(!loadMoreData)
  }

  return (
    <div>
      <Navbar isLoggedIn={true} isProfile={true} />
      <ScrollToTop />

      <Modal
        cancelled_shows={cancelled_shows}
        state={show_modal}
        closeModal={closeModal}
      />

      <div className="profile-cover-div">
        <img className="profile-cover" src={selectedCoverImage} />

        <button
          onClick={handleCoverSelector}
          type="button"
          className="btn-change-cover"
        >
          <Icon icon="ant-design:camera-filled" />
          Edit Cover
        </button>

        <button
          onClick={changeLayoutMobile}
          type="button"
          className="btn-change-layout"
        >
          <Icon icon="teenyicons:list-layout-solid" />
          Layout
        </button>

        <div className="user-details-container">
          <div className="details-account">
            <div className="section-1">
              <div className="statistic-numbers">
                <h3 className="stat-title">Total Shows </h3>
                <p
                  className={
                    trackedShows.toString().length > 3 && mobile
                      ? "stat-num longNumber"
                      : "stat-num"
                  }
                >
                  {trackedShows}
                </p>
              </div>

              <div className="statistic-numbers">
                <h3
                  className="stat-title clickable"
                  onClick={() => jumpToRelevantDiv("watching")}
                >
                  Watching
                </h3>
                <p className="stat-num">{watchingShows}</p>
              </div>
            </div>

            <div className="section-2">
              <div className="statistic-numbers">
                <h3
                  className="stat-title clickable"
                  onClick={() => jumpToRelevantDiv("not_started")}
                >
                  Not Started{" "}
                </h3>
                <p
                  className={
                    notStartedYetShows.toString().length > 3 && mobile
                      ? "stat-num longNumber"
                      : "stat-num"
                  }
                >
                  {notStartedYetShows}
                </p>
              </div>

              <div className="statistic-numbers">
                <h3
                  className="stat-title clickable"
                  onClick={() => jumpToRelevantDiv("finished")}
                >
                  Finished
                </h3>
                <p className="stat-num">{hasFinishedShows}</p>
              </div>
            </div>
          </div>

          <div className="user-div-container">
            <img
              className="user-img"
              src="https://media.giphy.com/media/idwAvpAQKlX7ARsoWC/giphy.gif"
            />
          </div>
        </div>
      </div>

      <div className="statistics-info-container">
        <div className="top-info-div-profile">
          <div className="info-div-profile">
            <h1 className="stats-title">Your TV Time</h1>
            <div className="tvtime-container">
              <div className="tvtime-stats">
                <p className="stats-number">{watchingStatistic[0]}</p>
                <p className="stats-subtitle">
                  {watchingStatistic[0] === 1 ? "MONTH" : "MONTHS"}
                </p>
              </div>
              <div className="tvtime-stats">
                <p className="stats-number">{watchingStatistic[1]}</p>
                <p className="stats-subtitle">
                  {watchingStatistic[1] === 1 ? "DAY" : "DAYS"}
                </p>
              </div>
              <div className="tvtime-stats">
                <p className="stats-number">{watchingStatistic[2]}</p>
                <p className="stats-subtitle">
                  {watchingStatistic[2] === 1 ? "HOUR" : "HOURS"}
                </p>
              </div>
            </div>
          </div>

          <div className="info-div-profile">
            <h1 className="stats-title">Episodes Watched</h1>
            <p className="stats-number">{userEpisodes}</p>
          </div>
        </div>
      </div>

      {loading === true && userShows.length === 0 ? (
        <div className="spinner-div">
          <PuffLoader color={"white"} size={100} />
          <h3>Reloading Data...</h3>
        </div>
      ) : (
        <div>
          <div className="profile-wrapper">
            <WatchNextSection
              seasonData={seasonData}
              showsData={showsData}
              userShowData={userShows}
              mobileLayout={mobileLayout}
              currentUser={currentUser.uid}
              triggerLoadDataLocalStorage={triggerLoadDataLocalStorage}
              resetSeasonData={resetSeasonData}
              watchNextSection={watchNextSection}
              toggleSections={toggleSections}
            />

            <ProfileContext.Provider value={contextValues}>
              <UpToDateSection
                seasonData={seasonData}
                showsData={showsData}
                userShowData={userShows}
                mobileLayout={mobileLayout}
                currentUser={currentUser.uid}
                triggerLoadDataLocalStorage={triggerLoadDataLocalStorage}
                resetSeasonData={resetSeasonData}
                upToDateSection={upToDateSection}
                toggleSections={toggleSections}
                toggleUpToDateSettings={toggleUpToDateSettings}
                upToDateFilter={upToDateFilter}
                upToDateSettings={upToDateSettings}
                handleFilterUpToDate={handleFilterUpToDate}
              />
            </ProfileContext.Provider>

            <WatchlistSection
              seasonData={seasonData}
              showsData={showsData}
              userShowData={userShows}
              mobileLayout={mobileLayout}
              currentUser={currentUser.uid}
              triggerLoadDataLocalStorage={triggerLoadDataLocalStorage}
              resetSeasonData={resetSeasonData}
              watchlistSection={watchlistSection}
              toggleSections={toggleSections}
            />

            <FinishedStoppedSections
              calledFrom="finished"
              showsData={showsData}
              userShowData={userShows}
              mobileLayout={mobileLayout}
              currentUser={currentUser.uid}
              triggerLoadDataLocalStorage={triggerLoadDataLocalStorage}
              resetSeasonData={resetSeasonData}
              finishedSection={finishedSection}
              toggleSections={toggleSections}
            />

            <FinishedStoppedSections
              calledFrom="stopped"
              showsData={showsData}
              userShowData={userShows}
              mobileLayout={mobileLayout}
              currentUser={currentUser.uid}
              triggerLoadDataLocalStorage={triggerLoadDataLocalStorage}
              resetSeasonData={resetSeasonData}
              stoppedSection={stoppedSection}
              toggleSections={toggleSections}
            />

            <HistorySection
              historyData={historyData}
              currentUser={currentUser.uid}
              resetSeasonData={resetSeasonData}
              historySection={historySection}
              toggleSections={toggleSections}
              loadMore={loadMore}
            />
          </div>
        </div>
      )}

      <div
        className={
          isSelectCoverOpen
            ? "coverSelection_container isShown"
            : "coverSelection_container"
        }
      >
        <div
          className={
            isSelectCoverOpen
              ? "coverSelector-wrapper showSelector"
              : "coverSelector-wrapper"
          }
        >
          <div className="coverTitle_div">
            {hideShowsCoverSelection === true && (
              <Icon
                icon="mingcute:arrow-left-fill"
                width={30}
                onClick={goBackToSelectionCovers}
                className="covers_back_icon"
              />
            )}
            <h1
              className={
                coverImageSelected && mobile
                  ? "coverSection-title selectedImage"
                  : "coverSection-title"
              }
            >
              {coverSelectionShowName}
            </h1>
            {coverImageSelected === true && (
              <p className="btn-save-changes-cover" onClick={updateCoverImage}>
                <Icon icon="dashicons:cloud-saved" width={20} /> Save Changes
              </p>
            )}
          </div>

          {hideShowsCoverSelection === false && (
            <h3
              className="showCoverName defaultSelection"
              onClick={updateCoverDefault}
            >
              <Icon icon="fluent-emoji-high-contrast:popcorn" width={45} />
              TVTime Default Cover
            </h3>
          )}
          {hideShowsCoverSelection === false &&
            userShows.map((show, index) => {
              return (
                <div key={index}>
                  <h3
                    className="showCoverName"
                    onClick={() =>
                      fetchShowImages(show.show_id, show.show_name)
                    }
                  >
                    <Icon
                      icon="ic:baseline-local-movies"
                      className="movie-icon"
                    />
                    {show.show_name}
                  </h3>
                </div>
              )
            })}

          {hideShowsCoverSelection === true && (
            <div className="showsAllCoverPhotos">
              {showsImages.map((img) => {
                return img
                  .filter((img) => img.height >= 720)
                  .map((image) => {
                    return (
                      <img
                        className="cover-img-preview"
                        src={`https://image.tmdb.org/t/p/w500/${image.file_path}`}
                        alt="shows-images"
                        onClick={() =>
                          temporarySaveCoverSelection(
                            `https://image.tmdb.org/t/p/w500/${image.file_path}`
                          )
                        }
                      />
                    )
                  })
              })}
            </div>
          )}
        </div>

        <div
          className={
            isSelectCoverOpen
              ? "closeButton_covers_div showBtn"
              : "closeButton_covers_div"
          }
        >
          <button className="closeButton_covers" onClick={closeCoverSelector}>
            X
          </button>
        </div>
      </div>

      <div className={showLayoutMessage === false ? "popup" : "popup show"}>
        <p className="message-popup">Layout set to {mobileLayout}</p>
      </div>
      <Footer />
    </div>
  )
}
