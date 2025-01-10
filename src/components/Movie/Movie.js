import React, { useContext, useEffect, useState } from "react"
import "./Movie.css"
import { useLocation, useSearchParams } from "react-router-dom"
import { LayoutContext } from "../Layout/Layout"
import Loader from "../Other/Loader/Loader"
import { Divider, useMediaQuery, useTheme } from "@mui/material"
import ScrollToTop from "../Other/ScrollToTop"
import apiCaller from "../../Api/ApiCaller"
import MovieBanner from "./MovieBanner/MovieBanner"
import MovieTrackingInfo from "./MovieTrackingInfo/MovieTrackingInfo"
import MovieDetails from "./MovieDetails/MovieDetails"
import MovieGeneralInfo from "./MovieGeneralInfo/MovieGeneralInfo"

export default function Movie() {
  const user_id = localStorage.getItem("user_id")
  const [searchParams, setSearchParams] = useSearchParams()
  const param_movie_title = searchParams.get("movie_title")
  const param_movie_id = searchParams.get("movie_id")
  const [movieData, setMovieData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [imdbRating, setImdbRating] = useState(0.0)
  const [rottenTomatoesRating, setRottenTomatoesRating] = useState(0)
  const [traktRating, setTraktRating] = useState(0)
  const location = useLocation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const [allUserMovies, setAllUserMovies] = useState([])
  const [userMovieInfo, setUserMovieInfo] = useState([])
  const [movieInUserList, setMovieInUserList] = useState(false)

  const { setOpenSnackbar, setSnackbarMessage, setSnackbarSeverity } =
    useContext(LayoutContext)

  useEffect(() => {
    setLoading(true)
    window.scrollTo(0, 0)
  }, [location])

  useEffect(() => {
    const fetchData = async () => {
      //   setLoadingEpisodes(true)

      try {
        const promises = [
          apiCaller({
            url: `${process.env.REACT_APP_THEMOVIEDB_URL}/movie/${param_movie_id}?api_key=${process.env.REACT_APP_THEMOVIEDB_API}&language=en-US&append_to_response=external_ids,videos,credits,content_ratings,recommendations,similar,watch/providers,images`,
            method: "GET",
            contentType: "application/json",
            calledFrom: "movieInfo",
          }),
          //   apiCaller({
          //     url: `${process.env.REACT_APP_THEMOVIEDB_URL}/tv/${param_movie_id}/season/${seasonNumber}?api_key=${process.env.REACT_APP_THEMOVIEDB_API}&language=en-US`,
          //     method: "GET",
          //     contentType: "application/json",
          //     calledFrom: "seasonInfo",
          //   }),
        ]

        if (user_id) {
          //   promises.push(
          //     apiCaller({
          //       url: `${process.env.REACT_APP_BACKEND_API_URL}/users/${user_id}/all-shows`,
          //       method: "GET",
          //       contentType: "application/json",
          //       calledFrom: "allUserShows",
          //     })
          //   )
        }

        const [movieDataResult, userMoviesResult] = await Promise.all(promises)

        setMovieData(movieDataResult)
        // setSeasonInfo(seasonInfoResult)

        // if (user_id) setAllUserShows(userShowsResult)
      } catch (error) {
        setOpenSnackbar(true)
        setSnackbarMessage(error.message || "Error fetching data.")
        setSnackbarSeverity("error")
      } finally {
        setLoading(false)
        // setLoadingEpisodes(false)
      }
    }

    fetchData()
  }, [param_movie_id])

  useEffect(() => {
    const fetchRatings = async () => {
      if (movieData?.external_ids?.imdb_id) {
        try {
          const data = await apiCaller({
            url: `${process.env.REACT_APP_BACKEND_API_URL}/proxy/mdblist?imdb_id=${movieData.external_ids.imdb_id}`,
            method: "GET",
            contentType: "application/json",
            calledFrom: "mdblistProxy",
          })

          setImdbRating(data.ratings?.[0]?.value || 0.0)
          setRottenTomatoesRating(data.ratings?.[4]?.value || 0)
          setTraktRating(data.ratings?.[3]?.value || 0)
        } catch (error) {
          setOpenSnackbar(true)
          setSnackbarMessage(error.message || "Error fetching ratings.")
          setSnackbarSeverity("error")
        }
      } else {
        setImdbRating(0.0)
        setRottenTomatoesRating(0)
        setTraktRating(0)
      }
    }

    fetchRatings()
  }, [movieData])

  if (loading) {
    return <Loader />
  }

  return (
    <div className="movie-wrapper">
      <ScrollToTop />

      <MovieBanner
        movieData={movieData}
        imdbRating={imdbRating}
        rottenTomatoesRating={rottenTomatoesRating}
        traktRating={traktRating}
        allUserMovies={allUserMovies}
        movieInUserList={movieInUserList}
        setMovieInUserList={setMovieInUserList}
        userMovieInfo={userMovieInfo}
        setUserMovieInfo={setUserMovieInfo}
        // setReloadData={setReloadData}
        // reloadData={reloadData}
      />

      <MovieTrackingInfo movieData={movieData} />

      <div className="show-container">
        <MovieDetails
          movieData={movieData}
          // seasonNumber={seasonNumber}
          // setSeasonNumber={setSeasonNumber}
          // seasonInfo={seasonInfo}
          userMovieInfo={userMovieInfo}
          // showInUserList={showInUserList}
          // loadingEpisodes={loadingEpisodes}
          // setUserShowInfo={setUserShowInfo}
        />

        <Divider
          color="white"
          orientation={isMobile ? "horizontal" : "vertical"}
          flexItem
        />

        <MovieGeneralInfo movieData={movieData} />
      </div>
    </div>
  )
}