import React, { useState, useEffect } from "react"
import "./Headers.css"
import logo from "../../images/TVTime-logo-white.svg"
import { useAuth } from "../../authentication/AuthContext"
import { useNavigate, Link, NavLink } from "react-router-dom"
import searchImg from "../../images/search.png"
import { Icon } from "@iconify/react"
import HomeRoundedIcon from "@mui/icons-material/HomeRounded"
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded"
import KeyboardBackspaceRoundedIcon from "@mui/icons-material/KeyboardBackspaceRounded"
import PWAHeaders from "./PWAHeaders"
import SearchRoundedIcon from "@mui/icons-material/SearchRounded"
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded"

export default function MainNavbar(props) {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [searchVisibility, setSearchVisibility] = useState(false)
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
    try {
      await logout()
      navigate("/index")
    } catch {
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

  if (window.matchMedia("(display-mode: standalone)").matches)
    return (
      <PWAHeaders
        searchVisibility={searchVisibility}
        toggleSearchBox={toggleSearchBox}
        searchFunction={searchFunction}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        showConfirmationLogOut={showConfirmationLogOut}
        isUserWantToLogOut={isUserWantToLogOut}
        searchSuggestions={searchSuggestions}
        cancelLoggingOut={cancelLoggingOut}
      />
    )

  if (searchVisibility) {
    return (
      <div className="navbar-wrapper">
        <div className="search-suggestions-wrapper">
          <div
            className={
              searchVisibility === true ? "search-div smaller" : "search-div"
            }
          >
            <KeyboardBackspaceRoundedIcon
              style={{ cursor: "pointer" }}
              fontSize="medium"
              onClick={toggleSearchBox}
            />

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
      </div>
    )
  }

  return (
    <div className="navbar-wrapper">
      <Link to="/" className="logo-link">
        <img className="logo-img" src={logo} alt="logo" />
      </Link>

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
      </div>

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
          Logout
        </button>

        {/* FOR SMALLER WINDOWS SIZES & MOBILES */}
        <div className="icons-nav-btns">
          <SearchRoundedIcon onClick={toggleSearchBox} sx={{ fontSize: 25 }} />
        </div>

        <NavLink
          className={({ isActive }) =>
            isActive ? "icons-nav-btns hide" : "icons-nav-btns"
          }
          to="/"
        >
          <HomeRoundedIcon sx={{ fontSize: 25 }} />
        </NavLink>

        <NavLink
          className={({ isActive }) =>
            isActive ? "icons-nav-btns hide" : "icons-nav-btns"
          }
          aria-label="profile"
          to="/profile"
        >
          <AccountCircleRoundedIcon sx={{ fontSize: 25 }} />
        </NavLink>

        <div className="icons-nav-btns">
          <LogoutRoundedIcon
            sx={{ fontSize: 25 }}
            onClick={!showConfirmationLogOut && isUserWantToLogOut}
          />
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
    </div>
  )
}
