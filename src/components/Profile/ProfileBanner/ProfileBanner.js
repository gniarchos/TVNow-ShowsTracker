import React, { useContext, useEffect, useState } from "react"
import def_cover from "../../../images/def-cover.jpg"
import "./ProfileBanner.css"
import { Button, useMediaQuery } from "@mui/material"
import { useTheme } from "@emotion/react"
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded"
import AutoFixHighRoundedIcon from "@mui/icons-material/AutoFixHighRounded"
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded"
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded"
import { useNavigate } from "react-router-dom"
import { LayoutContext } from "../../Layout/Layout"

export default function ProfileBanner({
  setOpenHistory,
  setOpenCoverSelection,
  disableBannerActions,
  openCoverSelection,
  selectedCoverImage,
  setSelectedCoverImage,
}) {
  const isDefaultCover =
    localStorage.getItem("userProfileCover") === null ? true : false

  const username = localStorage.getItem("username")
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  const [loading, setLoading] = useState(true)

  const navigate = useNavigate()
  const { setOpenSnackbar, setSnackbarMessage, setSnackbarSeverity } =
    useContext(LayoutContext)

  useEffect(() => {
    if (!openCoverSelection) {
      setSelectedCoverImage(
        localStorage.getItem("userProfileCover")
          ? JSON.parse(localStorage.getItem("userProfileCover"))
          : def_cover
      )
    }
  }, [openCoverSelection])

  function handleImageLoad() {
    setLoading(false)
  }

  function handleLogout() {
    localStorage.clear()

    setOpenSnackbar(true)
    setSnackbarSeverity("success")
    setSnackbarMessage("Logged out successfully!")

    navigate(`/`)
  }

  return (
    <div className="profile-banner-wrapper">
      {/* {isDefaultCover && <div className="profile-banner-color-overlay"></div>} */}
      {loading && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "black",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        ></div>
      )}
      {isDefaultCover ? (
        <img
          className="profile-banner-img"
          src={selectedCoverImage}
          alt="default"
          onLoad={handleImageLoad}
        />
      ) : (
        <img
          onLoad={handleImageLoad}
          className="profile-banner-img custom"
          src={`https://image.tmdb.org/t/p/original${selectedCoverImage}`}
          alt="cover"
          style={{ display: loading ? "none" : "block" }}
        />
      )}

      <div className="profile-banner-container">
        <div className="profile-banner-user-img-container">
          <img
            className="profile-banner-user-img"
            src="https://media.giphy.com/media/idwAvpAQKlX7ARsoWC/giphy.gif"
            onClick={() => setSelectedCoverImage(def_cover)}
          />
        </div>

        <span className="profile-banner-username">{username}</span>

        <div className="profile-banner-btn-container">
          <Button
            size={isMobile ? "xsmall" : "medium"}
            variant="contained"
            color="primaryFaded"
            onClick={() => setOpenHistory(true)}
            disabled={disableBannerActions}
          >
            <HistoryRoundedIcon fontSize="small" />
          </Button>
          <Button
            size={isMobile ? "xsmall" : "medium"}
            variant="contained"
            color="primaryFaded"
            onClick={() => setOpenCoverSelection(true)}
            disabled={disableBannerActions}
          >
            <AutoFixHighRoundedIcon fontSize="small" />
          </Button>
          <Button
            size={isMobile ? "xsmall" : "medium"}
            variant="contained"
            color="primaryFaded"
            disabled={disableBannerActions}
            onClick={handleLogout}
          >
            <LogoutRoundedIcon fontSize="small" />
          </Button>
        </div>
      </div>
    </div>
  )
}
