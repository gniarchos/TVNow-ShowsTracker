import React, { useState, useEffect } from "react"
import "./DetailedShowsList.css"
import { Icon } from "@iconify/react"
import { useSearchParams, useNavigate } from "react-router-dom"
import ReactPaginate from "react-paginate"
import PuffLoader from "react-spinners/PuffLoader"
import ShowCard from "./ShowCard"
import Filters from "./Filters"
import Loader from "../Other/Loader"

export default function DetailedShowsList() {
  document.title = "TVTime | TV Shows Tracker"

  let allGenres = [
    { name: "Show All", id: null },
    { name: "Action & Adventure", id: 10759 },
    { name: "Animation", id: 16 },
    { name: "Comedy", id: 35 },
    { name: "Crime", id: 80 },
    { name: "Documentary", id: 99 },
    { name: "Drama", id: 18 },
    { name: "Family", id: 10751 },
    { name: "Kids", id: 10762 },
    { name: "Mystery", id: 9648 },
    { name: "News", id: 10763 },
    { name: "Reality", id: 10764 },
    { name: "Soap", id: 10766 },
    { name: "Talk", id: 10767 },
    { name: "War & Politics", id: 10768 },
    { name: "Western", id: 37 },
  ]

  const [allShows, setAllShows] = useState([])
  const [totalPages, setTotalPages] = useState(0)
  const [totalResults, setTotalResults] = useState(0)
  const [loading, setLoading] = useState(true)
  const [searchParams, setSearchParams] = useSearchParams()
  const param_section_title = searchParams.get("title")
  const param_section_type = searchParams.get("type")
  const param_section_page = searchParams.get("page")
  let param_section_filter = searchParams.get("filter")
    ? searchParams.get("filter")
    : "null"
  const param_search_query = searchParams.get("query")
  const [fetchLink, setFetchLink] = useState()

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
    if (param_section_type === "trending") {
      setFetchLink(
        `https://api.themoviedb.org/3/${param_section_type}/tv/week?api_key=${process.env.REACT_APP_THEMOVIEDB_API}&page=${param_section_page}`
      )
    } else if (param_section_type === "discover") {
      setFetchLink(
        `https://api.themoviedb.org/3/discover/tv?api_key=${
          process.env.REACT_APP_THEMOVIEDB_API
        }&language=en-US&page=${param_section_page}&with_genres=${
          param_section_filter !== null ? param_section_filter : null
        }`
      )
    } else if (
      param_section_type === "on_the_air" ||
      param_section_type === "popular"
    ) {
      setFetchLink(
        `https://api.themoviedb.org/3/tv/${param_section_type}?api_key=${process.env.REACT_APP_THEMOVIEDB_API}&language=en-US&page=${param_section_page}`
      )
    } else {
      setFetchLink(
        `https://api.themoviedb.org/3/search/tv?api_key=${process.env.REACT_APP_THEMOVIEDB_API}&language=en-US&query=${param_search_query}&include_adult=true&page=${param_section_page}`
      )
    }
  }, [param_section_page, param_search_query, param_section_filter])

  useEffect(() => {
    window.scrollTo(0, 0)

    // TODO: make promise all type of fetch
    if (fetchLink === undefined) {
      setLoading(true)
    } else {
      setLoading(true)
      fetch(fetchLink)
        .then((res) => res.json())
        .then((data) => {
          // console.log(data)
          setTotalPages(data.total_pages)
          setAllShows(data.results)
          setTotalResults(data.total_results)
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [fetchLink])

  function goToNextPage(event) {
    window.scrollTo(0, 0)

    setSearchParams((prevParams) => {
      const updatedSearchParams = new URLSearchParams(prevParams)
      updatedSearchParams.set("page", event.selected + 1)
      return updatedSearchParams
    })
  }

  function handleFilters(event) {
    const { id } = event.target

    if (id === "") {
      searchParams.delete("filter")
      setSearchParams(searchParams)
    } else {
      setSearchParams((prevParams) => {
        const updatedSearchParams = new URLSearchParams(prevParams)
        updatedSearchParams.set("filter", id)
        updatedSearchParams.set("page", 1)
        return updatedSearchParams
      })
    }

    param_section_filter = id
  }

  if (loading) {
    return <Loader />
  }

  return (
    <div className="detailedSlider-wrapper">
      <div className="title-link-detailed">
        <h1 className="search-title">{param_section_title}</h1>
        <div className="search-info">
          <p>Found {totalResults} Results</p>
          <p>&#8226;</p>
          <p>Page {param_section_page}</p>
        </div>
      </div>

      {param_section_type === "discover" &&
        param_section_title !== "Search Results" && (
          <Filters
            allGenres={allGenres}
            handleFilters={handleFilters}
            param_section_filter={param_section_filter}
          />
        )}

      {allShows.length <= 0 && (
        <div className="noSearchResults-div">
          <p>
            <Icon icon="ic:baseline-sms-failed" width={30} />
            Sorry, we can't find the TV Show you're looking for.
          </p>
        </div>
      )}

      <ShowCard allShows={allShows} />

      {allShows.length > 0 && totalPages > 2 && (
        <div className="pagination-container">
          <ReactPaginate
            breakLabel="..."
            nextLabel={<Icon icon="carbon:next-filled" />}
            onPageChange={(e) => goToNextPage(e)}
            pageRangeDisplayed={2}
            marginPagesDisplayed={1}
            pageCount={totalPages >= 500 ? 500 : totalPages}
            previousLabel={<Icon icon="carbon:previous-filled" />}
            renderOnZeroPageCount={null}
            containerClassName="pagination"
            pageLinkClassName="page-num"
            previousLinkClassName="page-buttons"
            nextLinkClassName="page-buttons"
            activeLinkClassName="active"
            forcePage={param_section_page - 1}
          />
        </div>
      )}
    </div>
  )
}
