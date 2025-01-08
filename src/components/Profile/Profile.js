import React, { useContext, useEffect, useState } from "react"
import ProfileBanner from "./ProfileBanner/ProfileBanner"
import { LayoutContext } from "../Layout/Layout"
import { Navigate } from "react-router-dom"
import ProfileStatistics from "./ProfileStatistics/ProfileStatistics"
import apiCaller from "../../Api/ApiCaller"
import Loader from "../Other/Loader/Loader"
import ProfileSectionsContainer from "./ProfileSections/ProfileSectionsContainer"
import History from "./ProfileSections/History"
import ProfileCoverSelector from "./ProfileCoverSelector/ProfileCoverSelector"
import def_cover from "../../images/def-cover.jpg"
import "./Profile.css"
import { Alert, useMediaQuery } from "@mui/material"
import { useTheme } from "@emotion/react"

export default function Profile() {
  const { isUserLoggedIn } = useContext(LayoutContext)
  const user_id = localStorage.getItem("user_id")
  const [allUserShows, setAllUserShows] = useState([])
  const [loading, setLoading] = useState(true)
  const [triggerRefresh, setTriggerRefresh] = useState(false)
  const [openHistory, setOpenHistory] = useState(false)
  const [openCoverSelection, setOpenCoverSelection] = useState(false)
  const [disableBannerActions, setDisableBannerActions] = useState(true)
  const [selectedCoverImage, setSelectedCoverImage] = useState(
    localStorage.getItem("userProfileCover")
      ? JSON.parse(localStorage.getItem("userProfileCover"))
      : def_cover
  )

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  const { setOpenSnackbar, setSnackbarMessage, setSnackbarSeverity } =
    useContext(LayoutContext)

  useEffect(() => {
    if (isUserLoggedIn) {
      setLoading(true)
      apiCaller({
        url: `${process.env.REACT_APP_BACKEND_API_URL}/users/${user_id}/all-shows`,
        method: "GET",
        contentType: "application/json",
        body: null,
        calledFrom: "allUserShows",
        isResponseJSON: true,
        extras: null,
      })
        .then((data) => {
          setAllUserShows(data)
          setLoading(false)
        })
        .catch((error) => {
          setSnackbarSeverity("error")
          setSnackbarMessage(error.message)
          setOpenSnackbar(true)
        })
    }
  }, [])

  if (!isUserLoggedIn) {
    return <Navigate to="/" replace />
  }

  if (allUserShows.length === 0 && !loading) {
    return (
      <>
        <ProfileBanner
          setOpenHistory={setOpenHistory}
          setOpenCoverSelection={setOpenCoverSelection}
          disableBannerActions={disableBannerActions}
          openCoverSelection={openCoverSelection}
          selectedCoverImage={selectedCoverImage}
          setSelectedCoverImage={setSelectedCoverImage}
        />

        <ProfileStatistics
          allUserShows={allUserShows}
          triggerRefresh={triggerRefresh}
          setSelectedCoverImage={setSelectedCoverImage}
        />

        <div className="profile-no-shows-alert">
          <Alert
            variant="filled"
            severity="info"
            sx={{
              width: isMobile ? "95%" : "60%",
              display: "flex",
              alignItems: "center",
              fontSize: isMobile ? "0.9rem" : "1.1rem",
            }}
          >
            Welcome to your profile! You have not added any shows yet.{" "}
            {isMobile && (
              <>
                <br />
                <br />
              </>
            )}
            Head over to{" "}
            <a style={{ color: "white" }} href="/">
              HOME
            </a>{" "}
            to find some shows to add to your Watchlist.
          </Alert>
        </div>
      </>
    )
  }

  if (loading) {
    return <Loader />
  }

  return (
    <>
      <ProfileBanner
        setOpenHistory={setOpenHistory}
        setOpenCoverSelection={setOpenCoverSelection}
        disableBannerActions={disableBannerActions}
        openCoverSelection={openCoverSelection}
        selectedCoverImage={selectedCoverImage}
        setSelectedCoverImage={setSelectedCoverImage}
      />

      <ProfileStatistics
        allUserShows={allUserShows}
        triggerRefresh={triggerRefresh}
        setSelectedCoverImage={setSelectedCoverImage}
      />

      <ProfileSectionsContainer
        triggerRefresh={triggerRefresh}
        setTriggerRefresh={setTriggerRefresh}
        setDisableBannerActions={setDisableBannerActions}
      />

      <History
        openHistory={openHistory}
        setOpenHistory={setOpenHistory}
        triggerRefresh={triggerRefresh}
        setTriggerRefresh={setTriggerRefresh}
      />

      <ProfileCoverSelector
        allUserShows={allUserShows}
        openCoverSelection={openCoverSelection}
        setOpenCoverSelection={setOpenCoverSelection}
      />
    </>
  )
}
