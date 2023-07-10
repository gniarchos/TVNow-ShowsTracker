import React from "react"
import "./MySuggestions.css"
import { Carousel } from "react-responsive-carousel"
import "react-responsive-carousel/lib/styles/carousel.min.css"
import { nanoid } from "nanoid"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../authentication/AuthContext"

export default function MySuggestions() {
  const [allSuggestions, setAllSuggestions] = React.useState([])
  const [finished, setFinished] = React.useState(false)
  const { currentUser, logout } = useAuth()

  const navigate = useNavigate()

  let myChoicesArray = [
    "66732",
    "87108",
    "1399",
    "1668",
    "62560",
    "66788",
    "70523",
    "71446",
    "60574",
    "42009",
    "69478",
    "85552",
    "61056",
  ]
  myChoicesArray = myChoicesArray.sort(() => Math.random() - 0.5)

  React.useEffect(() => {
    myChoicesArray.forEach((id) => {
      fetch(
        `https://api.themoviedb.org/3/tv/${id}?api_key=***REMOVED***&language=en-US&append_to_response=external_ids,videos,aggregate_credits,content_ratings,recommendations,similar,watch/providers`
      )
        .then((res) => res.json())
        .then((data) => {
          setAllSuggestions((prevData) => [...prevData, data])
        })

      setFinished(true)
    })
  }, [])

  function goToShow(ShowData) {
    navigate("/overview", {
      state: {
        data: ShowData,
        userId: currentUser.uid,
      },
    })
  }

  const suggestions = allSuggestions.map((suggest, index) => {
    return (
      <div key={suggest.id} className="suggestion-container">
        <img
          className="suggest-img"
          src={`https://image.tmdb.org/t/p/original/${suggest.backdrop_path}`}
        />
        <div className="suggestion-divs">
          <p onClick={() => goToShow(suggest)} className="suggest-title">
            {suggest.name}
          </p>
          <div className="div-suggest-genres">
            {suggest.genres.map((gen, index) => (
              <div key={index} className="genres-wrapper">
                <p key={nanoid()} className="suggest-genres">
                  {gen.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  })

  return (
    <div className="suggestions-wrapper">
      {allSuggestions.length >= 13 && (
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
