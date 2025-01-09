import React, { useContext, useEffect, useRef, useState } from "react"
import "./ShowSeasonsEpisodes.css"
import noImg from "../../../../images/no-image.png"
import TodayRoundedIcon from "@mui/icons-material/TodayRounded"
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded"
import dayjs from "dayjs"
import { Alert, Button, Chip, Skeleton, useMediaQuery } from "@mui/material"
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded"
import apiCaller from "../../../../Api/ApiCaller"
import { Grid } from "react-loader-spinner"
import { LayoutContext } from "../../../Layout/Layout"
import { useTheme } from "@emotion/react"

export default function ShowSeasonsEpisodes({
  showData,
  seasonNumber,
  setSeasonNumber,
  seasonInfo,
  userShowInfo,
  showInUserList,
  loadingEpisodes,
  setUserShowInfo,
}) {
  const divSeasonRef = useRef("")
  const zeroPad = (num, places) => String(num).padStart(places, "0")
  const user_id = localStorage.getItem("user_id")
  const [markingEpisodes, setMarkingEpisodes] = useState(false)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  const { setOpenSnackbar, setSnackbarMessage, setSnackbarSeverity } =
    useContext(LayoutContext)

  useEffect(() => {
    for (let i = 0; i < divSeasonRef.current.childNodes.length; i++) {
      divSeasonRef.current.childNodes[i].classList.remove("active")
    }
    divSeasonRef.current.childNodes[0].classList.add("active")
  }, [])

  let seasons = []
  for (let i = 1; i <= showData.number_of_seasons; i++) {
    seasons.push(
      <div
        key={i}
        id={i - 1}
        onClick={() => setSeasonNumber(i)}
        className={
          i === seasonNumber
            ? "show-single-season active"
            : "show-single-season"
        }
      >
        <span>{i}</span>
      </div>
    )
  }

  function defineDaysUntil(date) {
    if (dayjs(date).format("DD-MM-YYYY") === dayjs().format("DD-MM-YYYY")) {
      return "TODAY"
    }

    if (dayjs(date).diff(dayjs(), "day") > 0) {
      if (dayjs(date).diff(dayjs(), "day") > 1) {
        return `${dayjs(date).diff(dayjs(), "day")} Days`
      } else {
        return `${dayjs(date).diff(dayjs(), "day")} Day`
      }
    }

    if (dayjs(date).diff(dayjs(), "day") === 0) {
      return "1 Day"
    }
  }

  function defineIfToShowMarkAllSeasonEpisodes() {
    if (seasonNumber === userShowInfo?.season + 1) {
      if (userShowInfo.episode === 0) {
        return true
      }
    }
    return false
  }

  async function markAllSeasonEpisodesAsWatched() {
    setMarkingEpisodes(true) // Indicate the marking process has started
    let isSeasonLastEpisode = false
    let isFinishedShow = false

    for (const episode of seasonInfo.episodes) {
      isSeasonLastEpisode =
        seasonInfo.episodes.length === episode.episode_number

      const data_to_post = {
        episode: isSeasonLastEpisode ? 0 : episode.episode_number,
        season: isSeasonLastEpisode ? seasonNumber : seasonNumber - 1,
        episode_duration: episode.runtime !== null ? episode.runtime : 0,
      }

      isFinishedShow =
        seasonNumber === parseInt(showData.number_of_seasons) &&
        isSeasonLastEpisode

      try {
        // Wait for the API call to complete before proceeding
        await apiCaller({
          url: `${process.env.REACT_APP_BACKEND_API_URL}/shows/mark-episode-as-watched?user_id=${user_id}&show_id=${showData.id}&final_episode=${isFinishedShow}&is_season_last_episode=${isSeasonLastEpisode}`,
          method: "POST",
          contentType: "application/json",
          body: JSON.stringify(data_to_post),
          calledFrom: "markEpisodeAsWatched",
          isResponseJSON: true,
          extras: null,
        })
      } catch (error) {
        console.error("Error marking episode as watched:", error)
        setOpenSnackbar(true)
        setSnackbarSeverity("error")
        setSnackbarMessage(error.message)
        break
      }
    }

    setOpenSnackbar(true)
    setSnackbarSeverity("success")
    setSnackbarMessage(
      `All episodes in season ${seasonNumber} marked as watched!`
    )
    setMarkingEpisodes(false)
    if (!isFinishedShow) {
      setSeasonNumber(seasonNumber + 1)
    } else {
      setUserShowInfo([])
    }
  }

  useEffect(() => {
    if (markingEpisodes) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [markingEpisodes])

  if (loadingEpisodes && !markingEpisodes) {
    return (
      <div>
        <h1 className="show-details-titles">Seasons & Episodes</h1>

        <div className="show-seasons-episodes-container">
          <div className="show-episodes-container">
            <Skeleton
              sx={{ bgcolor: "grey.800", width: "100%", height: 150 }}
              variant="rounded"
            />

            <Skeleton
              sx={{ bgcolor: "grey.800", width: "100%", height: 150 }}
              variant="rounded"
            />

            <Skeleton
              sx={{ bgcolor: "grey.800", width: "100%", height: 150 }}
              variant="rounded"
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      {markingEpisodes && (
        <div className="show-seasons-episodes-marking-loader">
          <Grid
            visible={true}
            height="50"
            width="50"
            color="#f6900c"
            radius="12.5"
            wrapperStyle={{ marginBottom: "10px" }}
            wrapperClass="grid-wrapper"
          />
          <span style={{ fontWeight: "600" }}>
            Please wait! Marking season as watched...
          </span>
          <span>Do not refresh the page!</span>
        </div>
      )}
      <h1 className="show-details-titles">Seasons & Episodes</h1>

      <div className="show-seasons-episodes-container">
        <div ref={divSeasonRef} className="show-all-seasons">
          {seasons}
        </div>

        {showInUserList && defineIfToShowMarkAllSeasonEpisodes() && (
          <Button
            startIcon={<CheckCircleRoundedIcon />}
            variant="contained"
            size="small"
            color="primary"
            sx={{ width: "fit-content" }}
            onClick={markAllSeasonEpisodesAsWatched}
            disabled={markingEpisodes}
          >
            Mark Season as Watched
          </Button>
        )}

        <div className="show-episodes-container">
          {seasonInfo.episodes.length > 0 ? (
            seasonInfo.episodes.map((episode) => (
              <div
                key={episode.id}
                className="show-episode"
                onClick={() => setSeasonNumber(episode.season_number)}
              >
                <div className="show-episode-image-container">
                  {episode.still_path !== null ? (
                    <img
                      className="show-episode-img"
                      src={`https://image.tmdb.org/t/p/w500/${episode.still_path}`}
                      alt="episode-img"
                    />
                  ) : (
                    <img
                      className="show-episode-img"
                      src={noImg}
                      alt="no-img-found"
                    />
                  )}
                </div>

                <div className="show-episode-info-wrapper">
                  <div className="show-episode-info-container">
                    {(parseInt(episode.season_number) <
                      parseInt(userShowInfo.season + 1) ||
                      (parseInt(episode.season_number) ===
                        parseInt(userShowInfo.season + 1) &&
                        parseInt(episode.episode_number) <=
                          parseInt(userShowInfo.episode))) && (
                      <Chip
                        sx={{
                          width: "fit-content",
                          fontSize: isMobile ? "0.6rem" : "0.7rem",
                          fontWeight: "500",
                          height: "fit-content",
                          padding: "2px",
                        }}
                        icon={
                          <CheckCircleRoundedIcon
                            sx={{
                              fontSize: isMobile ? "0.9rem" : "1.2rem",
                            }}
                          />
                        }
                        label="WATCHED"
                      />
                    )}
                    <span className="show-episode-num ">
                      S{zeroPad(episode.season_number, 2)} | E
                      {zeroPad(episode.episode_number, 2)}
                    </span>

                    <div className="show-episode-more-info">
                      <span className="show-episode-info">
                        <TodayRoundedIcon
                          sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}
                        />
                        {episode.air_date !== null
                          ? dayjs(episode.air_date).format("DD-MM-YYYY")
                          : "Coming Soon"}
                      </span>
                      {episode.runtime !== null && (
                        <span className="episode-more-info">•</span>
                      )}
                      {episode.runtime !== null && (
                        <span className="show-episode-info">
                          <AccessTimeRoundedIcon
                            sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}
                          />
                          {episode.runtime}'
                        </span>
                      )}
                    </div>

                    <h3 className="show-episode-name">{episode.name}</h3>
                  </div>
                  <div className="show-episode-marker">
                    {/* TODO: if user is logged in and is watching this show, show a marker */}
                    <span
                      className={
                        dayjs(episode.air_date).diff(dayjs(), "day") === 0
                          ? "show-episode-daysUntil rainbow rainbow_text_animated"
                          : "show-episode-daysUntil"
                      }
                    >
                      {defineDaysUntil(episode.air_date)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <Alert severity="info">More episodes coming soon!</Alert>
          )}
        </div>
      </div>
    </div>
  )
}
