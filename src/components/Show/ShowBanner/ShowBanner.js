import React, { useContext, useEffect, useState } from "react"
import { Icon } from "@iconify/react"
import trakt_logo from "../../../images/trakt-icon-red-white.png"
import "./ShowBanner.css"
import { Button, Chip, Divider } from "@mui/material"
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded"
import RemoveCircleRoundedIcon from "@mui/icons-material/RemoveCircleRounded"
import CancelRoundedIcon from "@mui/icons-material/CancelRounded"
import apiCaller from "../../../Api/ApiCaller_NEW"
import { LayoutContext } from "../../../components/Layout/Layout"
import { ThreeDots } from "react-loader-spinner"

export default function ShowBanner({
  showData,
  imdbRating,
  rottenTomatoesRating,
  traktRating,
  allUserShows,
}) {
  const divImgStyle = {
    backgroundImage: `url('https://image.tmdb.org/t/p/original/${showData.backdrop_path}')`,
  }

  const user_id = localStorage.getItem("user_id")
  const [loading, setLoading] = useState(false)
  const [showInUserList, setShowInUserList] = useState(false)

  const { setOpenSnackbar, setSnackbarMessage, setSnackbarSeverity } =
    useContext(LayoutContext)

  useEffect(() => {
    allUserShows.forEach((show) => {
      if (show.show_id === showData.id) {
        setShowInUserList(true)
      }
    })
  }, [])

  function addShowToShowsList() {
    if (user_id === null) {
      setOpenSnackbar(true)
      setSnackbarSeverity("error")
      setSnackbarMessage(
        "You need to be logged in to add shows to your watchlist"
      )
      return
    }
    const data_to_post = {
      show_id: showData.id,
      title: showData.name,
      genres: showData.genres.map((gen) => gen.id).join(","),
    }

    setLoading(true)
    apiCaller({
      url: `${process.env.REACT_APP_BACKEND_API_URL}/shows/add-show/${user_id}`,
      method: "POST",
      contentType: "application/json",
      body: JSON.stringify(data_to_post),
      calledFrom: "addShow",
      isResponseJSON: true,
      extras: null,
    })
      .then((data) => {
        setLoading(false)
        setOpenSnackbar(true)
        setSnackbarSeverity("success")
        setSnackbarMessage(`Show added to watchlist!`)
        setShowInUserList(true)
      })
      .catch((error) => {
        setLoading(false)
        setOpenSnackbar(true)
        setSnackbarSeverity("error")
        setSnackbarMessage(error.message)
      })
  }

  function removeShowFromShowsList() {
    setLoading(true)
    apiCaller({
      url: `${process.env.REACT_APP_BACKEND_API_URL}/shows/remove-show/${user_id}/${showData.id}`,
      method: "DELETE",
      contentType: "application/json",
      body: null,
      calledFrom: "removeShow",
      isResponseJSON: true,
      extras: null,
    })
      .then((data) => {
        setLoading(false)
        setOpenSnackbar(true)
        setSnackbarSeverity("success")
        setSnackbarMessage(`Show removed from watchlist!`)
        setShowInUserList(false)
      })
      .catch((error) => {
        setLoading(false)
        setOpenSnackbar(true)
        setSnackbarSeverity("error")
        setSnackbarMessage(error.message)
      })
  }

  return (
    <div style={divImgStyle} className="show-banner-wrapper ">
      <div className="show-banner-container">
        <span className="show-banner-status">
          {showData.status === "In Production" || showData.status === "Planned"
            ? "Upcoming"
            : showData.status}
        </span>

        <h1 className="show-banner-title">{showData.name}</h1>

        <div className="show-banner-genres">
          {showData.genres?.map((gen) => (
            <Chip
              key={gen.id}
              label={gen.name}
              size="small"
              variant="contained"
              color="third"
            />
          ))}
        </div>

        <div className="show-banner-ratings">
          <div className="show-banner-single-rating">
            <img
              className="webRating-img-imdb"
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/IMDB_Logo_2016.svg/1200px-IMDB_Logo_2016.svg.png"
              alt="IMDB Logo"
            />
            <p className="show-banner-rating-num">
              {imdbRating === null ? "-" : parseFloat(imdbRating).toFixed(1)}
              <Icon icon="eva:star-fill" color="#fed600" />
            </p>
          </div>

          <div className="show-banner-single-rating">
            <img
              className="webRating-img"
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Rotten_Tomatoes.svg/1200px-Rotten_Tomatoes.svg.png"
              alt="Rotten Tomatoes"
            />
            <p className="show-banner-rating-num">
              {rottenTomatoesRating === null ? "-" : rottenTomatoesRating} %
            </p>
          </div>

          <div className="show-banner-single-rating">
            <img className="webRating-img-trakt" src={trakt_logo} alt="trakt" />
            <p className="show-banner-rating-num">
              {traktRating === null ? "-" : traktRating} %
            </p>
          </div>
        </div>

        <div className="show-banner-seasons-network-container">
          <span>
            {showData.number_of_seasons > 1
              ? `${showData.number_of_seasons} Seasons`
              : `${showData.number_of_seasons} Season`}
          </span>

          <span>&#8226;</span>
          <span>
            {showData.networks?.length > 0
              ? showData.networks[0]?.name
              : "Unknown"}
          </span>
          <span>&#8226;</span>

          {!showInUserList ? (
            <Button
              startIcon={!loading ? <AddCircleRoundedIcon /> : null}
              variant="contained"
              color="primary"
              size="small"
              disabled={loading}
              sx={{ width: { xs: "40%", sm: "20%" }, whiteSpace: "nowrap" }}
              onClick={addShowToShowsList}
            >
              {loading ? (
                <ThreeDots
                  visible={true}
                  height="25"
                  width="25"
                  color="white"
                  radius="9"
                  ariaLabel="three-dots-loading"
                  wrapperStyle={{}}
                  wrapperClass=""
                />
              ) : (
                "Add Show"
              )}
            </Button>
          ) : (
            <Button
              startIcon={!loading ? <RemoveCircleRoundedIcon /> : null}
              variant="contained"
              color="third"
              size="small"
              disabled={loading}
              sx={{ width: { xs: "40%", sm: "20%" }, whiteSpace: "nowrap" }}
              // onClick={addShowToShowsList}
              onClick={removeShowFromShowsList}
            >
              {loading ? (
                <ThreeDots
                  visible={true}
                  height="25"
                  width="25"
                  color="white"
                  radius="9"
                  ariaLabel="three-dots-loading"
                  wrapperStyle={{}}
                  wrapperClass=""
                />
              ) : (
                "Remove Show"
              )}
            </Button>
          )}

          {/* TODO: Add buttons for logged in user */}
          {/* <Button
            startIcon={<RemoveCircleRoundedIcon />}
            variant="contained"
            color="third"
          >
            Remove Show
          </Button>
          <Button
            startIcon={<CancelRoundedIcon />}
            variant="contained"
            color="cancel"
          >
            Stop Watching
          </Button> */}
        </div>
      </div>
    </div>
  )
}
