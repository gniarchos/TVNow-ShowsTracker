import React from "react"
import "./HomeShowsLists.css"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "@mui/material"

export default function HomeShowsLists({
  listOfShows,
  section,
  type,
  urlTitle,
}) {
  const navigate = useNavigate()
  const list = listOfShows.slice(0, 12).map((list, index) => {
    return (
      <Link
        to={`/show?show_name=${list.name}&show_id=${list.id}`}
        key={list.id}
        className="home-shows-list-card-content"
      >
        {section !== "Discover" && (
          <p className="home-shows-list-card-num">{index + 1}</p>
        )}
        <div className="home-shows-list-card-content">
          <div className="home-shows-list-card-img-wrapper">
            <img
              className="home-shows-list-card-img"
              src={`https://image.tmdb.org/t/p/w500/${list.poster_path}`}
              alt="show"
            />
          </div>

          <p className="home-shows-list-card-title">{list.name}</p>
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
            fontSize: { xs: "0.75rem", sm: "1rem" }, // Smaller font size on mobile
            padding: { xs: "6px 12px", sm: "4px, " }, // Adjust padding for mobile
          }}
        >
          View More
        </Button>
      </div>

      <div className="home-shows-list-cards">{list}</div>
    </div>
  )
}
