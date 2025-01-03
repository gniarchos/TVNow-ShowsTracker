import { useTheme } from "@emotion/react"
import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  useMediaQuery,
} from "@mui/material"
import React, { useEffect, useState } from "react"
import CloseRoundedIcon from "@mui/icons-material/CloseRounded"
import apiCaller from "../../../Api/ApiCaller"
import "./ProfileCoverSelector.css"
import { ThreeDots } from "react-loader-spinner"
import KeyboardBackspaceRoundedIcon from "@mui/icons-material/KeyboardBackspaceRounded"

export default function ProfileCoverSelector({
  openCoverSelection,
  setOpenCoverSelection,
  allUserShows,
}) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const [showImages, setShowImages] = useState([])
  const [selectedShow, setSelectedShow] = useState(null)
  const [selectedShowImages, setSelectedShowImages] = useState([])
  const [selectedCover, setSelectedCover] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (openCoverSelection) {
      setShowImages([])
      setLoading(true)

      const promises = allUserShows.map((show) => {
        const show_id = show.show_id
        return apiCaller({
          url: `${process.env.REACT_APP_THEMOVIEDB_URL}/tv/${show_id}?api_key=${process.env.REACT_APP_THEMOVIEDB_API}&language=en-US&include_image_language=en,null&append_to_response=images`,
          method: "GET",
          contentType: "application/x-www-form-urlencoded",
          body: null,
          calledFrom: "showsImages",
          isResponseJSON: true,
          extras: null,
        })
          .then((response) => {
            return response.images?.backdrops || null // Return backdrops or null
          })
          .catch((error) => {
            console.error("Error fetching image data:", error)
            return null // Return null for failed requests
          })
      })

      Promise.all(promises)
        .then((images) => {
          setShowImages(images) // Update all at once
          setLoading(false)
        })
        .catch((error) => {
          console.error("Error processing promises:", error)
          setLoading(false)
        })
    }
  }, [openCoverSelection])

  function handleSaveUserCover(type) {
    setLoading(true)
    apiCaller({
      url: `${process.env.REACT_APP_BACKEND_API_URL}/users/update-user-cover`,
      method: "PUT",
      contentType: "application/json",
      body: JSON.stringify({
        user_id: localStorage.getItem("user_id"),
        cover: type === "newCover" ? selectedCover : null,
      }),
      calledFrom: "register",
      isResponseJSON: true,
      extras: null,
    })
      .then(() => {
        setLoading(false)
        setOpenCoverSelection(false)
        if (type === "newCover") {
          localStorage.setItem(
            "userProfileCover",
            JSON.stringify(selectedCover)
          )
        } else {
          localStorage.removeItem("userProfileCover")
        }
      })
      .catch((error) => {
        console.log("Error fetching image data:", error)
      })
  }

  return (
    <Dialog
      closeAfterTransition
      disablePortal
      disableScrollLock={true}
      open={openCoverSelection}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle className={isMobile ? "profile-dialog-header-mobile" : ""}>
        Profile Cover Selection
        <IconButton
          aria-label="close"
          onClick={() => setOpenCoverSelection(false)}
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
        <DialogContent sx={{ overflowX: "hidden" }}>
          <div
            style={{ height: selectedShow === null ? "auto" : "60px" }}
            className="profile-cover-selector-header"
          >
            {selectedShow !== null && (
              <Button
                size="small"
                variant="contained"
                color="primaryFaded"
                onClick={() => setSelectedShow(null)}
                startIcon={<KeyboardBackspaceRoundedIcon />}
              >
                Back
              </Button>
            )}

            {selectedShow === null ? (
              <span>Select a show to view its covers:</span>
            ) : (
              <Chip label={selectedShow?.title} />
            )}
          </div>

          {selectedShow === null ? (
            <div className="profile-cover-selector-container">
              {showImages.map((image, index) => {
                if (!image || image.length === 0) {
                  return null // Skip empty image entries
                }

                return (
                  <div
                    key={index}
                    className="profile-cover-selector-image-container"
                    onClick={() => {
                      setSelectedShow(allUserShows[index])
                      setSelectedShowImages(image)
                    }}
                  >
                    <img
                      className="profile-cover-selector-image"
                      src={`https://image.tmdb.org/t/p/original/${image[0].file_path}`}
                      alt="show"
                    />
                    <p className="profile-cover-selector-image-title">
                      {allUserShows[index].title}
                    </p>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="profile-cover-selector-container">
              {selectedShowImages.map((image, index) => {
                if (image.length === 0) {
                  return <p>No Covers Found</p>
                }

                return (
                  <div
                    key={index}
                    className="profile-cover-selector-image-container singleCover"
                    onClick={() => {
                      setSelectedCover(image.file_path)
                    }}
                  >
                    <img
                      alt="cover_img"
                      className="profile-cover-selector-image"
                      src={`https://image.tmdb.org/t/p/original/${image.file_path}`}
                      loading="lazy"
                    />
                  </div>
                )
              })}
            </div>
          )}
        </DialogContent>
      ) : (
        <div
          style={{
            margin: "auto",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "200px",
          }}
        >
          <ThreeDots color="black" height={50} width={50} />
        </div>
      )}
      <DialogActions>
        <Button
          variant="contained"
          color={"success"}
          size="small"
          disabled={selectedCover === null || loading}
          onClick={() => handleSaveUserCover("newCover")}
        >
          Confirm Changes
        </Button>

        <Button
          variant="contained"
          color="warning"
          size="small"
          disabled={loading}
          onClick={() => handleSaveUserCover("defaultCover")}
        >
          Reset to Default
        </Button>
      </DialogActions>
    </Dialog>
  )
}
