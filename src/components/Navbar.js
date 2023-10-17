import React from "react"
import "./Navbar.css"
import logo from "../images/TVTime-logo-white.svg"
import { useAuth } from "../authentication/AuthContext"
import { useNavigate, Link } from "react-router-dom"
import searchImg from "../images/search.png"
import { Icon } from "@iconify/react"

export default function Navbar(props) {
  // const [error, setError] = React.useState("")
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()
  const [searchVisibility, setSearchVisibility] = React.useState(false)
  const [windowWidth, setWindowWidth] = React.useState()
  const [isSmaller, setIsSmaller] = React.useState(false)
  const [isMobile, setIsMobile] = React.useState(false)
  const [showConfirmationLogOut, setShowConfirmationLogOut] =
    React.useState(false)
  const [searchSuggestionsList, setSearchSuggestionsList] = React.useState([])
  const [searchQuery, setSearchQuery] = React.useState("")

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

  const backgroundStyle = {
    background: props.isLoggedIn ? "rgb(12, 13, 13)" : "rgb(12, 13, 13, 0.2)",
  }

  function searchFunction(event) {
    if (event.key === "Enter") {
      const { value } = event.target
      const fixed_value = value.replace(/ /g, "%20")

      localStorage.setItem("currentPage", 1)

      navigate("/discover", {
        state: {
          fetchLink: `https://api.themoviedb.org/3/search/tv?api_key=${process.env.REACT_APP_THEMOVIEDB_API}&language=en-US&query=${fixed_value}&include_adult=false&page=`,
          sectionTitle: "Search Results",
          userId: currentUser.uid,
        },
      })
    }
  }

  window.onresize = function () {
    setWindowWidth(window.innerWidth)
  }

  React.useEffect(() => {
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

  React.useEffect(() => {
    fetch(
      `https://api.themoviedb.org/3/search/multi?api_key=${process.env.REACT_APP_THEMOVIEDB_API}&query=${searchQuery}&include_adult=true&language=en-US&page=1`
    )
      .then((data) => data.json())
      .then((data) => {
        console.log(data.results)
        return setSearchSuggestionsList(data.results)
      })
  }, [searchQuery])

  function selectSuggestionItem(id, type) {
    // console.log(suggestion)
    setSearchSuggestionsList([])

    if (type === "tv") {
      fetch(
        `https://api.themoviedb.org/3/tv/${id}?api_key=${process.env.REACT_APP_THEMOVIEDB_API}&language=en-US&append_to_response=external_ids,videos,aggregate_credits,content_ratings,recommendations,similar,watch/providers,images`
      )
        .then((res) => res.json())
        .then((data) => {
          navigate("/overview", {
            state: {
              data: data,
              userId: currentUser.uid,
            },
          })
        })
    } else {
      navigate("/people", {
        state: {
          userId: currentUser.uid,
          person_id: id,
        },
      })
    }
  }

  // const slicedSuggestionsArray = searchSuggestionsList.slice(0, 15)
  let searchSuggestions = searchSuggestionsList
    .filter((item) => item.media_type === "tv" || item.media_type === "person")
    .map((item) => {
      if (item.media_type === "person") {
        return (
          <p
            className="single-search-suggestion"
            onClick={() => selectSuggestionItem(item.id, item.media_type)}
          >
            <Icon icon="fa6-solid:masks-theater" width={25} />
            {item.name}
          </p>
        )
      } else if (item.media_type === "tv") {
        return (
          <p
            className="single-search-suggestion"
            onClick={() => selectSuggestionItem(item.id, item.media_type)}
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

  const logoSearchStyle = {
    display: isMobile === true && searchVisibility === true ? "none" : "flex",
  }

  return (
    <div style={backgroundStyle} className="navbar-wrapper">
      <Link to="/" style={logoSearchStyle} className="logo-link">
        <img className="logo-img" src={logo} alt="logo" />
      </Link>
      {!props.hideStarting && !props.isLoggedIn && (
        <button className="login-btn" onClick={props.goToLogin}>
          Login
        </button>
      )}
      {props.hideStarting &&
        !props.isLoggedIn &&
        (props.showLogin ? (
          <button className="login-btn" onClick={props.switchToSignUp}>
            Sign up
          </button>
        ) : (
          <button className="login-btn" onClick={props.switchToLogin}>
            Login
          </button>
        ))}

      {props.isLoggedIn && isSmaller === false && (
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

      {props.isLoggedIn && isSmaller === true && searchVisibility === true && (
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

      {props.isLoggedIn && searchVisibility === false && (
        <div className="nav-links">
          {props.isHome !== true && (
            <Link className="nav-btns" to="/">
              Discover
            </Link>
          )}
          {props.isProfile !== true && (
            <Link aria-label="profile" className="nav-btns" to="/profile">
              Profile
            </Link>
          )}
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

          {props.isHome !== true && (
            <Link className="icons-nav-btns" to="/">
              <Icon className="icons-nav-btns" icon="ci:home-fill" />
            </Link>
          )}

          {props.isProfile !== true && (
            <Link aria-label="profile" to="/profile">
              <Icon
                className="icons-nav-btns"
                icon="healthicons:ui-user-profile"
              />
            </Link>
          )}

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
      )}
    </div>
  )
}
