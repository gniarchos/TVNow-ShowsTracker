import React from "react"
import { Link, NavLink, useLocation } from "react-router-dom"
import WhatshotRoundedIcon from "@mui/icons-material/WhatshotRounded"
import SearchRoundedIcon from "@mui/icons-material/SearchRounded"
import { Icon } from "@iconify/react"
import logo from "../../images/TVTime-logo-white.svg"
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded"
import KeyboardBackspaceRoundedIcon from "@mui/icons-material/KeyboardBackspaceRounded"
import HomeRoundedIcon from "@mui/icons-material/HomeRounded"
import searchImg from "../../images/search.png"

export default function PWAHeaders({
  searchVisibility,
  toggleSearchBox,
  searchFunction,
  searchQuery,
  setSearchQuery,
  showConfirmationLogOut,
  isUserWantToLogOut,
  searchSuggestions,
  cancelLoggingOut,
}) {
  const location = useLocation()
  return (
    <>
      <div className="navbar-wrapper">
        {searchVisibility === false && (
          <Link to="/" className="logo-link">
            <img className="logo-img" src={logo} alt="logo" />
          </Link>
        )}
        {searchVisibility === false && (
          <Icon
            className="icons-nav-btns sign-out"
            icon="akar-icons:sign-out"
            onClick={!showConfirmationLogOut && isUserWantToLogOut}
          />
        )}
        {searchVisibility === true && (
          <div className="search-suggestions-wrapper">
            <div
              className={
                searchVisibility === true ? "search-div smaller" : "search-div"
              }
            >
              <KeyboardBackspaceRoundedIcon onClick={toggleSearchBox} />
              <input
                onKeyDown={(e) => searchFunction(e)}
                className="search-input"
                type="text"
                placeholder="Search here..."
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <img className="search-img" src={searchImg} alt="search" />
            </div>

            {searchQuery.length > 3 && (
              <div
                className={
                  searchVisibility === true
                    ? "suggestionsSearchBox mobile"
                    : "suggestionsSearchBox"
                }
              >
                {searchSuggestions}
              </div>
            )}
          </div>
        )}
      </div>

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

        <p className="icons-nav-btns search">
          <SearchRoundedIcon sx={{ fontSize: 25 }} onClick={toggleSearchBox} />
          Search
        </p>

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

      <div
        className={
          showConfirmationLogOut
            ? "confirmation-wrapper isActive"
            : "confirmation-wrapper"
        }
      >
        <div
          className={
            showConfirmationLogOut
              ? "confirmation-container isActive"
              : "confirmation-container"
          }
        >
          <p className="confirm-msg">Are you sure you want to log out?</p>
          <div className="confirmation-btns-container">
            <button onClick={isUserWantToLogOut} className="confirmation-btn">
              Confirm
            </button>
            <button onClick={cancelLoggingOut} className="confirmation-btn">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
