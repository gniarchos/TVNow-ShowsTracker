import { Button, Card, CardContent, CardMedia, Typography } from "@mui/material"
import React, { useState } from "react"
import "./MovieCastCrew.css"
import noFace from "../../../../images/no-face.png"
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded"
import { useNavigate } from "react-router-dom"

export default function MovieCastCrew({ movieData }) {
  const [categoryToShow, setCategoryToShow] = useState("cast")
  const navigate = useNavigate()
  return (
    <div className="movie-cast-crew-wrapper">
      <div className="movie-cast-crew-header">
        <h1 className="movie-details-titles">Cast & Crew</h1>
        <Button
          startIcon={<VisibilityRoundedIcon />}
          variant="contained"
          size="small"
          color="primary"
          onClick={() => {
            alert("Coming Soon!")
          }}
        >
          View More
        </Button>
      </div>

      <div className="movie-cast-crew-buttons">
        <Button
          variant="contained"
          size="small"
          color={categoryToShow === "cast" ? "primary" : "primaryFaded"}
          onClick={() => {
            setCategoryToShow("cast")
          }}
        >
          CAST
        </Button>

        <Button
          variant="contained"
          size="small"
          color={categoryToShow === "crew" ? "primary" : "primaryFaded"}
          onClick={() => {
            setCategoryToShow("crew")
          }}
        >
          CREW
        </Button>
      </div>

      {categoryToShow === "cast" ? (
        <div className="movie-cast-crew-card-container">
          {movieData.credits?.cast?.slice(0, 10).map((person) => {
            return (
              <Card
                key={person.id}
                onClick={() => {
                  navigate(`/person?person_id=${person.id}`)
                }}
                sx={{
                  maxWidth: { sm: 400, xs: 200 },
                  flexShrink: 0,
                  cursor: "pointer",
                }}
              >
                <CardMedia
                  component="img"
                  alt="image"
                  sx={{
                    width: { sm: 300, xs: 200 },
                    height: { sm: 300, xs: 200 },
                    objectFit: "cover",
                  }}
                  image={
                    person.profile_path !== null
                      ? `https://image.tmdb.org/t/p/original/${person.profile_path}`
                      : noFace
                  }
                />
                <CardContent>
                  <h3 className="movie-cast-crew-name">{person.name}</h3>
                  <Typography variant="body4" sx={{ color: "text.secondary" }}>
                    {person.character}
                  </Typography>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <div className="movie-cast-crew-card-container">
          {movieData.credits?.crew?.slice(0, 10).map((person) => {
            return (
              <Card sx={{ maxWidth: { sm: 400, xs: 200 }, flexShrink: 0 }}>
                <CardMedia
                  component="img"
                  alt="image"
                  sx={{
                    width: { sm: 300, xs: 200 },
                    height: { sm: 300, xs: 200 },
                    objectFit: "cover",
                  }}
                  image={
                    person.profile_path !== null
                      ? `https://image.tmdb.org/t/p/original/${person.profile_path}`
                      : noFace
                  }
                />
                <CardContent>
                  <h3 className="movie-cast-crew-name">{person.name}</h3>
                  <Typography variant="body4" sx={{ color: "text.secondary" }}>
                    {person.job}
                  </Typography>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
