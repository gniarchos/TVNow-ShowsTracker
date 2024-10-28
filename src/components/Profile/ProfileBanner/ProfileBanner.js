import React, { useState } from "react"
import def_cover from "../../../images/def-cover.jpg"
import userImg from "../../../images/user_img.png"
import "./ProfileBanner.css"

export default function ProfileBanner() {
  const [selectedCoverImage, setSelectedCoverImage] = useState(def_cover)
  const username = localStorage.getItem("username")
  return (
    <div className="profile-banner-wrapper">
      <div class="profile-banner-color-overlay"></div>
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
      </div>
    </div>
  )
}
