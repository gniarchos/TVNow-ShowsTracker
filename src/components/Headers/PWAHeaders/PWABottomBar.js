import React from "react"
import { NavLink, useLocation } from "react-router-dom"
import HomeRoundedIcon from "@mui/icons-material/HomeRounded"
import WhatshotRoundedIcon from "@mui/icons-material/WhatshotRounded"
import SearchRoundedIcon from "@mui/icons-material/SearchRounded"
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded"
import KeyboardBackspaceRoundedIcon from "@mui/icons-material/KeyboardBackspaceRounded"
// import "./Headers.css"
import "./PWABottomBar.css"

export default function PWABottomBar() {
  const location = useLocation()
  return (
    <div className="standalone-bottom-nav-wrapper">
      <NavLink
        style={({ isActive }) => ({
          color: isActive && "white",
        })}
        className="icons-nav-btns"
        to="/"
      >
        <HomeRoundedIcon sx={{ fontSize: 25 }} />
        Home
      </NavLink>

      <NavLink
        to="/discover?title=Trending%20Now&type=trending&page=1"
        style={({ isActive }) => ({
          color:
            isActive ||
            (location.pathname !== "/profile" &&
              location.pathname !== "/" &&
              "white"),
        })}
        className="icons-nav-btns"
      >
        <WhatshotRoundedIcon sx={{ fontSize: 25 }} /> Discover
      </NavLink>

      {/* <p className="icons-nav-btns search">
        <SearchRoundedIcon sx={{ fontSize: 25 }} onClick={toggleSearchBox} />
        Search
      </p> */}

      <NavLink
        style={({ isActive }) => ({
          color: isActive && "white",
        })}
        className="icons-nav-btns"
        to="/profile"
      >
        <AccountCircleRoundedIcon sx={{ fontSize: 25 }} />
        Profile
      </NavLink>
    </div>
  )
}
