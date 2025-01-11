import React, { useContext, useEffect, useState } from "react"
import "./Navbar.css"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { LayoutContext } from "../Layout/Layout"
import {
  Autocomplete,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  useMediaQuery,
} from "@mui/material"
import SearchRoundedIcon from "@mui/icons-material/SearchRounded"
import apiCaller from "../../Api/ApiCaller"
import LiveTvRoundedIcon from "@mui/icons-material/LiveTvRounded"
import TheaterComedyRoundedIcon from "@mui/icons-material/TheaterComedyRounded"
import PWABottomBar from "./PWAHeaders/PWABottomBar"
import SearchBarMobile from "./SearchBarMobile/SearchBarMobile"
import Authentication from "../../Authentication/Authentication"
import { useTheme } from "@emotion/react"
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded"
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded"
import { BiSolidTv } from "react-icons/bi"
import { BiSolidCameraMovie } from "react-icons/bi"
import { BiCameraMovie } from "react-icons/bi"

export default function Navbar() {
  const [searchSuggestionsList, setSearchSuggestionsList] = useState([])
  const [searchValue, setSearchValue] = useState("")
  const navigate = useNavigate()
  const [showSearchBarMobile, setShowSearchBarMobile] = useState(false)
  const [openAuth, setOpenAuth] = useState(false)

  const {
    setOpenSnackbar,
    setSnackbarMessage,
    setSnackbarSeverity,
    isUserLoggedIn,
    isWebView,
    showsORmovies,
    setShowsORmovies,
  } = useContext(LayoutContext)

  const theme = useTheme()
  const isMobileApp = window.matchMedia("(display-mode: standalone)").matches
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"))

  useEffect(() => {
    apiCaller({
      url: `${process.env.REACT_APP_THEMOVIEDB_URL}/search/multi?api_key=${process.env.REACT_APP_THEMOVIEDB_API}&query=${searchValue}&include_adult=true&language=en-US&page=1`,
      method: "GET",
      contentType: "application/json",
      body: null,
      calledFrom: "search",
      isResponseJSON: true,
      extras: null,
    })
      .then((data) => {
        return setSearchSuggestionsList(data.results)
      })
      .catch((error) => {
        setOpenSnackbar(true)
        setSnackbarSeverity("error")
        setSnackbarMessage(error.message)
      })
  }, [searchValue])

  function handleCloseAuth() {
    setOpenAuth(false)
  }

  function handleLogout() {
    localStorage.clear()

    setOpenSnackbar(true)
    setSnackbarSeverity("success")
    setSnackbarMessage("Logged out successfully!")

    navigate(`/`)
  }

  function navigateOnEnter(e) {
    if (e.key === "Enter") {
      navigateToSearchResults(e)
    }
  }

  function navigateToSearchResults(e) {
    const fixed_searchValue = searchValue.replace(/ /g, "%20")

    navigate(
      `/discover?title=Search+Results&type=search&query=${fixed_searchValue}&page=1`
    )

    setSearchValue("")
    setShowSearchBarMobile(false)
    window.scrollTo(0, 0)
  }

  function navigateToSelectedOption(e, option) {
    if (option?.media_type === "tv") {
      navigate(`/show?show_name=${option.name}&show_id=${option.id}`)
    } else if (option?.media_type === "movie") {
      navigate(`/movie?movie_name=${option.title}&movie_id=${option.id}`)
    } else if (option?.media_type === "person") {
      navigate(`/person?person_id=${option.id}`)
    }

    setSearchValue("")
    setShowSearchBarMobile(false)
  }

  const showORMoviesMenu = () => {
    return (
      <ToggleButtonGroup
        value={showsORmovies}
        exclusive
        onChange={(e, value) => {
          if (value !== null) {
            setShowsORmovies(value)
            localStorage.setItem("showsORmovies", value)
            navigate("/")
          }
        }}
        size="small"
        sx={{
          ml: 1,
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          color: "white",
        }}
      >
        <ToggleButton value="shows" size="small">
          <BiSolidTv fontSize={25} />
        </ToggleButton>
        <ToggleButton value="movies">
          <BiSolidCameraMovie fontSize={25} />
        </ToggleButton>
      </ToggleButtonGroup>
    )
  }

  function defineSearchIcon(type) {
    switch (type) {
      case "tv":
        return <LiveTvRoundedIcon style={{ marginRight: 8 }} />
      case "movie":
        return <BiCameraMovie style={{ marginRight: 8, fontSize: 25 }} />
      case "person":
        return <TheaterComedyRoundedIcon style={{ marginRight: 8 }} />
    }
  }

  return (
    <>
      <div className="navbar-wrapper">
        <div className="navbar-logo-search-icon-container">
          <Link to="/" className="navbar-logo-link">
            Watchee
          </Link>

          {isSmallScreen ? (
            <IconButton
              size="small"
              color="warning"
              onClick={() => {
                setSearchValue("")
                setShowSearchBarMobile(true)
              }}
            >
              <SearchRoundedIcon />
            </IconButton>
          ) : (
            showORMoviesMenu()
          )}
        </div>

        {!isSmallScreen && (
          <Autocomplete
            onClick={() => setSearchValue("")}
            inputValue={searchValue}
            size="small"
            freeSolo
            className="navbar-search"
            noOptionsText="No results"
            disableClearable={true}
            options={searchSuggestionsList}
            getOptionLabel={(option) => {
              if (option?.media_type === "tv") {
                return option?.name
              } else if (option?.media_type === "person") {
                return option?.name
              } else if (option?.media_type === "movie") {
                return option?.title
              }
            }}
            renderOption={(props, option) => {
              const { key, ...otherProps } = props
              return (
                <li key={option.id} {...otherProps}>
                  {defineSearchIcon(option?.media_type)}
                  {option?.name || option?.title}
                </li>
              )
            }}
            onChange={(e, selectedOption) => {
              navigateToSelectedOption(e, selectedOption)
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Search a show, movie or person..."
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={(e) => navigateOnEnter(e)}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {params.InputProps.endAdornment}
                      <InputAdornment position="end">
                        <IconButton
                          onClick={navigateToSearchResults}
                          edge="end"
                        >
                          <SearchRoundedIcon />
                        </IconButton>
                      </InputAdornment>
                    </>
                  ),
                }}
              />
            )}
          />
        )}

        {isUserLoggedIn ? (
          <div className="navbar-logged-in-buttons">
            {isSmallScreen && !isMobileApp && !isWebView && (
              <>
                <IconButton
                  size="small"
                  color="white"
                  onClick={() => navigate("/profile")}
                >
                  <AccountCircleRoundedIcon />
                </IconButton>
              </>
            )}

            {isSmallScreen && <>{showORMoviesMenu()}</>}

            {!isMobileApp && !isSmallScreen && !isWebView && (
              <Button
                sx={{ width: "100px" }}
                variant="outlined"
                color="primary"
                startIcon={<AccountCircleRoundedIcon />}
                onClick={() => navigate("/profile")}
              >
                Profile
              </Button>
            )}

            {!isSmallScreen && (
              <Button
                sx={{ width: "100px" }}
                variant="outlined"
                color="primary"
                startIcon={<LogoutRoundedIcon />}
                onClick={handleLogout} // TODO: Add logout confirmation alert
              >
                Logout
              </Button>
            )}
          </div>
        ) : (
          <>
            <Button
              sx={{ width: "100px" }}
              variant="contained"
              color="primary"
              onClick={() => setOpenAuth(true)}
              className="navbar-login-btn"
            >
              Login
            </Button>
          </>
        )}
      </div>

      {window.matchMedia("(display-mode: standalone)").matches && (
        <PWABottomBar />
      )}

      {isWebView && <PWABottomBar />}

      <SearchBarMobile
        showSearchBarMobile={showSearchBarMobile}
        setShowSearchBarMobile={setShowSearchBarMobile}
        navigateToSearchResults={navigateToSearchResults}
        searchSuggestionsList={searchSuggestionsList}
        setSearchValue={setSearchValue}
        navigateToSelectedOption={navigateToSelectedOption}
        navigateOnEnter={navigateOnEnter}
        searchValue={searchValue}
        defineSearchIcon={defineSearchIcon}
      />

      <Authentication openAuth={openAuth} handleCloseAuth={handleCloseAuth} />
    </>
  )
}
