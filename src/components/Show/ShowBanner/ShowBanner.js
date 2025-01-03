import React, { useContext, useEffect, useState } from "react"
import { Icon } from "@iconify/react"
import trakt_logo from "../../../images/trakt-icon-red-white.png"
import "./ShowBanner.css"
import { Button, Chip, Divider, Skeleton } from "@mui/material"
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded"
import RemoveCircleRoundedIcon from "@mui/icons-material/RemoveCircleRounded"
import apiCaller from "../../../Api/ApiCaller"
import { LayoutContext } from "../../../components/Layout/Layout"
import { ThreeDots } from "react-loader-spinner"
import { useLocation } from "react-router-dom"
import StopCircleRoundedIcon from "@mui/icons-material/StopCircleRounded"
import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded"

export default function ShowBanner({
  showData,
  imdbRating,
  rottenTomatoesRating,
  traktRating,
  allUserShows,
  showInUserList,
  setShowInUserList,
  userShowInfo,
  setUserShowInfo,
}) {
  const divImgStyle = {
    backgroundImage: `url('https://image.tmdb.org/t/p/original/${showData.backdrop_path}')`,
  }

  const user_id = localStorage.getItem("user_id")
  const [loading, setLoading] = useState(false)
  const [showStopped, setShowStopped] = useState(false)
  const [waitingForData, setWaitingForData] = useState(true)

  const location = useLocation()

  const { setOpenSnackbar, setSnackbarMessage, setSnackbarSeverity } =
    useContext(LayoutContext)

  useEffect(() => {
    setWaitingForData(true)
    allUserShows.forEach((show) => {
      if (show.show_id === showData.id) {
        setShowInUserList(true)
      }
    })

    if (userShowInfo !== null && userShowInfo.length !== 0) {
      if (userShowInfo.season === 0) {
        if (userShowInfo.episode === 0) {
          setShowStopped(false)
        }
      } else {
        setShowStopped(true)
      }
      setWaitingForData(false)
    } else {
      setWaitingForData(false)
    }
  }, [location, allUserShows, userShowInfo])

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

  function markShowAsStoppedOrNot(type) {
    let url = ""

    switch (type) {
      case "stopped":
        url = `${process.env.REACT_APP_BACKEND_API_URL}/shows/mark-show-as-stopped?user_id=${user_id}&show_id=${showData.id}`
        break
      case "continue":
        url = `${process.env.REACT_APP_BACKEND_API_URL}/shows/mark-show-as-not-stopped?user_id=${user_id}&show_id=${showData.id}`
        break
    }

    setLoading(true)
    apiCaller({
      url: url,
      method: "PUT",
      contentType: "application/json",
      body: null,
      calledFrom: "markShowAsStoppedOrNot",
      isResponseJSON: true,
      extras: null,
    })
      .then(() => {
        setLoading(false)
        setOpenSnackbar(true)
        setSnackbarSeverity("success")
        setSnackbarMessage(
          type === "stopped"
            ? `Show marked as stopped!`
            : `Show marked as not stopped!`
        )

        if (type === "stopped") {
          setUserShowInfo((prevInfo) => ({
            ...prevInfo,
            show_status: "stopped",
          }))
        } else {
          setUserShowInfo((prevInfo) => ({
            ...prevInfo,
            show_status: "watching",
          }))
        }
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
        </div>

        {!waitingForData ? (
          <div className="show-banner-buttons-container">
            {!showInUserList ? (
              <Button
                startIcon={!loading ? <AddCircleRoundedIcon /> : null}
                variant="contained"
                color="primary"
                size="medium"
                disabled={loading}
                sx={{ width: { xs: "100%", sm: "100%" }, whiteSpace: "nowrap" }}
                onClick={addShowToShowsList}
              >
                {loading ? (
                  <ThreeDots
                    visible={true}
                    height="23"
                    width="23"
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
              <>
                <Button
                  startIcon={!loading ? <RemoveCircleRoundedIcon /> : null}
                  variant="contained"
                  color="third"
                  size="medium"
                  disabled={loading}
                  sx={{
                    width: showStopped ? "50%" : "100%",
                    whiteSpace: "nowrap",
                  }}
                  onClick={removeShowFromShowsList}
                >
                  {loading ? (
                    <ThreeDots
                      visible={true}
                      height="23"
                      width="23"
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

                {showStopped &&
                  (userShowInfo?.show_status !== "stopped" ? (
                    <Button
                      startIcon={!loading ? <StopCircleRoundedIcon /> : null}
                      variant="contained"
                      color="secondary"
                      size="medium"
                      disabled={loading}
                      sx={{ width: "50%", whiteSpace: "nowrap" }}
                      onClick={() => markShowAsStoppedOrNot("stopped")}
                    >
                      {loading ? (
                        <ThreeDots
                          visible={true}
                          height="23"
                          width="23"
                          color="white"
                          radius="9"
                          ariaLabel="three-dots-loading"
                          wrapperStyle={{}}
                          wrapperClass=""
                        />
                      ) : (
                        "Stop Watching"
                      )}
                    </Button>
                  ) : (
                    <Button
                      startIcon={!loading ? <RestartAltRoundedIcon /> : null}
                      variant="contained"
                      color="success"
                      size="medium"
                      disabled={loading}
                      sx={{ width: "50%", whiteSpace: "nowrap" }}
                      onClick={() => markShowAsStoppedOrNot("continue")}
                    >
                      {loading ? (
                        <ThreeDots
                          visible={true}
                          height="23"
                          width="23"
                          color="white"
                          radius="9"
                          ariaLabel="three-dots-loading"
                          wrapperStyle={{}}
                          wrapperClass=""
                        />
                      ) : (
                        "Continue Watching"
                      )}
                    </Button>
                  ))}
              </>
            )}
          </div>
        ) : (
          <div className="show-banner-buttons-container">
            <Skeleton
              sx={{ bgcolor: "grey.800", width: "100%", height: 35 }}
              variant="rounded"
            />
          </div>
        )}
      </div>
    </div>
  )
}
