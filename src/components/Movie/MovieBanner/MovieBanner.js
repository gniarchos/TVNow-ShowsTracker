import React, { useContext, useEffect, useState } from "react"
import { Icon } from "@iconify/react"
import trakt_logo from "../../../images/trakt-icon-red-white.png"
import "./MovieBanner.css"
import { Button, Chip, Skeleton } from "@mui/material"
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded"
import RemoveCircleRoundedIcon from "@mui/icons-material/RemoveCircleRounded"
import apiCaller from "../../../Api/ApiCaller"
import { LayoutContext } from "../../../components/Layout/Layout"
import { ThreeDots } from "react-loader-spinner"
import { useLocation } from "react-router-dom"
import dayjs from "dayjs"

export default function MovieBanner({
  movieData,
  imdbRating,
  rottenTomatoesRating,
  traktRating,
  allUserMovies,
  movieInUserList,
  setMovieInUserList,
  userMovieInfo,
  setUserMovieInfo,
  setReloadData,
  reloadData,
}) {
  const divImgStyle = {
    backgroundImage: `url('https://image.tmdb.org/t/p/original/${movieData.backdrop_path}')`,
  }

  const user_id = localStorage.getItem("user_id")
  const [loading, setLoading] = useState(false)
  const [waitingForData, setWaitingForData] = useState(true)

  const location = useLocation()

  const { setOpenSnackbar, setSnackbarMessage, setSnackbarSeverity } =
    useContext(LayoutContext)

  useEffect(() => {
    setWaitingForData(true)
    setMovieInUserList(false)

    allUserMovies.forEach((movie) => {
      if (movie.movie_id === movieData.id) {
        setMovieInUserList(true)
      }
    })

    setWaitingForData(false)
  }, [location, allUserMovies, userMovieInfo])

  function addMovieToMoviesList() {
    if (user_id === null) {
      setOpenSnackbar(true)
      setSnackbarSeverity("error")
      setSnackbarMessage(
        "You need to be logged in to add movies to your watchlist"
      )
      return
    }
    const data_to_post = {
      movie_id: movieData.id,
      title: movieData.title,
      genres: movieData.genres.map((gen) => gen.id).join(","),
    }
    setLoading(true)
    apiCaller({
      url: `${process.env.REACT_APP_BACKEND_API_URL}/movies/add-movie/${user_id}`,
      method: "POST",
      contentType: "application/json",
      body: JSON.stringify(data_to_post),
      calledFrom: "addMovie",
      isResponseJSON: true,
      extras: null,
    })
      .then((data) => {
        setLoading(false)
        setOpenSnackbar(true)
        setSnackbarSeverity("success")
        setSnackbarMessage(`Movie added to watchlist!`)
        setMovieInUserList(true)
        setReloadData(!reloadData)
      })
      .catch((error) => {
        setLoading(false)
        setOpenSnackbar(true)
        setSnackbarSeverity("error")
        setSnackbarMessage(error.message)
      })
  }

  function removeMovieFromMoviesList() {
    setLoading(true)
    apiCaller({
      url: `${process.env.REACT_APP_BACKEND_API_URL}/movies/remove-movie/${user_id}/${movieData.id}`,
      method: "DELETE",
      contentType: "application/json",
      body: null,
      calledFrom: "removeMovie",
      isResponseJSON: true,
      extras: null,
    })
      .then((data) => {
        setLoading(false)
        setOpenSnackbar(true)
        setSnackbarSeverity("success")
        setSnackbarMessage(`Movie removed from watchlist!`)
        setMovieInUserList(false)
        setReloadData(!reloadData)
      })
      .catch((error) => {
        setLoading(false)
        setOpenSnackbar(true)
        setSnackbarSeverity("error")
        setSnackbarMessage(error.message)
      })
  }

  function convertMinutes(totalMinutes) {
    const hours = Math.floor(totalMinutes / 60) // Calculate hours
    const minutes = totalMinutes % 60 // Get the remaining minutes
    return `${hours}h ${minutes}m`
  }

  return (
    <div style={divImgStyle} className="movie-banner-wrapper ">
      <div className="movie-banner-container">
        <span className="movie-banner-status">
          {movieData.status === "In Production" ||
          movieData.status === "Planned"
            ? "Upcoming"
            : movieData.status}
        </span>

        <h1 className="movie-banner-title">{movieData.title}</h1>

        <div className="movie-banner-genres">
          {movieData.genres?.map((gen) => (
            <Chip
              key={gen.id}
              label={gen.name}
              size="small"
              variant="contained"
              color="third"
            />
          ))}
        </div>

        <div className="movie-banner-ratings">
          <div className="movie-banner-single-rating">
            <img
              className="webRating-img-imdb"
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/IMDB_Logo_2016.svg/1200px-IMDB_Logo_2016.svg.png"
              alt="IMDB Logo"
            />
            <p className="movie-banner-rating-num">
              {imdbRating === null ? "-" : parseFloat(imdbRating).toFixed(1)}
              <Icon icon="eva:star-fill" color="#fed600" />
            </p>
          </div>

          <div className="movie-banner-single-rating">
            <img
              className="webRating-img"
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Rotten_Tomatoes.svg/1200px-Rotten_Tomatoes.svg.png"
              alt="Rotten Tomatoes"
            />
            <p className="movie-banner-rating-num">
              {rottenTomatoesRating === null ? "-" : rottenTomatoesRating} %
            </p>
          </div>

          <div className="movie-banner-single-rating">
            <img className="webRating-img-trakt" src={trakt_logo} alt="trakt" />
            <p className="movie-banner-rating-num">
              {traktRating === null ? "-" : traktRating} %
            </p>
          </div>
        </div>

        <div className="movie-banner-seasons-network-container">
          <span>{`${dayjs(movieData.release_date).format("YYYY")}`}</span>

          <span>&#8226;</span>
          <span>{convertMinutes(movieData.runtime)}</span>
        </div>

        {!waitingForData ? (
          <div className="movie-banner-buttons-container">
            {!movieInUserList ? (
              <Button
                startIcon={!loading ? <AddCircleRoundedIcon /> : null}
                variant="contained"
                color="primary"
                size="medium"
                disabled={loading}
                sx={{ width: { xs: "100%", sm: "100%" }, whiteSpace: "nowrap" }}
                onClick={addMovieToMoviesList}
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
                  "Add Movie"
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
                    width: "100%",
                    whiteSpace: "nowrap",
                  }}
                  onClick={removeMovieFromMoviesList}
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
                    "Remove Movie"
                  )}
                </Button>
              </>
            )}
          </div>
        ) : (
          <div className="movie-banner-buttons-container">
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
