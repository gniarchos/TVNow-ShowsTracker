import React, { useContext, useEffect, useState } from "react"
import apiCaller from "../../Api/ApiCaller_NEW"
import { LayoutContext } from "../Layout/Layout"
import { useLocation, useNavigate, useSearchParams } from "react-router-dom"
import "./Person.css"
import { Button, Chip, Divider } from "@mui/material"
import Loader from "../Other/Loader/Loader"
import noFace from "../../images/no-face.png"
import dayjs from "dayjs"
import { FaImdb } from "react-icons/fa"
import ShowMovieCard from "./ShowMovieCard"

export default function Person() {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()
  //   const param_person_name = searchParams.get("person_name")
  const param_person_id = searchParams.get("person_id")
  const [activeTab, setActiveTab] = useState(0)

  const [personInfo, setPersonInfo] = useState([])
  const [personKnownFor, setPersonKnownFor] = useState([])
  const [loading, setLoading] = useState(true)
  const { setOpenSnackbar, setSnackbarMessage, setSnackbarSeverity } =
    useContext(LayoutContext)

  useEffect(() => {
    setLoading(true)
    Promise.all([
      apiCaller({
        url: `${process.env.REACT_APP_THEMOVIEDB_URL}/person/${param_person_id}?api_key=${process.env.REACT_APP_THEMOVIEDB_API}&language=en-US&append_to_response=videos,images`,
        method: "GET",
        contentType: "application/json",
        body: null,
        calledFrom: "personInfo",
        isResponseJSON: true,
        extras: null,
      }),
      apiCaller({
        url: `${process.env.REACT_APP_THEMOVIEDB_URL}/person/${param_person_id}/combined_credits?api_key=${process.env.REACT_APP_THEMOVIEDB_API}&language=en-US`,
        method: "GET",
        contentType: "application/json",
        body: null,
        calledFrom: "personKnownFor",
        isResponseJSON: true,
        extras: null,
      }),
    ])
      .then((data) => {
        setPersonInfo(data[0])
        setPersonKnownFor(data[1])
        setLoading(false)
      })
      .catch((error) => {
        setOpenSnackbar(true)
        setSnackbarMessage(error.message)
        setSnackbarSeverity("error")
      })
  }, [location])

  function defineGender(gender) {
    if (gender === 1) {
      return "Female"
    } else if (gender === 2) {
      return "Male"
    } else if (gender === 3) {
      return "Non-binary"
    } else {
      return "Unknown"
    }
  }

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
      return <ShowMovieCard info={cast} series={true} crew={false} />
    })

  let in_crew_series = personKnownFor?.crew
    ?.sort((a, b) => (a.first_air_date < b.first_air_date ? 1 : -1))
    .filter((crew) => crew.media_type === "tv")
    .map((crew) => {
      return <ShowMovieCard info={crew} series={true} crew={true} />
    })

  let in_cast_movies = personKnownFor?.cast
    ?.sort((a, b) => (a.release_date < b.release_date ? 1 : -1))
    ?.filter((cast) => cast.media_type === "movie")
    .map((cast) => {
      return <ShowMovieCard info={cast} series={false} crew={false} />
    })

  let in_crew_movies = personKnownFor?.crew
    ?.sort((a, b) => (a.release_date < b.release_date ? 1 : -1))
    ?.filter((cast) => cast.media_type === "movie")
    .map((cast) => {
      return <ShowMovieCard info={cast} series={false} crew={true} />
    })

  useEffect(() => {
    if (in_cast_series?.length + in_crew_series?.length === 0) {
      setActiveTab(1)
      return
    }

    if (in_cast_movies?.length + in_crew_movies?.length === 0) {
      setActiveTab(0)
      return
    }

    if (
      in_cast_series?.length +
        in_crew_series?.length +
        in_cast_movies?.length +
        in_crew_movies?.length ===
      0
    ) {
      setActiveTab(2)
      return
    }
  }, [in_cast_series, in_crew_series, in_cast_movies, in_crew_movies])

  if (loading) {
    return <Loader />
  }

  return (
    <div className="person-wrapper">
      <div className="person-general-info">
        <div className="person-img-container">
          {personInfo.profile_path !== null ? (
            <img
              className="person-img"
              src={`https://image.tmdb.org/t/p/w500/${personInfo.profile_path}`}
            />
          ) : (
            <img className="person-img" src={noFace} alt="not-found" />
          )}

          <a
            className="person-imdb-link"
            href={`https://www.imdb.com/name/${personInfo.imdb_id}`}
            target="_blank"
          >
            <FaImdb />{" "}
          </a>
        </div>

        <div className="person-details-content">
          <div className="person-details-container">
            <span className="person-name">{personInfo.name}</span>
            <div className="person-details-row">
              <span>{defineGender(personInfo.gender)}</span> &bull;
              <span>{personInfo.known_for_department}</span>
            </div>

            {personInfo.birthday !== null && (
              <span className="person-birthday">
                {dayjs().diff(personInfo.birthday, "year")} years old
              </span>
            )}
          </div>

          <div className="person-details-container">
            <table>
              <tbody>
                <tr>
                  <th style={{ textAlign: "right" }}>Birthday</th>
                  <td style={{ textAlign: "left", paddingLeft: "10px" }}>
                    {personInfo.birthday !== null
                      ? dayjs(personInfo.birthday).format("DD-MM-YYYY")
                      : "Unknown"}
                  </td>
                </tr>
                <tr>
                  <th style={{ textAlign: "right" }}>Place of Birth</th>
                  <td style={{ textAlign: "left", paddingLeft: "10px" }}>
                    {personInfo.place_of_birth !== null
                      ? personInfo.place_of_birth
                      : "Unknown"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Divider color="white" flexItem orientation="vertical" />
      <div className="person-detailed-info">
        {personInfo.biography !== "" && (
          <div>
            <h1 className="person-section-title">Biography</h1>
            <span>{personInfo.biography}</span>
          </div>
        )}

        <div>
          <h1 className="person-section-title">Known for</h1>
          <div className="person-known-for-wrapper">
            <div className="person-known-for-buttons">
              <Button
                variant="contained"
                onClick={() => setActiveTab(0)}
                color={activeTab === 0 ? "primary" : "primaryFaded"}
                disabled={
                  in_cast_series?.length === 0 && in_crew_series?.length === 0
                }
              >
                TV Shows ({in_cast_series?.length + in_crew_series?.length})
              </Button>
              <Button
                variant="contained"
                onClick={() => setActiveTab(1)}
                color={activeTab === 1 ? "primary" : "primaryFaded"}
              >
                Movies ({in_cast_movies?.length + in_crew_movies?.length})
              </Button>
            </div>

            {activeTab === 0 ? (
              <div className="person-known-for-wrapper">
                {in_cast_series?.length > 0 && (
                  <>
                    <Chip
                      sx={{ width: "200px" }}
                      color="primaryFaded"
                      label={`Series Cast (${in_cast_series?.length})`}
                    />
                    <div className="person-known-for-content">
                      {in_cast_series}
                    </div>
                  </>
                )}

                {in_crew_series?.length > 0 && (
                  <>
                    <Chip
                      sx={{ width: "200px" }}
                      color="primaryFaded"
                      label={`Series Crew (${in_crew_series?.length})`}
                    />
                    <div className="person-known-for-content">
                      {in_crew_series}
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="person-known-for-wrapper">
                {in_cast_movies?.length > 0 && (
                  <>
                    <Chip
                      sx={{ width: "200px" }}
                      color="primaryFaded"
                      label={`Movies Cast (${in_cast_movies?.length})`}
                    />
                    <div className="person-known-for-content">
                      {in_cast_movies}
                    </div>
                  </>
                )}

                {in_crew_movies?.length > 0 && (
                  <>
                    <Chip
                      sx={{ width: "200px" }}
                      color="primaryFaded"
                      label={`Movies Crew (${in_crew_movies?.length})`}
                    />
                    <div className="person-known-for-content">
                      {in_crew_movies}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
