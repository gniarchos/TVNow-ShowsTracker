import React, { useState, useEffect } from "react"
import "./MySuggestions.css"
import { Carousel } from "react-responsive-carousel"
import "react-responsive-carousel/lib/styles/carousel.min.css"
import { Link } from "react-router-dom"

export default function MySuggestions() {
  const [allSuggestions, setAllSuggestions] = useState([])
  const [loading, setLoading] = useState(true)

  let myChoicesArray = [
    "66732",
    "87108",
    "1399",
    "1668",
    "62560",
    "61244",
    "70523",
    "71446",
    "60574",
    "42009",
    "69478",
    "85552",
    "61056",
  ]
  myChoicesArray = myChoicesArray.sort(() => Math.random() - 0.5)

  useEffect(() => {
    setLoading(true)
    myChoicesArray.forEach((id) => {
      fetch(
        `${process.env.REACT_APP_THEMOVIEDB_URL}/tv/${id}?api_key=${process.env.REACT_APP_THEMOVIEDB_API}&language=en-US&append_to_response=external_ids,videos,aggregate_credits,content_ratings,recommendations,similar,watch/providers`
      )
        .then((res) => res.json())
        .then((data) => {
          setAllSuggestions((prevData) => [...prevData, data])
        })
        .finally(() => setLoading(false))
    })
  }, [])

  const suggestions = allSuggestions.map((suggest) => {
    return (
      <div key={suggest.id} className="suggestion-container">
        <img
          className="suggest-img"
          src={`https://image.tmdb.org/t/p/original/${suggest.backdrop_path}`}
          loading="lazy"
          alt=""
        />
        <div className="suggestion-divs">
          <Link
            to={`/show?show_name=${suggest.name}&show_id=${suggest.id}`}
            className="suggest-title"
          >
            {suggest.name}
          </Link>
          <div className="div-suggest-genres">
            {suggest.genres.map((gen, index) => (
              <div key={index} className="genres-wrapper">
                <p className="suggest-genres">{gen.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  })

  return (
    <div className="suggestions-wrapper">
      {loading === false && (
        <Carousel
          className="carousel"
          autoPlay={true}
          width="100vw"
          infiniteLoop={true}
          interval="9000"
          showStatus={false}
          showThumbs={false}
        >
          {suggestions}
        </Carousel>
      )}
    </div>
  )
}
