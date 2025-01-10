import React, { useState, useEffect, useContext } from "react"
import "./DetailedShowsList.css"
import { Icon } from "@iconify/react"
import { useSearchParams, useNavigate } from "react-router-dom"
import DetailedShowCard from "./DetailedShowCard"
import Loader from "../Other/Loader/Loader"
import apiCaller from "../../Api/ApiCaller"
import { LayoutContext } from "../Layout/Layout"
import { Chip, Pagination, useMediaQuery } from "@mui/material"
import { useTheme } from "@emotion/react"
import dayjs from "dayjs"

export default function DetailedShowsList() {
  const [allShows, setAllShows] = useState([])
  const [totalPages, setTotalPages] = useState(0)
  const [totalResults, setTotalResults] = useState(0)
  const [loading, setLoading] = useState(true)
  const [searchParams, setSearchParams] = useSearchParams()
  const param_section_title = searchParams.get("title")
  const param_section_type = searchParams.get("type")
  const param_section_page = searchParams.get("page")
  const param_search_query = searchParams.get("query")

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  const {
    setOpenSnackbar,
    setSnackbarMessage,
    setSnackbarSeverity,
    showsORmovies,
  } = useContext(LayoutContext)

  const navigate = useNavigate()
  if (
    param_section_page === "" ||
    param_section_page === null ||
    param_section_title === "" ||
    param_section_title === null ||
    param_section_type === "" ||
    param_section_type === null ||
    (param_section_type === "search" &&
      (param_search_query === "" || param_search_query === null))
  ) {
    navigate("/error404")
  }

  useEffect(() => {
    setLoading(true)
    if (showsORmovies === "shows") {
      if (param_section_type === "trending") {
        apiCaller({
          url: `${process.env.REACT_APP_THEMOVIEDB_URL}/${param_section_type}/tv/week?api_key=${process.env.REACT_APP_THEMOVIEDB_API}&page=${param_section_page}`,
          method: "GET",
          contentType: "application/json",
          body: null,
          calledFrom: "trendingList",
          isResponseJSON: true,
          extras: null,
        })
          .then((data) => {
            setAllShows(data.results)
            setTotalPages(data.total_pages)
            setTotalResults(data.total_results)
            setLoading(false)
          })
          .catch((error) => {
            setSnackbarSeverity("error")
            setSnackbarMessage(error.message)
            setOpenSnackbar(true)
          })
      } else if (param_section_type === "discover") {
        apiCaller({
          url: `${process.env.REACT_APP_THEMOVIEDB_URL}/tv/top_rated?api_key=${process.env.REACT_APP_THEMOVIEDB_API}&language=en-US&page=${param_section_page}`,
          method: "GET",
          contentType: "application/json",
          body: null,
          calledFrom: "trendingList",
          isResponseJSON: true,
          extras: null,
        })
          .then((data) => {
            setAllShows(data.results)
            setTotalPages(data.total_pages)
            setTotalResults(data.total_results)
            setLoading(false)
          })
          .catch((error) => {
            setSnackbarSeverity("error")
            setSnackbarMessage(error.message)
            setOpenSnackbar(true)
          })
      } else if (param_section_type === "trendingNetflix") {
        apiCaller({
          url: `https://api.themoviedb.org/3/discover/tv?api_key=${process.env.REACT_APP_THEMOVIEDB_API}&language=en-US&sort_by=popularity.desc&with_networks=213&with_status=0|1&watch_region=US&page=${param_section_page}`,
          method: "GET",
          contentType: "application/json",
          body: null,
          calledFrom: "trendingListNetflix",
          isResponseJSON: true,
          extras: null,
        })
          .then((data) => {
            setAllShows(data.results)
            setTotalPages(data.total_pages)
            setTotalResults(data.total_results)
            setLoading(false)
          })
          .catch((error) => {
            setSnackbarSeverity("error")
            setSnackbarMessage(error.message)
            setOpenSnackbar(true)
          })
      } else if (param_section_type === "trendingHBO") {
        apiCaller({
          url: `https://api.themoviedb.org/3/discover/tv?api_key=${process.env.REACT_APP_THEMOVIEDB_API}&language=en-US&sort_by=popularity.desc&with_networks=49|3186|3308|7869&with_status=0|1&page=${param_section_page}`,
          method: "GET",
          contentType: "application/json",
          body: null,
          calledFrom: "trendingListHBO",
          isResponseJSON: true,
          extras: null,
        })
          .then((data) => {
            setAllShows(data.results)
            setTotalPages(data.total_pages)
            setTotalResults(data.total_results)
            setLoading(false)
          })
          .catch((error) => {
            setSnackbarSeverity("error")
            setSnackbarMessage(error.message)
            setOpenSnackbar(true)
          })
      } else if (param_section_type === "trendingAmazonPrime") {
        apiCaller({
          url: `https://api.themoviedb.org/3/discover/tv?api_key=${process.env.REACT_APP_THEMOVIEDB_API}&language=en-US&sort_by=popularity.desc&with_networks=1024&with_status=0|1&page=${param_section_page}`,
          method: "GET",
          contentType: "application/json",
          body: null,
          calledFrom: "trendingListAmazonPrime",
          isResponseJSON: true,
          extras: null,
        })
          .then((data) => {
            setAllShows(data.results)
            setTotalPages(data.total_pages)
            setTotalResults(data.total_results)
            setLoading(false)
          })
          .catch((error) => {
            setSnackbarSeverity("error")
            setSnackbarMessage(error.message)
            setOpenSnackbar(true)
          })
      } else if (param_section_type === "trendingDisneyPlus") {
        apiCaller({
          url: `https://api.themoviedb.org/3/discover/tv?api_key=${process.env.REACT_APP_THEMOVIEDB_API}&language=en-US&sort_by=popularity.desc&with_networks=2739&with_status=0|1&page=${param_section_page}`,
          method: "GET",
          contentType: "application/json",
          body: null,
          calledFrom: "trendingListDisneyPlus",
          isResponseJSON: true,
          extras: null,
        })
          .then((data) => {
            setAllShows(data.results)
            setTotalPages(data.total_pages)
            setTotalResults(data.total_results)
            setLoading(false)
          })
          .catch((error) => {
            setSnackbarSeverity("error")
            setSnackbarMessage(error.message)
            setOpenSnackbar(true)
          })
      } else if (param_section_type === "trendingAppleTVPlus") {
        apiCaller({
          url: `https://api.themoviedb.org/3/discover/tv?api_key=${process.env.REACT_APP_THEMOVIEDB_API}&language=en-US&sort_by=popularity.desc&with_networks=2552&with_status=0|1&page=${param_section_page}`,
          method: "GET",
          contentType: "application/json",
          body: null,
          calledFrom: "trendingAppleTVPlus",
          isResponseJSON: true,
          extras: null,
        })
          .then((data) => {
            setAllShows(data.results)
            setTotalPages(data.total_pages)
            setTotalResults(data.total_results)
            setLoading(false)
          })
          .catch((error) => {
            setSnackbarSeverity("error")
            setSnackbarMessage(error.message)
            setOpenSnackbar(true)
          })
      } else {
        apiCaller({
          url: `${process.env.REACT_APP_THEMOVIEDB_URL}/search/tv?api_key=${process.env.REACT_APP_THEMOVIEDB_API}&language=en-US&query=${param_search_query}&include_adult=true&page=${param_section_page}`,
          method: "GET",
          contentType: "application/json",
          body: null,
          calledFrom: "trendingList",
          isResponseJSON: true,
          extras: null,
        })
          .then((data) => {
            setAllShows(data.results)
            setTotalPages(data.total_pages)
            setTotalResults(data.total_results)
            setLoading(false)
          })
          .catch((error) => {
            setSnackbarSeverity("error")
            setSnackbarMessage(error.message)
            setOpenSnackbar(true)
          })
      }
    } else {
      if (param_section_type === "trending") {
        apiCaller({
          url: `${process.env.REACT_APP_THEMOVIEDB_URL}/trending/movie/day?api_key=${process.env.REACT_APP_THEMOVIEDB_API}&page=${param_section_page}&region=US`,
          method: "GET",
          contentType: "application/json",
          body: null,
          calledFrom: "trendingList",
          isResponseJSON: true,
          extras: null,
        })
          .then((data) => {
            setAllShows(data.results)
            setTotalPages(data.total_pages)
            setTotalResults(data.total_results)
            setLoading(false)
          })
          .catch((error) => {
            setSnackbarSeverity("error")
            setSnackbarMessage(error.message)
            setOpenSnackbar(true)
          })
      } else if (param_section_type === "nowPlaying") {
        apiCaller({
          url: `${process.env.REACT_APP_THEMOVIEDB_URL}/movie/now_playing?api_key=${process.env.REACT_APP_THEMOVIEDB_API}&page=${param_section_page}&region=US`,
          method: "GET",
          contentType: "application/json",
          body: null,
          calledFrom: "nowPlayingList",
          isResponseJSON: true,
          extras: null,
        })
          .then((data) => {
            setAllShows(data.results)
            setTotalPages(data.total_pages)
            setTotalResults(data.total_results)
            setLoading(false)
          })
          .catch((error) => {
            setSnackbarSeverity("error")
            setSnackbarMessage(error.message)
            setOpenSnackbar(true)
          })
      } else {
        apiCaller({
          url: `${process.env.REACT_APP_THEMOVIEDB_URL}/search/movie?api_key=${process.env.REACT_APP_THEMOVIEDB_API}&language=en-US&query=${param_search_query}&include_adult=true&page=${param_section_page}`,
          method: "GET",
          contentType: "application/json",
          body: null,
          calledFrom: "trendingList",
          isResponseJSON: true,
          extras: null,
        })
          .then((data) => {
            setAllShows(data.results)
            setTotalPages(data.total_pages)
            setTotalResults(data.total_results)
            setLoading(false)
          })
          .catch((error) => {
            setSnackbarSeverity("error")
            setSnackbarMessage(error.message)
            setOpenSnackbar(true)
          })
      }
    }
  }, [param_section_page, param_search_query, showsORmovies])

  function handlePageChange(event, value) {
    setSearchParams((prevParams) => {
      const updatedSearchParams = new URLSearchParams(prevParams)
      updatedSearchParams.set("page", value)
      return updatedSearchParams
    })
  }

  if (loading) {
    return <Loader />
  }

  return (
    <div className="detailed-shows-list-wrapper">
      <div className="detailed-shows-list-header">
        <h1 className="detailed-shows-list-title">{param_section_title}</h1>
        <div className="detailed-shows-list-search-info">
          <Chip
            size="small"
            color="secondary"
            label={
              <span>
                Found <b>{totalResults}</b> Results
              </span>
            }
          />
          <Chip
            size="small"
            color="secondary"
            label={
              <span>
                Page <b>{param_section_page}</b>
              </span>
            }
          />
        </div>
      </div>

      {/* TODO: CHECK LATER */}
      {allShows.length <= 0 && (
        <div className="noSearchResults-div">
          <p>
            <Icon icon="ic:baseline-sms-failed" width={30} />
            Sorry, we can't find the TV Show you're looking for.
          </p>
        </div>
      )}

      <DetailedShowCard allShows={allShows} />

      {allShows.length > 0 && totalPages > 2 && (
        <div className="detailed-shows-list-pagination">
          <Pagination
            size={isMobile ? "small" : "large"}
            page={parseInt(param_section_page)}
            onChange={handlePageChange}
            count={totalPages < 500 ? totalPages : 500}
            color="secondary"
            boundaryCount={isMobile ? 2 : 5}
            siblingCount={isMobile ? 1 : 1}
          />
        </div>
      )}
    </div>
  )
}
