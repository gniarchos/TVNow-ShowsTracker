import React, { useState, useEffect, useContext } from "react"
import "./MySuggestions.css"
import { Link } from "react-router-dom"
import apiCaller from "../../../Api/ApiCaller_NEW"
import Slider from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import { Chip } from "@mui/material"
import { LayoutContext } from "../../Layout/Layout"

export default function MySuggestions() {
  const [allSuggestions, setAllSuggestions] = useState([])

  const { setOpenSnackbar, setSnackbarMessage, setSnackbarSeverity } =
    useContext(LayoutContext)

  const settings = {
    dots: true,
    infinite: true,
    fade: true,
    speed: 500,
    autoplaySpeed: 5000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  }

  let myChoicesArray = [
    "66732",
    "124364",
    "1399",
    "1668",
    "62560",
    "61244",
    "70523",
    "60574",
    "42009",
    "69478",
    "85552",
    "61056",
  ]
  myChoicesArray = myChoicesArray.sort(() => Math.random() - 0.5)

  useEffect(() => {
    myChoicesArray.forEach((id) => {
      apiCaller({
        url: `${process.env.REACT_APP_THEMOVIEDB_URL}/tv/${id}?api_key=${process.env.REACT_APP_THEMOVIEDB_API}&language=en-US&append_to_response=external_ids,videos,aggregate_credits,content_ratings,recommendations,similar,watch/providers`,
        method: "GET",
        contentType: "application/json",
        body: null,
        calledFrom: "getShowData",
        isResponseJSON: true,
        extras: null,
      })
        .then((data) => {
          setAllSuggestions((prevData) => [...prevData, data])
        })
        .catch((error) => {
          setOpenSnackbar(true)
          setSnackbarSeverity("error")
          setSnackbarMessage(error.message)
        })
    })
  }, [])

  function SampleNextArrow(props) {
    const { className, style, onClick } = props
    return (
      <div
        className={className}
        style={{
          ...style,
          position: "absolute",
          top: "50%",
          right: 0,
          zIndex: 100,
        }}
        onClick={onClick}
      />
    )
  }

  function SamplePrevArrow(props) {
    const { className, style, onClick } = props
    return (
      <div
        className={className}
        style={{
          ...style,
          position: "absolute",
          top: "50%",
          left: 0,
          zIndex: 100,
        }}
        onClick={onClick}
      />
    )
  }

  const suggestions = allSuggestions.map((suggest) => {
    return (
      <div key={suggest.id} className="suggestion-wrapper">
        <img
          className="suggestion-cover-img"
          src={`https://image.tmdb.org/t/p/original/${suggest.backdrop_path}`}
          loading="lazy"
          alt=""
        />
        <div className="suggestion-container-info">
          <Link
            to={`/show?show_name=${suggest.name}&show_id=${suggest.id}`}
            className="suggestion-title"
          >
            {suggest.name}
          </Link>
          <div className="suggestion-genres-container">
            {suggest.genres.map((gen, index) => (
              <div key={index} className="suggestion-genres">
                <Chip
                  label={gen.name}
                  color="third"
                  sx={{
                    fontWeight: "500",
                    fontSize: { xs: "0.6rem", sm: "1rem" }, // Smaller font size on mobile
                    padding: { xs: "6px 2px", sm: "4px, 8px" }, // Adjust padding for mobile
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  })

  return <Slider {...settings}>{suggestions}</Slider>
}