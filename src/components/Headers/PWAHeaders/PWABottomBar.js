import React, { useContext } from "react"
import { NavLink, useLocation } from "react-router-dom"
import HomeRoundedIcon from "@mui/icons-material/HomeRounded"
import WhatshotRoundedIcon from "@mui/icons-material/WhatshotRounded"
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded"
import "./PWABottomBar.css"
import { LayoutContext } from "../../Layout/Layout"

export default function PWABottomBar() {
  const location = useLocation()
  const { isUserLoggedIn } = useContext(LayoutContext)
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

      <NavLink
        style={({ isActive }) => ({
          color: isActive && "white",
        })}
        className="icons-nav-btns"
        to="/profile"
        onClick={(e) => {
          if (!isUserLoggedIn) {
            e.preventDefault()
            alert(
              "You don't have access to this page.\nLogin to view your profile!"
            )
          }
        }}
      >
        <AccountCircleRoundedIcon sx={{ fontSize: 25 }} />
        Profile
      </NavLink>
    </div>
  )
}
