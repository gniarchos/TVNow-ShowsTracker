import { useState, useEffect, useMemo, lazy } from "react"
import "./ShowDetailedInfoContainer.css"
import YouTube from "react-youtube"
import { Link } from "react-router-dom"
import noImg from "../../../images/no-image.png"
import YoutubeVideos from "./YoutubeVideos"

const DetailedSeasonsEpisodes = lazy(() => import("./DetailedSeasonsEpisodes"))
const DetailedShowCast = lazy(() => import("./DetailedShowCast"))

export default function ShowDetailedInfoContainer(props) {
  const [videoIsSelected, setVideoIsSelected] = useState(false)
  const [showVideos, setShowVideos] = useState([])
  const [youtubeKey, setYoutubeKey] = useState()
  const [youtubeId, setYoutubeId] = useState()
  const [moreVideosAvailable, setMoreVideosAvailable] = useState(false)

  const memoVideosData = useMemo(
    () => ({
      showVideos,
      youtubeKey,
      youtubeId,
    }),
    [showVideos]
  )

  useEffect(() => {
    const fetchVideos = async () => {
      setShowVideos([])
      for (let i = 1; i <= props.showData.number_of_seasons; i++) {
        const response = await fetch(
          `${process.env.REACT_APP_THEMOVIEDB_URL}/tv/${props.show_id}/season/${i}/videos?api_key=${process.env.REACT_APP_THEMOVIEDB_API}&language=en-US`
        )
        const data = await response.json()
        setShowVideos((prevData) => [...prevData, data.results])
      }
    }

    const findTrailer = () => {
      let trailerIndex = 0
      let foundTrailer = false

      props.showData.videos?.results.some((res, index) => {
        if (res.name.includes("Trailer")) {
          trailerIndex = index
          foundTrailer = true

          setYoutubeId(props.showData.videos?.results[trailerIndex].id)
          setYoutubeKey(props.showData.videos?.results[trailerIndex].key)
          setVideoIsSelected(true)
        }
      })

      if (!foundTrailer) {
        props.showData.videos?.results.some((res, index) => {
          if (res.name.includes("Teaser")) {
            trailerIndex = index
            foundTrailer = true

            setYoutubeId(props.showData.videos?.results[trailerIndex].id)
            setYoutubeKey(props.showData.videos?.results[trailerIndex].key)
            setVideoIsSelected(true)
          }
        })
      }
    }

    fetchVideos()
    // fetchUserData()
    findTrailer()
  }, [])

  useEffect(() => {
    for (let i = 0; i < props.showData.number_of_seasons; i++) {
      if (memoVideosData.showVideos[i]?.length > 0) {
        setMoreVideosAvailable(true)
        break
      }
    }
  }, [memoVideosData.showVideos])

  const recommending = props.showData.recommendations?.results
    .slice(0, 10)
    .map((recommend) => {
      return (
        <Link
          key={recommend.id}
          to={`/show?show_name=${recommend.name}&show_id=${recommend.id}`}
          className="recommending-show"
        >
          <div className="img-recommend-container">
            {recommend.backdrop_path !== null ? (
              <img
                className="recommending-img"
                src={`https://image.tmdb.org/t/p/w500/${recommend.backdrop_path}`}
                alt="show-recommendation"
              />
            ) : (
              <img className="recommending-noImg" src={noImg} alt="not-found" />
            )}
          </div>
          <h3 className="recommending-title-name">{recommend.name}</h3>
        </Link>
      )
    })

  const opts = {
    height: props.isMobile ? "200px" : "600px",
    width: "100%",
    playerVars: {
      modestbranding: 1,
      disablekb: 1,
    },
  }

  function changeYoutubeVideo(key, id) {
    setVideoIsSelected(true)
    setYoutubeKey(key)
    setYoutubeId(id)
  }

  return (
    <div className="all-data-div">
      <div className="synopsis-div">
        {props.showData.overview !== "" && <h1>Storyline</h1>}
        {props.showData.overview !== "" && (
          <p className="synopsis-text">{props.showData.overview}</p>
        )}
        {props.showData.videos?.results?.length > 0 && videoIsSelected && (
          <YouTube
            containerClassName={"youtube-container amru"}
            videoId={youtubeKey}
            id={youtubeId}
            opts={opts}
            className="youtube-trailer"
          />
        )}

        {moreVideosAvailable && (
          <YoutubeVideos
            isMobile={props.isMobile}
            changeVideo={changeYoutubeVideo}
            data={memoVideosData.showVideos}
          />
        )}
      </div>

      <DetailedSeasonsEpisodes
        showUserStatus={props.showUserStatus}
        showData={props.showData}
        currentUser={props.currentUser}
        show_id={props.show_id}
      />

      <DetailedShowCast showData={props.showData} />

      {recommending?.length > 0 && (
        <div className="recommend-wrapper">
          <h1>More like this</h1>
          <div className="recommend-container">{recommending}</div>
        </div>
      )}
    </div>
  )
}
