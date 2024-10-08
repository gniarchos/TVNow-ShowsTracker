import React, { useContext, useEffect, useState } from "react"
import "./Navbar.css"
import { Link } from "react-router-dom"
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
import { LayoutContext } from "../Layout/Layout"

export default function Navbar() {
  const { isUserLoggedIn } = useContext(LayoutContext)
  const [searchSuggestionsList, setSearchSuggestionsList] = useState([])
  const [searchValue, setSearchValue] = useState("")

  const { setOpenSnackbar, setSnackbarMessage, setSnackbarSeverity } =
    useContext(LayoutContext)

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

  return (
    <>
      <div className="navbar-wrapper">
        <Link to="/" className="navbar-logo-link">
          Watchee
        </Link>
        <SearchRoundedIcon className="navbar-search-icon-mobile" />

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
          getOptionLabel={(option) => option?.name}
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
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Search..."
              onChange={(e) => setSearchValue(e.target.value)}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {params.InputProps.endAdornment}
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => alert("Coming soon!")}
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

        {isUserLoggedIn ? (
          // TODO: Add logout button AND profile button
          <></>
        ) : (
          <>
            <Button
              sx={{ width: "100px" }}
              variant="contained"
              color="primary"
              onClick={() => alert("Coming soon!")}
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
    </>
  )
}
