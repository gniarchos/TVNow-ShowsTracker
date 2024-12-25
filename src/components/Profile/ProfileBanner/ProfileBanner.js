import React, { useState } from "react"
import def_cover from "../../../images/def-cover.jpg"
import "./ProfileBanner.css"
import { Button, useMediaQuery } from "@mui/material"
import { useTheme } from "@emotion/react"
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded"
import AutoFixHighRoundedIcon from "@mui/icons-material/AutoFixHighRounded"

export default function ProfileBanner({ setOpenHistory }) {
  const [selectedCoverImage, setSelectedCoverImage] = useState(def_cover)
  const username = localStorage.getItem("username")
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  return (
    <div className="profile-banner-wrapper">
      <div className="profile-banner-color-overlay"></div>
      <img className="profile-banner-img" src={selectedCoverImage} />

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
          >
            <HistoryRoundedIcon fontSize="small" />
          </Button>
          <Button
            size={isMobile ? "xsmall" : "medium"}
            variant="contained"
            color="primaryFaded"
          >
            <AutoFixHighRoundedIcon fontSize="small" />
          </Button>
        </div>
      </div>
    </div>
  )
}
