import React, { useContext } from "react"
import "./HomeShowsLists.css"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "@mui/material"
import { LayoutContext } from "../../Layout/Layout"

export default function HomeShowsLists({
  listOfShows,
  section,
  type,
  urlTitle,
}) {
  const navigate = useNavigate()
  const { showsORmovies } = useContext(LayoutContext)

  function defineShowTrendingNumbers(type) {
    switch (type) {
      case "trending":
        return true
      case "trendingNetflix":
        return true
      case "trendingAppleTVPlus":
        return true
      case "trendingHBO":
        return true
      case "trendingAmazonPrime":
        return true
      case "trendingDisneyPlus":
        return true
      case "nowPlaying":
        return true
    }
  }

  function defineURLPath(list) {
    switch (showsORmovies) {
      case "shows":
        return `/show?show_name=${list.name}&show_id=${list.id}`
      case "movies":
        return `/movie?movie_title=${list.title}&movie_id=${list.id}`
    }
  }

  const list = listOfShows.slice(0, 12).map((list, index) => {
    return (
      <Link
        to={defineURLPath(list)}
        key={list.id}
        className="home-shows-list-card-content"
      >
        {defineShowTrendingNumbers(type) && (
          <p className="home-shows-list-card-num">{index + 1}</p>
        )}
        <div className="home-shows-list-card-content">
          <div className="home-shows-list-card-img-wrapper">
            <img
              className="home-shows-list-card-img"
              src={`https://image.tmdb.org/t/p/original/${list.poster_path}`}
              alt="show"
            />
          </div>

          <p className="home-shows-list-card-title">
            {showsORmovies === "shows" ? list.name : list.title}
          </p>
        </div>
      </Link>
    )
  })

  return (
    <div className="home-shows-list-wrapper">
      <div className="home-shows-list-title-link">
        <h1 className="home-shows-list-section-title">{section}</h1>
        <Button
          onClick={() =>
            navigate(`/discover?title=${urlTitle}&type=${type}&page=1`)
          }
          variant="contained"
          sx={{
            fontSize: { xs: "0.75rem", sm: "1rem" },
            padding: { xs: "6px 12px", sm: "4px, " },
            display: type === "comingSoon" ? "none" : "inline-block",
          }}
        >
          View More
        </Button>
      </div>

      <div className="home-shows-list-cards">{list}</div>
    </div>
  )
}
