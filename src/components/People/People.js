import React from "react"
import { Link, useSearchParams, useNavigate } from "react-router-dom"
import "./People.css"
import noImg from "../../images/no-image.png"
import noFace from "../../images/no-face.png"
import PuffLoader from "react-spinners/PuffLoader"

export default function People() {
  const [personDetails, setPersonDetails] = React.useState([])

  const [personKnownFor, setPersonKnownFor] = React.useState([])
  const [isLoading, setIsLoading] = React.useState(true)

  const [searchParams, setSearchParams] = useSearchParams()
  const param_person_name = searchParams.get("person_name")
  const param_person_id = searchParams.get("person_id")

  document.title = `TVTime | ${param_person_name}`

  const navigate = useNavigate()
  if (
    param_person_name === "" ||
    param_person_name === null ||
    param_person_id === "" ||
    param_person_id === null
  ) {
    navigate("/error404")
  }

  React.useEffect(() => {
    window.scrollTo(0, 0)

    setIsLoading(true)

    const fetchPersonDetails = async () => {
      return await fetch(
        `https://api.themoviedb.org/3/person/${param_person_id}?api_key=${process.env.REACT_APP_THEMOVIEDB_API}&language=en-US&append_to_response=videos,images`
      )
        .then((res) => res.json())
        .then((data) => {
          setPersonDetails(data)
        })
    }

    const fetchPersonKnownFor = async () => {
      return await fetch(
        `https://api.themoviedb.org/3/person/${param_person_id}/combined_credits?api_key=${process.env.REACT_APP_THEMOVIEDB_API}&language=en-US`
      )
        .then((res) => res.json())
        .then((data) => {
          setPersonKnownFor(data)
        })
    }

    Promise.all([fetchPersonDetails(), fetchPersonKnownFor()])
      .then(() =>
        // console.log("All data is fetched.")
        setIsLoading(false)
      )
      .catch((error) => {
        console.log("Error fetching data:", error)
      })
  }, [searchParams])

  const backgroundStyle = {
    backgroundImage:
      personDetails.profile_path !== null &&
      personDetails.profile_path !== undefined
        ? `url(https://image.tmdb.org/t/p/w500/${personDetails.profile_path})`
        : `url(${noFace})`,
  }

  var currentTime = new Date()

  let in_cast_series = personKnownFor?.cast
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
          <Link
            to={`/show?show_name=${cast.name}&show_id=${cast.id}`}
            className="img-knownFor-container"
          >
            {cast.poster_path !== null ? (
              <img
                className="knownFor-img"
                src={`https://image.tmdb.org/t/p/w500/${cast.poster_path}`}
              />
            ) : (
              <img
                className="people-no-media-img"
                src={noImg}
                alt="not-found"
              />
            )}
          </Link>
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
          <Link
            to={`/show?show_name=${cast.name}&show_id=${cast.id}`}
            className="img-knownFor-container"
          >
            {cast.poster_path !== null ? (
              <img
                className="knownFor-img"
                src={`https://image.tmdb.org/t/p/w500/${cast.poster_path}`}
              />
            ) : (
              <img
                className="people-no-media-img"
                src={noImg}
                alt="not-found"
              />
            )}
          </Link>
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
                <img
                  className="people-no-media-img"
                  src={noImg}
                  alt="not-found"
                />
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
                <img
                  className="people-no-media-img"
                  src={noImg}
                  alt="not-found"
                />
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

  if (isLoading) {
    return (
      <div className="spinner-div-home">
        <PuffLoader color={"white"} size={100} />
        <h3>Reloading Data...</h3>
      </div>
    )
  }

  return (
    <div className="people-wrapper">
      <div style={backgroundStyle} className="people-top-container">
        <div className="people-top-container-top">
          <div>
            {personDetails.profile_path !== null ? (
              <img
                className="people-img"
                src={`https://image.tmdb.org/t/p/w500/${personDetails.profile_path}`}
              />
            ) : (
              <img className="people-img" src={noFace} alt="not-found" />
            )}
          </div>

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
        </div>
      </div>

      <div className="people-more-info-wrapper">
        {personDetails.biography !== "" && (
          <>
            <h1 className="people-section-title">Biography</h1>
            <p>{personDetails.biography}</p>
          </>
        )}

        {in_cast_series?.length > 0 ||
        in_crew_series?.length > 0 ||
        in_cast_movies?.length > 0 ||
        in_crew_movies?.length > 0 ? (
          <h1 className="people-section-title">Known for</h1>
        ) : (
          <h2 className="people-section-title no-other-content">
            Sorry, there is no more available data for {param_person_name}
          </h2>
        )}

        {(in_cast_series?.length > 0 || in_crew_series?.length > 0) &&
          personKnownFor !== null && (
            <div>
              <h2>
                Series ({in_cast_series?.length + in_crew_series?.length})
              </h2>

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
          )}

        {(in_cast_movies?.length > 0 || in_crew_movies?.length > 0) &&
          personKnownFor !== null && (
            <div>
              <h2>
                Movies ({in_cast_movies?.length + in_crew_movies?.length})
              </h2>

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
          )}
      </div>
    </div>
  )
}
