import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  IconButton,
  useMediaQuery,
} from "@mui/material"
import React, { useContext, useEffect, useState } from "react"
import { LayoutContext } from "../../../components/Layout/Layout"
import apiCaller from "../../../Api/ApiCaller_NEW"
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded"
import ProfileEpisodes from "../ProfileEpisodes/ProfileEpisodes"
import { useTheme } from "@emotion/react"
import CloseRoundedIcon from "@mui/icons-material/CloseRounded"
import { ThreeDots } from "react-loader-spinner"

export default function History({
  openHistory,
  setOpenHistory,
  triggerRefresh,
  setTriggerRefresh,
}) {
  const [emptySection, setEmptySection] = useState(false)
  const [showsInfo, setShowsInfo] = useState([])
  const [seasonInfo, setSeasonInfo] = useState([])
  const [historyData, setHistoryData] = useState([])
  const user_id = localStorage.getItem("user_id")
  const [loading, setLoading] = useState(true)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const [disableActions, setDisableActions] = useState(false)

  const { setOpenSnackbar, setSnackbarMessage, setSnackbarSeverity } =
    useContext(LayoutContext)

  useEffect(() => {
    if (openHistory) {
      setLoading(true)
      setShowsInfo([])
      setHistoryData([]) // Reset history data initially

      apiCaller({
        url: `${process.env.REACT_APP_BACKEND_API_URL}/shows/history/${user_id}`,
        method: "GET",
        contentType: "application/json",
        body: null,
        calledFrom: `watchedHistory`,
        isResponseJSON: true,
        extras: null,
      })
        .then(async (data) => {
          if (data.length === 0) {
            setEmptySection(true)
            setLoading(false)
          }
          try {
            const newData = await Promise.all(
              data.map(async (show) => {
                const userShowInfo = await apiCaller({
                  url: `${process.env.REACT_APP_BACKEND_API_URL}/users/${user_id}/show-info/${show.show_id}`,
                  method: "GET",
                  contentType: "application/json",
                  body: null,
                  calledFrom: "userShowInfo",
                  isResponseJSON: true,
                  extras: null,
                })
                return { ...show, show_status: userShowInfo.show_status } // Merge show and userShowInfo
              })
            )
            setHistoryData(newData) // Update state after all data is collected
          } catch (error) {
            setOpenSnackbar(true)
            setSnackbarMessage(
              error.message ||
                "An error occurred while fetching user show info."
            )
            setSnackbarSeverity("error")
          }
        })
        .catch((error) => {
          setOpenSnackbar(true)
          setSnackbarSeverity("error")
          setSnackbarMessage(
            error.message || "An error occurred while fetching history data."
          )
        })
    }
  }, [openHistory])

  useEffect(() => {
    if (historyData.length === 0) return

    const fetchData = async () => {
      try {
        if (historyData.length === 0) {
          setEmptySection(true)
        } else {
          const results = await Promise.all(
            historyData
              ?.sort((a, b) => new Date(b.watched_at) - new Date(a.watched_at))
              .map((show) =>
                Promise.all([
                  apiCaller({
                    url: `${process.env.REACT_APP_THEMOVIEDB_URL}/tv/${show.show_id}?api_key=${process.env.REACT_APP_THEMOVIEDB_API}&language=en-US`,
                    method: "GET",
                    contentType: "application/json",
                    body: null,
                    calledFrom: "showInfo",
                    isResponseJSON: true,
                    extras: null,
                  }),
                  apiCaller({
                    url: `${process.env.REACT_APP_THEMOVIEDB_URL}/tv/${
                      show.show_id
                    }/season/${show.season_number + 1}?api_key=${
                      process.env.REACT_APP_THEMOVIEDB_API
                    }&language=en-US`,
                    method: "GET",
                    contentType: "application/json",
                    body: null,
                    calledFrom: "seasonInfo",
                    isResponseJSON: true,
                    extras: null,
                  }),
                ])
              )
          )

          const shows = results.map((res) => res[0])
          const seasons = results.map((res) => res[1] || null)

          setShowsInfo(shows)
          setSeasonInfo(seasons)
          setLoading(false)
        }
      } catch (error) {
        setOpenSnackbar(true)
        setSnackbarSeverity("error")
        setSnackbarMessage(
          error.message || "An error occurred while fetching additional data."
        )
      }
    }

    fetchData()
  }, [historyData])

  function handleMarkEpisodeAsNotWatched(
    showInfo,
    showId,
    seasonNumber,
    episodeNumber,
    index
  ) {
    setDisableActions(true)
    const isSeasonLastEpisode =
      seasonInfo[index].episodes.length === episodeNumber

    const data_to_post = {
      episode: episodeNumber,
      season: seasonNumber,
      episode_duration:
        seasonInfo[index].episodes[episodeNumber].runtime !== null
          ? seasonInfo[index].episodes[episodeNumber].runtime
          : 0,
    }

    let isFinishedShow = false

    if (
      seasonNumber === parseInt(showInfo.number_of_seasons) - 1 &&
      isSeasonLastEpisode
    ) {
      isFinishedShow = true
    }

    apiCaller({
      url: `${process.env.REACT_APP_BACKEND_API_URL}/shows/mark-episode-as-not-watched?user_id=${user_id}&show_id=${showId}&final_episode=${isFinishedShow}`,
      method: "POST",
      contentType: "application/json",
      body: JSON.stringify(data_to_post),
      calledFrom: "markEpisodeAsNotWatched",
      isResponseJSON: true,
      extras: null,
    })
      .then(() => {
        setTriggerRefresh(!triggerRefresh)
        setOpenHistory(false)
      })
      .catch((error) => {
        setOpenSnackbar(true)
        setSnackbarSeverity("error")
        setSnackbarMessage(error.message)
      })
  }

  return (
    <Dialog
      closeAfterTransition
      disablePortal
      disableScrollLock={true}
      open={openHistory}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle className={isMobile ? "profile-dialog-header-mobile" : ""}>
        Watched History
        <IconButton
          aria-label="close"
          onClick={() => setOpenHistory(false)}
          sx={(theme) => ({
            position: "absolute",
            right: 8,
            top: 12,
            color: theme.palette.grey[500],
          })}
        >
          <CloseRoundedIcon />
        </IconButton>
      </DialogTitle>
      <Divider />
      {!loading ? (
        <DialogContent
          className={isMobile ? "profile-dialog-content-mobile" : ""}
        >
          <div className="profile-sections-wrapper-history">
            <div className="profile-sections-container">
              <div className="profile-sections-history">
                {showsInfo.map((show, index) => (
                  <ProfileEpisodes
                    key={index}
                    showInfo={show}
                    seasonInfo={seasonInfo[index]}
                    seasonNumber={historyData[index].season_number}
                    episodeNumber={historyData[index].episode_number}
                    handleMarkAsWatched={() => null}
                    handleMarkEpisodeAsNotWatched={
                      handleMarkEpisodeAsNotWatched
                    }
                    index={index}
                    sectionType="history"
                    spinnerLoader={[]}
                    stoppedInfo={historyData[index]}
                    disableActions={disableActions}
                  />
                ))}
              </div>
            </div>
            {emptySection && historyData.length === 0 && (
              <div className="profile-empty-section">
                <AutoAwesomeRoundedIcon /> Your watched history is empty!
              </div>
            )}
          </div>
        </DialogContent>
      ) : (
        <DialogContent
          style={{
            display: "flex",
            justifyContent: "center",
          }}
          className={isMobile ? "profile-dialog-content-mobile" : ""}
        >
          <div
            style={{
              margin: "auto",
              width: "600px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "200px",
            }}
          >
            <ThreeDots color="black" height={50} width={50} />
          </div>
        </DialogContent>
      )}
      <DialogActions></DialogActions>
    </Dialog>
  )
}
