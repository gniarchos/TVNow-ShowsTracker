import React from "react"
import { Icon } from "@iconify/react"
import trakt_logo from "../../../images/trakt-icon-red-white.png"
import "./ShowBanner.css"
import { Button, Chip, Divider } from "@mui/material"
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded"
import RemoveCircleRoundedIcon from "@mui/icons-material/RemoveCircleRounded"
import CancelRoundedIcon from "@mui/icons-material/CancelRounded"

export default function ShowBanner({
  showData,
  imdbRating,
  rottenTomatoesRating,
  traktRating,
}) {
  const divImgStyle = {
    backgroundImage: `url('https://image.tmdb.org/t/p/original/${showData.backdrop_path}')`,
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
            // <p key={gen.id} className="show-genres">
            //   {gen.name}
            // </p>
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

          <Button
            startIcon={<AddCircleRoundedIcon />}
            variant="contained"
            color="primary"
            size="small"
            sx={{ width: { xs: "40%", sm: "20%" }, whiteSpace: "nowrap" }}
          >
            Add Show
          </Button>

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
