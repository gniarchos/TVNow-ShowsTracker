import React, { useState, useEffect } from "react"
import "./Headers.css"
import logo from "../../images/TVTime-logo-white.svg"
import { useAuth } from "../../authentication/AuthContext"
import { useNavigate, Link, NavLink } from "react-router-dom"
import searchImg from "../../images/search.png"
import { Icon } from "@iconify/react"

export default function MainNavbar(props) {
  // const [error, setError] = useState("")
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()
  const [searchVisibility, setSearchVisibility] = useState(false)
  const [windowWidth, setWindowWidth] = useState()
  const [isSmaller, setIsSmaller] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [showConfirmationLogOut, setShowConfirmationLogOut] = useState(false)
  const [searchSuggestionsList, setSearchSuggestionsList] = useState([])
  const [searchQuery, setSearchQuery] = useState("")

  function isUserWantToLogOut() {
    setShowConfirmationLogOut((prevValue) =>
      prevValue === false ? true : null
    )

    if (showConfirmationLogOut === true) {
      handleLogout()
    }
  }

  async function handleLogout() {
    // setError("")

    try {
      await logout()
      navigate("/index")
    } catch {
      // setError("Failed to log out.")
      console.log("Failed to log out.")
    }
  }

  function cancelLoggingOut() {
    setShowConfirmationLogOut(false)
  }

  function searchFunction(event) {
    if (event.key === "Enter") {
      const { value } = event.target
      const fixed_value = value.replace(/ /g, "%20")

      localStorage.setItem("currentPage", 1)

      navigate(
        `/discover?title=Search+Results&type=search&query=${fixed_value}&page=1`
      )

      setSearchVisibility(false)
      setSearchQuery("")
    }
  }

  window.onresize = function () {
    setWindowWidth(window.innerWidth)
  }

  useEffect(() => {
    if (window.innerWidth < 825 && window.innerWidth > 454) {
      setIsSmaller(true)
      setIsMobile(false)
    } else if (window.innerWidth < 454) {
      setIsMobile(true)
      setIsSmaller(true)
    } else {
      setSearchVisibility(false)
      setIsMobile(false)
      setIsSmaller(false)
    }
  }, [window.innerWidth])

  function toggleSearchBox() {
    setSearchVisibility(!searchVisibility)
  }

  useEffect(() => {
    fetch(
      `https://api.themoviedb.org/3/search/multi?api_key=${process.env.REACT_APP_THEMOVIEDB_API}&query=${searchQuery}&include_adult=true&language=en-US&page=1`
    )
      .then((data) => data.json())
      .then((data) => {
        return setSearchSuggestionsList(data.results)
      })
  }, [searchQuery])

  function selectSuggestionItem(name, id, type) {
    setSearchSuggestionsList([])

    if (type === "tv") {
      navigate(`/show?show_name=${name}&show_id=${id}`)
    } else {
      navigate(`/people?person_name=${name}&person_id=${id}`)
    }

    setSearchVisibility(false)
    setSearchQuery("")
  }

  let searchSuggestions = searchSuggestionsList
    .filter((item) => item.media_type === "tv" || item.media_type === "person")
    .map((item) => {
      if (item.media_type === "person") {
        return (
          <p
            className="single-search-suggestion"
            onClick={() =>
              selectSuggestionItem(item.name, item.id, item.media_type)
            }
          >
            <Icon icon="fa6-solid:masks-theater" width={25} />
            {item.name}
          </p>
        )
      } else if (item.media_type === "tv") {
        return (
          <p
            className="single-search-suggestion"
            onClick={() =>
              selectSuggestionItem(item.name, item.id, item.media_type)
            }
          >
            <Icon icon="fluent-emoji-high-contrast:film-frames" width={25} />
            {item.name}
          </p>
        )
      }
    })

  const smallerSearchStyle = {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: "10px",
    marginRight: "40px",
  }

  if (window.matchMedia("(display-mode: standalone)").matches)
    return (
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
            <div style={smallerSearchStyle} className="search-div">
              <Icon
                className="backCloseSearchIcon"
                icon="bi:x"
                width={35}
                onClick={toggleSearchBox}
              />
              <input
                onKeyDown={(e) => searchFunction(e)}
                className="search-input"
                type="text"
                placeholder="Search here..."
                style={{ width: isMobile ? "86vw" : "45vw" }}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <Icon
                className="search-img"
                icon="material-symbols:search"
                width={25}
                color="black"
              />
            </div>

            {searchQuery.length > 3 && (
              <div
                className="suggestionsSearchBox mobile"
                style={{ width: isMobile ? "86vw" : "45vw" }}
              >
                {searchSuggestions}
              </div>
            )}
          </div>
        )}

        {/* Standalone Bottom Navigation - mobile */}
        <div className="standalone-bottom-nav-wrapper">
          <NavLink className="icons-nav-btns" to="/">
            <Icon className="icons-nav-btns" icon="ci:home-fill" />
            Home
          </NavLink>

          <NavLink
            className="icons-nav-btns"
            to="/discover?title=Trending%20Now&type=trending&page=1"
          >
            <Icon
              className="icons-nav-btns"
              icon="streamline:trending-content"
            />
            Discover
          </NavLink>

          <p className="icons-nav-btns">
            <Icon
              onClick={toggleSearchBox}
              className="icons-nav-btns"
              icon="fluent:search-16-filled"
            />
            Search
          </p>

          <NavLink className="icons-nav-btns" to="/profile">
            <Icon
              className="icons-nav-btns"
              icon="healthicons:ui-user-profile"
            />
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
      </div>
    )

  return (
    <div className="navbar-wrapper">
      {searchVisibility === false && (
        <Link to="/" className="logo-link">
          <img className="logo-img" src={logo} alt="logo" />
        </Link>
      )}

      {isSmaller === false && (
        <div className="search-suggestions-wrapper">
          <div className="search-div">
            <input
              onKeyDown={(e) => searchFunction(e)}
              className="search-input"
              type="text"
              placeholder="Search"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <img className="search-img" src={searchImg} alt="search" />
          </div>
          {searchQuery.length > 3 && (
            <div className="suggestionsSearchBox">{searchSuggestions}</div>
          )}
        </div>
      )}

      {isSmaller === true && searchVisibility === true && (
        <div className="search-suggestions-wrapper">
          <div style={smallerSearchStyle} className="search-div">
            <Icon
              className="backCloseSearchIcon"
              icon="bi:arrow-left"
              width={32}
              onClick={toggleSearchBox}
            />
            <input
              onKeyDown={(e) => searchFunction(e)}
              className="search-input"
              type="text"
              placeholder="Search here..."
              style={{ width: isMobile ? "86vw" : "45vw" }}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            <img className="search-img" src={searchImg} alt="search" />
          </div>
          {searchQuery.length > 3 && (
            <div
              className="suggestionsSearchBox mobile"
              style={{ width: isMobile ? "86vw" : "45vw" }}
            >
              {searchSuggestions}
            </div>
          )}
        </div>
      )}

      {searchVisibility === false && (
        <div className="nav-links">
          <NavLink
            className={({ isActive }) =>
              isActive ? "nav-btns hide" : "nav-btns"
            }
            to="/"
          >
            Discover
          </NavLink>

          <NavLink
            aria-label="profile"
            className={({ isActive }) =>
              isActive ? "nav-btns hide" : "nav-btns"
            }
            to="/profile"
          >
            Profile
          </NavLink>

          <button
            className="nav-btns"
            onClick={!showConfirmationLogOut && isUserWantToLogOut}
          >
            Log out
          </button>

          {/* SMALL WINDOWS BUTTONS - MOBILES */}
          <Icon
            onClick={toggleSearchBox}
            className="icons-nav-btns"
            icon="fluent:search-16-filled"
          />

          <NavLink
            className={({ isActive }) =>
              isActive ? "icons-nav-btns hide" : "icons-nav-btns"
            }
            to="/"
          >
            <Icon className="icons-nav-btns" icon="ci:home-fill" />
          </NavLink>

          <NavLink
            className={({ isActive }) =>
              isActive ? "icons-nav-btns hide" : "icons-nav-btns"
            }
            aria-label="profile"
            to="/profile"
          >
            <Icon
              className="icons-nav-btns"
              icon="healthicons:ui-user-profile"
            />
          </NavLink>

          <Icon
            className="icons-nav-btns"
            icon="akar-icons:sign-out"
            onClick={!showConfirmationLogOut && isUserWantToLogOut}
          />

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
                <button
                  onClick={isUserWantToLogOut}
                  className="confirmation-btn"
                >
                  Confirm
                </button>
                <button onClick={cancelLoggingOut} className="confirmation-btn">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
