import { useState, createContext } from "react"
import "./ProfileCover.css"
import { Icon } from "@iconify/react"
import { useEffect } from "react"
import { db } from "../../services/firebase"
import def_cover from "../../images/def-cover.jpg"
import ProfileCoverSelection from "./ProfileCoverSelection"

export const CoverContext = createContext()

export default function ProfileCover(props) {
  const [userCoverSettings, setUserCoverSettings] = useState()
  const [selectedCoverImage, setSelectedCoverImage] =
    useState(userCoverSettings)
  const [trackedShowsNumber, setTrackedShowsNumber] = useState(0)
  const [watchingShowsNumber, setWatchingShowsNumber] = useState(0)
  const [hasFinishedShowsNumber, setHasFinishedShowsNumber] = useState(0)
  const [notStartedYetShowsNumber, setNotStartedYetShowsNumber] = useState(0)
  const mobile = window.innerWidth <= 499
  const [isSelectCoverOpen, setIsSelectCoverOpen] = useState(false)

  const contextValues = {
    isSelectCoverOpen,
    setIsSelectCoverOpen,
    selectedCoverImage,
    setSelectedCoverImage,
  }

  useEffect(() => {
    const getUserCoverImage = async () => {
      return await db
        .collection("users")
        .doc(props.currentUser)
        .get()
        .then((doc) => {
          setUserCoverSettings(doc.data().profile_cover_selection)
        })
    }

    const getUserTrackedShowsNumber = async () => {
      return await db
        .collection(`watchlist-${props.currentUser}`)
        .get()
        .then((querySnapshot) => {
          setTrackedShowsNumber(querySnapshot.size)
        })
    }

    const getUserWatchingShowsNumber = async () => {
      return await db
        .collection(`watchlist-${props.currentUser}`)
        .where("status", "==", "watching")
        .get()
        .then((querySnapshot) => {
          setWatchingShowsNumber(querySnapshot.size)
        })
    }

    const getUserFinishedShowsNumber = async () => {
      return await db
        .collection(`watchlist-${props.currentUser}`)
        .where("status", "==", "finished")
        .get()
        .then((querySnapshot) => {
          setHasFinishedShowsNumber(querySnapshot.size)
        })
    }

    const getUserNotStartedYetShowsNumber = async () => {
      return await db
        .collection(`watchlist-${props.currentUser}`)
        .where("status", "==", "not_started")
        .get()
        .then((querySnapshot) => {
          setNotStartedYetShowsNumber(querySnapshot.size)
        })
    }

    Promise.all([
      getUserCoverImage(),
      getUserTrackedShowsNumber(),
      getUserWatchingShowsNumber(),
      getUserFinishedShowsNumber(),
      getUserNotStartedYetShowsNumber(),
    ]).catch((error) => {
      console.error("Error fetching data:", error)
    })
  }, [])

  useEffect(() => {
    if (userCoverSettings === "default") {
      setSelectedCoverImage(def_cover)
    } else {
      setSelectedCoverImage(userCoverSettings)
    }
  }, [userCoverSettings])

  function handleCoverSelector() {
    setIsSelectCoverOpen(!isSelectCoverOpen)
  }

  function jumpToRelevantDiv(id) {
    const relevantDiv = document.getElementById(id)
    relevantDiv.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="profile-cover-div">
      <img className="profile-cover" src={selectedCoverImage} />

      <button
        onClick={handleCoverSelector}
        type="button"
        className="btn-change-cover"
      >
        <Icon icon="ant-design:camera-filled" width={15} />
        Edit Cover
      </button>

      <button
        onClick={props.changeLayoutMobile}
        type="button"
        className="btn-change-layout"
      >
        <Icon icon="teenyicons:list-layout-solid" width={15} />
        Layout
      </button>

      <div className="user-details-container">
        <div className="details-account">
          <div className="details-account-sections">
            <div className="statistic-numbers left">
              <h3 className="stat-title">Total Shows </h3>
              <p
                className={
                  trackedShowsNumber.toString().length > 3 && mobile
                    ? "stat-num longNumber"
                    : "stat-num"
                }
              >
                {trackedShowsNumber}
              </p>
            </div>

            <div className="statistic-numbers">
              <h3
                className="stat-title"
                onClick={() => jumpToRelevantDiv("watching")}
              >
                Watching
              </h3>
              <p className="stat-num">{watchingShowsNumber}</p>
            </div>
          </div>

          <div className="user-div-container">
            <img
              className="user-img"
              src="https://media.giphy.com/media/idwAvpAQKlX7ARsoWC/giphy.gif"
            />
          </div>

          <div className="details-account-sections">
            <div className="statistic-numbers">
              <h3
                className="stat-title"
                onClick={() => jumpToRelevantDiv("watchlist")}
              >
                Not Started
              </h3>
              <p className="stat-num right">{notStartedYetShowsNumber}</p>
            </div>

            <div className="statistic-numbers">
              <h3
                className="stat-title"
                onClick={() => jumpToRelevantDiv("finished")}
              >
                Finished
              </h3>
              <p className="stat-num">{hasFinishedShowsNumber}</p>
            </div>
          </div>
        </div>
      </div>
      <CoverContext.Provider value={contextValues}>
        <ProfileCoverSelection
          mobile={mobile}
          currentUser={props.currentUser}
          userShowAllData={props.userShowAllData}
          userCoverSettings={userCoverSettings}
        />
      </CoverContext.Provider>
    </div>
  )
}
