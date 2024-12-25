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

export default function History({ openHistory, setOpenHistory }) {
  const [emptySection, setEmptySection] = useState(false)
  const [showsInfo, setShowsInfo] = useState([])
  const [seasonInfo, setSeasonInfo] = useState([])
  const [historyData, setHistoryData] = useState([])
  const user_id = localStorage.getItem("user_id")
  const [loading, setLoading] = useState(true)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  const { setOpenSnackbar, setSnackbarMessage, setSnackbarSeverity } =
    useContext(LayoutContext)

  useEffect(() => {
    if (openHistory) {
      setLoading(true)
      setShowsInfo([])

      apiCaller({
        url: `${process.env.REACT_APP_BACKEND_API_URL}/shows/history/${user_id}`,
        method: "GET",
        contentType: "application/json",
        body: null,
        calledFrom: `watchedHistory`,
        isResponseJSON: true,
        extras: null,
      })
        .then((data) => {
          setHistoryData(data)
        })
        .catch((error) => {
          setOpenSnackbar(true)
          setSnackbarSeverity("error")
          setSnackbarMessage(error.message)
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

          const seasons = results.map((res) => {
            if (res[1] !== undefined) {
              return res[1]
            } else {
              return null
            }
          })

          setShowsInfo(shows)
          setSeasonInfo(seasons)
          setLoading(false)
        }
      } catch (error) {
        setOpenSnackbar(true)
        setSnackbarSeverity("error")
        setSnackbarMessage(error.message)
      }
    }

    fetchData()
  }, [historyData])

  return (
    <Dialog
      closeAfterTransition
      disablePortal
      disableScrollLock={true}
      open={openHistory}
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
          <DialogContentText id="alert-dialog-description">
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
                      index={index}
                      sectionType="history"
                      spinnerLoader={[]}
                      stoppedInfo={historyData[index]}
                    />
                  ))}
                </div>
              </div>
              {emptySection && (
                <div className="profile-empty-section">
                  <AutoAwesomeRoundedIcon /> You have no stopped shows
                </div>
              )}
            </div>
          </DialogContentText>
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
