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
} from "@mui/material"
import SearchRoundedIcon from "@mui/icons-material/SearchRounded"
import apiCaller from "../../Api/ApiCaller_NEW"
import LiveTvRoundedIcon from "@mui/icons-material/LiveTvRounded"
import TheaterComedyRoundedIcon from "@mui/icons-material/TheaterComedyRounded"
import PWABottomBar from "./PWAHeaders/PWABottomBar"
import SearchBarMobile from "./SearchBarMobile/SearchBarMobile"
import Authentication from "../../Authentication/Authentication"

export default function Navbar() {
  const [searchSuggestionsList, setSearchSuggestionsList] = useState([])
  const [searchValue, setSearchValue] = useState("")
  const navigate = useNavigate()
  const [showSearchBarMobile, setShowSearchBarMobile] = useState(false)
  const [openAuth, setOpenAuth] = useState(false)
  const location = useLocation()

  const {
    setOpenSnackbar,
    setSnackbarMessage,
    setSnackbarSeverity,
    isUserLoggedIn,
  } = useContext(LayoutContext)

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
    localStorage.removeItem("username")
    localStorage.removeItem("userToken")

    setOpenSnackbar(true)
    setSnackbarSeverity("success")
    setSnackbarMessage("Logged out successfully!")

    if (location.pathname === "/profile") {
      navigate("/")
    }

    window.location.reload()
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
    } else if (option?.media_type === "person") {
      navigate(`/person?person_id=${option.id}`)
    }

    setSearchValue("")
    setShowSearchBarMobile(false)
  }

  return (
    <>
      <div className="navbar-wrapper">
        <Link to="/" className="navbar-logo-link">
          Watchee
        </Link>
        <SearchRoundedIcon
          onClick={() => setShowSearchBarMobile(true)}
          className="navbar-search-icon-mobile"
        />

        <Autocomplete
          size="small"
          freeSolo
          className="navbar-search"
          noOptionsText="No results"
          disableClearable={true}
          options={searchSuggestionsList.filter(
            (option) =>
              option?.media_type === "tv" || option?.media_type === "person"
          )}
          getOptionLabel={(option) => option?.name || ""}
          renderOption={(props, option) => {
            const { key, ...otherProps } = props
            return (
              <li key={option.id} {...otherProps}>
                {option?.media_type === "tv" ? (
                  <LiveTvRoundedIcon style={{ marginRight: 8 }} />
                ) : (
                  <TheaterComedyRoundedIcon style={{ marginRight: 8 }} />
                )}{" "}
                {option?.name}
              </li>
            )
          }}
          onChange={(e, selectedOption) => {
            navigateToSelectedOption(e, selectedOption)
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Search..."
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={(e) => navigateOnEnter(e)}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {params.InputProps.endAdornment}
                    <InputAdornment position="end">
                      <IconButton onClick={navigateToSearchResults} edge="end">
                        <SearchRoundedIcon />
                      </IconButton>
                    </InputAdornment>
                  </>
                ),
              }}
            />
          )}
        />

        {isUserLoggedIn ? (
          <div className="navbar-logged-in-buttons">
            <Button
              sx={{ width: "100px" }}
              variant="outlined"
              color="primary"
              onClick={() => navigate("/profile")}
              className="navbar-profile-btn"
            >
              Profile
            </Button>

            <Button
              sx={{ width: "100px" }}
              variant="outlined"
              color="primary"
              onClick={handleLogout} // TODO: Add logout confirmation alert
              className="navbar-logout-btn"
            >
              Logout
            </Button>
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

      <SearchBarMobile
        showSearchBarMobile={showSearchBarMobile}
        setShowSearchBarMobile={setShowSearchBarMobile}
        navigateToSearchResults={navigateToSearchResults}
        searchSuggestionsList={searchSuggestionsList}
        setSearchValue={setSearchValue}
        navigateToSelectedOption={navigateToSelectedOption}
        navigateOnEnter={navigateOnEnter}
      />

      <Authentication openAuth={openAuth} handleCloseAuth={handleCloseAuth} />
    </>
  )
}
