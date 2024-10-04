import React, { useState, useContext } from "react"
import { CoverContext } from "./ProfileCover"
import { Icon } from "@iconify/react"
import { db } from "../../services/firebase"
import def_cover from "../../images/def-cover.jpg"
import "./ProfileCoverSelection.css"

export default function ProfileCoverSelection(props) {
  const [showsImages, setShowsImages] = useState([])
  const [coverSelectionShowName, setCoverSelectionShowName] =
    useState("Edit your cover")
  const [coverImageSelected, setCoverImageSelected] = useState(false)
  const [hideShowsCoverSelection, setHideShowsCoverSelection] = useState(false)
  const [isFetching, setIsFetching] = useState(false)

  const {
    isSelectCoverOpen,
    setIsSelectCoverOpen,
    selectedCoverImage,
    setSelectedCoverImage,
  } = useContext(CoverContext)

  function fetchShowImages(show_id, show_name) {
    setIsFetching(true)
    const getShowsImages = async () => {
      return await fetch(
        `${process.env.REACT_APP_THEMOVIEDB_URL}/tv/${show_id}?api_key=${process.env.REACT_APP_THEMOVIEDB_API}&language=en-US&include_image_language=en,null&append_to_response=images`
      )
        .then((res) => res.json())
        .then((data) => {
          setShowsImages((prevImages) => {
            return [...prevImages, data.images.backdrops]
          })
        })
    }

    Promise.all([getShowsImages()])
      .then(() => {
        setIsFetching(false)
        setHideShowsCoverSelection(true)
        setCoverSelectionShowName(show_name)
      })
      .catch((error) => {
        console.log("Error fetching image data:", error)
      })
  }

  function goBackToSelectionCovers() {
    setHideShowsCoverSelection(false)
    setShowsImages([])
    setCoverSelectionShowName("Edit your cover")
  }

  function updateCoverImage() {
    db.collection("users")
      .doc(props.currentUser)
      .update({
        profile_cover_selection:
          localStorage.getItem("cover_temp_selection") !== null
            ? localStorage.getItem("cover_temp_selection")
            : selectedCoverImage,
      })

    setSelectedCoverImage(
      localStorage.getItem("cover_temp_selection") !== null
        ? localStorage.getItem("cover_temp_selection")
        : selectedCoverImage
    )

    setCoverImageSelected(false)
  }

  function updateCoverDefault() {
    setSelectedCoverImage(def_cover)
    setIsSelectCoverOpen(false)

    db.collection("users").doc(props.currentUser).update({
      profile_cover_selection: def_cover,
    })
  }

  function temporarySaveCoverSelection(image) {
    const fixed_image = image.replace("w500", "original")
    localStorage.setItem("cover_temp_selection", fixed_image)
    setCoverImageSelected(true)
  }

  function closeCoverSelector() {
    setCoverImageSelected(false)
    setIsSelectCoverOpen(false)
  }

  return (
    <div
      className={
        isSelectCoverOpen
          ? "coverSelection_container isShown"
          : "coverSelection_container"
      }
    >
      <div
        className={
          isSelectCoverOpen
            ? "coverSelector-wrapper showSelector"
            : "coverSelector-wrapper"
        }
      >
        <div className="coverTitle_div">
          {hideShowsCoverSelection === true && (
            <Icon
              icon="mingcute:arrow-left-fill"
              width={30}
              onClick={goBackToSelectionCovers}
              className="covers_back_icon"
            />
          )}
          <h1
            className={
              coverImageSelected && props.mobile
                ? "coverSection-title selectedImage"
                : "coverSection-title"
            }
          >
            {coverSelectionShowName}
          </h1>
          {coverImageSelected === true && (
            <p className="btn-save-changes-cover" onClick={updateCoverImage}>
              <Icon icon="dashicons:cloud-saved" width={20} /> Save Changes
            </p>
          )}
        </div>

        {hideShowsCoverSelection === false && (
          <h3
            className="showCoverName defaultSelection"
            onClick={updateCoverDefault}
          >
            <Icon icon="fluent-emoji-high-contrast:popcorn" width={45} />
            TVTime Default Cover
          </h3>
        )}
        {hideShowsCoverSelection === false &&
          props.userShowAllData.map((show, index) => {
            return (
              <div key={index}>
                <h3
                  className="showCoverName"
                  onClick={() => fetchShowImages(show.show_id, show.show_name)}
                >
                  <Icon icon="ic:baseline-local-movies" width={45} />
                  {show.show_name}
                </h3>
              </div>
            )
          })}

        {hideShowsCoverSelection === true && (
          <div className="showsAllCoverPhotos">
            {isFetching === false ? (
              showsImages.map((img) => {
                return img
                  .filter((img) => img.height >= 720)
                  .map((image) => {
                    return (
                      <img
                        className="cover-img-preview"
                        src={`https://image.tmdb.org/t/p/w500/${image.file_path}`}
                        alt="shows-images"
                        onClick={() =>
                          temporarySaveCoverSelection(
                            `https://image.tmdb.org/t/p/w500/${image.file_path}`
                          )
                        }
                      />
                    )
                  })
              })
            ) : (
              <h1>Loading...</h1>
            )}
          </div>
        )}
      </div>

      <div
        className={
          isSelectCoverOpen
            ? "closeButton_covers_div showBtn"
            : "closeButton_covers_div"
        }
      >
        <button className="closeButton_covers" onClick={closeCoverSelector}>
          X
        </button>
      </div>
    </div>
  )
}
