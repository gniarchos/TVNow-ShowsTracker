import React from "react"
import { useLocation, useNavigate } from "react-router-dom"
import "./People.css"
import Navbar from "./Navbar"
import Footer from "./Footer"
import noImg from "../images/no-image.png"
import noFace from "../images/no-face.png"

export default function People() {
  const isLoggedIn = true
  const location = useLocation()
  const navigate = useNavigate()

  const [personDetails, setPersonDetails] = React.useState([])
  const [personKnownFor, setPersonKnownFor] = React.useState([])
  const [isLoading, setIsLoading] = React.useState(true)

  function goToShow(showID) {
    fetch(
      `https://api.themoviedb.org/3/tv/${showID}?api_key=${process.env.REACT_APP_THEMOVIEDB_API}&language=en-US&append_to_response=external_ids,videos,aggregate_credits,content_ratings,recommendations,similar,watch/providers,images`
    )
      .then((res) => res.json())
      .then((data) => {
        navigate("/overview", {
          state: {
            data: data,
            userId: location.state.userId,
          },
        })
      })
  }

  React.useEffect(() => {
    setIsLoading(true)

    Promise.all([
      fetch(
        `https://api.themoviedb.org/3/person/${location.state.person_id}/combined_credits?api_key=${process.env.REACT_APP_THEMOVIEDB_API}&language=en-US`
      ),
      fetch(
        `https://api.themoviedb.org/3/person/${location.state.person_id}?api_key=${process.env.REACT_APP_THEMOVIEDB_API}&language=en-US&append_to_response=videos,images`
      ),
    ])
      .then((responses) =>
        Promise.all(responses.map((response) => response.json()))
      )
      .then((data) => {
        console.log(data)
        setPersonKnownFor(data[0])
        setPersonDetails(data[1])
      })
      .finally(() => setIsLoading(false))
  }, [location])

  const backgroundStyle = {
    backgroundImage:
      personDetails.profile_path !== null ||
      personDetails.profile_path !== undefined
        ? `url(https://image.tmdb.org/t/p/w500/${personDetails.profile_path})`
        : `url(${noFace})`,
  }

  var currentTime = new Date()

  const in_cast_series = personKnownFor?.cast
    ?.sort((a, b) => (a.first_air_date < b.first_air_date ? 1 : -1))
    .filter(
      (cast) =>
        cast.media_type === "tv" &&
        !cast.character.includes("Self") &&
        !cast.character.includes("Herself") &&
        !cast.character.includes("Himself") &&
        cast.character !== ""
    )
    .map((cast) => {
      return (
        <div className="knownFor-content">
          <div
            onClick={() => goToShow(cast.id)}
            className="img-knownFor-container"
          >
            {cast.poster_path !== null ? (
              <img
                className="knownFor-img"
                src={`https://image.tmdb.org/t/p/w500/${cast.poster_path}`}
              />
            ) : (
              <img className="slider-no-img" src={noImg} alt="not-found" />
            )}
          </div>
          <div className="knownFor-info-wrapper">
            <p className="knownFor-title">{cast.name}</p>
            <p className="knownFor-character">{cast.character}</p>
            <p>
              {cast.episode_count}{" "}
              {cast.episode_count > 1 ? "episodes" : "episode"}
            </p>
          </div>
        </div>
      )
    })

  const in_crew_series = personKnownFor?.crew
    ?.sort((a, b) => (a.first_air_date < b.first_air_date ? 1 : -1))
    .filter((cast) => cast.media_type === "tv")
    .map((cast) => {
      return (
        <div className="knownFor-content">
          <div
            onClick={() => goToShow(cast.id)}
            className="img-knownFor-container"
          >
            {cast.poster_path !== null ? (
              <img
                className="knownFor-img"
                src={`https://image.tmdb.org/t/p/w500/${cast.poster_path}`}
              />
            ) : (
              <img className="slider-no-img" src={noImg} alt="not-found" />
            )}
          </div>
          <div className="knownFor-info-wrapper">
            <p className="knownFor-title">{cast.name}</p>
            <p>{cast.job}</p>
            {cast.episode_count && (
              <p>
                {cast.episode_count}{" "}
                {cast.episode_count > 1 ? "episodes" : "episode"}
              </p>
            )}
          </div>
        </div>
      )
    })

  const in_cast_movies = personKnownFor?.cast
    ?.sort((a, b) => (a.release_date < b.release_date ? 1 : -1))
    ?.filter((cast) => cast.media_type === "movie")
    .map((cast) => {
      return (
        <div className="knownFor-content">
          <div className="img-knownFor-container">
            <a
              href={`https://www.google.com/search?q=${cast.title}&oq=${cast.title}`}
              target="_blank"
            >
              {cast.poster_path !== null ? (
                <img
                  className="knownFor-img"
                  src={`https://image.tmdb.org/t/p/w500/${cast.poster_path}`}
                />
              ) : (
                <img className="slider-no-img" src={noImg} alt="not-found" />
              )}
            </a>
          </div>
          <div className="knownFor-info-wrapper">
            <p className="knownFor-title">{cast.title}</p>
            <p className="knownFor-character">{cast.character}</p>
          </div>
        </div>
      )
    })

  const in_crew_movies = personKnownFor?.crew
    ?.sort((a, b) => (a.release_date < b.release_date ? 1 : -1))
    ?.filter((cast) => cast.media_type === "movie")
    .map((cast) => {
      return (
        <div className="knownFor-content">
          <div className="img-knownFor-container">
            <a
              href={`https://www.google.com/search?q=${cast.title}&oq=${cast.title}`}
              target="_blank"
            >
              {cast.poster_path !== null ? (
                <img
                  className="knownFor-img"
                  src={`https://image.tmdb.org/t/p/w500/${cast.poster_path}`}
                />
              ) : (
                <img className="slider-no-img" src={noImg} alt="not-found" />
              )}
            </a>
          </div>
          <div className="knownFor-info-wrapper">
            <p className="knownFor-title">{cast.title}</p>
            <p>{cast.job}</p>
          </div>
        </div>
      )
    })

  return (
    <div>
      <Navbar isLoggedIn={isLoggedIn} />
      <div style={backgroundStyle} className="people-top-container">
        <div className="people-top-container-top">
          <div>
            {personDetails.profile_path !== null && !isLoading ? (
              <img
                className="people-img"
                src={`https://image.tmdb.org/t/p/w500/${personDetails.profile_path}`}
              />
            ) : (
              <img className="people-img" src={noFace} alt="not-found" />
            )}
          </div>
          {!isLoading && (
            <div>
              <h1>{personDetails.name}</h1>
              {personDetails.gender !== 0 && (
                <p>
                  {personDetails.gender === 1
                    ? "Female"
                    : personDetails.gender === 2
                    ? "Male"
                    : "Non-binary"}
                </p>
              )}
              {personDetails.birthday !== null && (
                <p>
                  {currentTime.getFullYear() -
                    personDetails.birthday?.split("-")[0]}{" "}
                  years old (
                  {`${personDetails.birthday?.split("-")[2]}-${
                    personDetails.birthday?.split("-")[1]
                  }-${personDetails.birthday?.split("-")[0]}`}
                  )
                </p>
              )}
              {personDetails.deathday !== null && (
                <p>
                  {`${personDetails.birthday?.split("-")[2]}-${
                    personDetails.birthday?.split("-")[1]
                  }-${personDetails.birthday?.split("-")[0]}`}{" "}
                  -{" "}
                  {`${personDetails.deathday?.split("-")[2]}-${
                    personDetails.deathday?.split("-")[1]
                  }-${personDetails.deathday?.split("-")[0]}`}{" "}
                  ({" "}
                  {personDetails.deathday?.split("-")[0] -
                    personDetails.birthday?.split("-")[0]}{" "}
                  years old )
                </p>
              )}
              <p>{personDetails.known_for_department}</p>
            </div>
          )}
        </div>
      </div>

      <div className="people-more-info-wrapper">
        {personDetails.biography !== "" && (
          <>
            <h1 className="people-section-title">Biography</h1>
            <p>{personDetails.biography}</p>
          </>
        )}

        <h1 className="people-section-title">Known for</h1>
        <div>
          {in_cast_series?.length > 0 && (
            <h2>Series ({in_cast_series?.length + in_crew_series?.length})</h2>
          )}
          {in_cast_series?.length > 0 && (
            <div className="knownFor-container">
              <p>IN CAST ({in_cast_series?.length})</p>
              <div className="known-cast">{in_cast_series}</div>
            </div>
          )}
          {in_crew_series?.length > 0 && (
            <div>
              <p>IN CREW ({in_crew_series?.length})</p>
              <div className="known-cast">{in_crew_series}</div>
            </div>
          )}
        </div>

        <div>
          {in_cast_movies?.length > 0 && (
            <h2>Movies ({in_cast_movies?.length + in_crew_movies?.length})</h2>
          )}
          {in_cast_movies?.length > 0 && (
            <div className="knownFor-container">
              <p>IN CAST ({in_cast_movies?.length})</p>
              <div className="known-cast">{in_cast_movies}</div>
            </div>
          )}
          {in_crew_movies?.length > 0 && (
            <div>
              <p>IN CREW ({in_crew_movies?.length})</p>
              <div className="known-cast">{in_crew_movies}</div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}
