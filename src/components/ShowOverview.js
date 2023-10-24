import { useEffect, useState, useRef, useMemo } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import Navbar from "./Navbar"
import "./ShowOverview.css"
import { nanoid } from "nanoid"
import { Icon } from "@iconify/react"
import YouTube from "react-youtube"
import Footer from "./Footer"
import noImg from "../images/no-image.png"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { db } from "../services/firebase"
import { useAuth } from "../authentication/AuthContext"
import ShowEpisodes from "./ShowEpisodes"
import trakt_logo from "../images/trakt-icon-red-white.png"
import YoutubeVideos from "./YoutubeVideos"
import ScrollToTop from "./ScrollToTop"

export default function ShowOverview() {
  const location = useLocation()

  const isLoggedIn = true
  const show = location.state.data

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location])

  document.title = `TVTime | ${show.name}`

  const [seasonNumber, setSeasonNumber] = useState("1")
  const [seasonDetails, setSeasonDetails] = useState([])
  const [finished, setFinished] = useState(false)
  const [showDaysUntil, setShowDaysUntil] = useState(false)
  const navigate = useNavigate()
  const [toggleFullCast, setToggleFullCast] = useState(false)
  const { currentUser } = useAuth()
  const [isShowAddedInWatchList, setIsShowAddedInWatchList] = useState(false)
  const [showUserStatus, setShowUserStatus] = useState([""])
  const [imdbRating, setImdbRating] = useState(0.0)
  const [rottenTomatoesRating, setRottenTomatoesRating] = useState(0)
  const [traktRating, setTraktRating] = useState(0)
  const [mobile, setMobile] = useState(window.innerWidth <= 499)
  const [seasonRuntimeData, setSeasonRuntimeData] = useState([])
  const [userWatchingTime, setUserWatchingTime] = useState(0)
  const [userWatchedEpisodes, setUserWatchedEpisodes] = useState(0)
  const [isMarkSeasonClicked, setIsMarkSeasonClicked] = useState(false)
  const [currentUserEpisode, setCurrentUserEpisode] = useState(0)
  const [currentUserSeason, setCurrentUserSeason] = useState(1)
  const [seasonUntilReleasedEpisode, setSeasonUntilReleasedEpisode] = useState(
    []
  )
  const [streamServicesAvailable, setStreamServicesAvailable] = useState([
    {
      service: "",
      streamingType: "",
      link: "",
    },
  ])
  const [selectedSeasonData, setSelectedSeasonData] = useState()
  const [semiReleasedSeason, setSemiReleasedSeason] = useState(false)
  const [showVideos, setShowVideos] = useState([])
  const [youtubeKey, setYoutubeKey] = useState()
  const [youtubeId, setYoutubeId] = useState()
  const [moreVideosAvailable, setMoreVideosAvailable] = useState(false)
  const [videoIsSelected, setVideoIsSelected] = useState(false)
  const divSeasonRef = useRef("")

  const memoShowData = useMemo(
    () => ({
      show,
    }),
    [show]
  )

  const memoVideosData = useMemo(
    () => ({
      showVideos,
      youtubeKey,
      youtubeId,
    }),
    [showVideos]
  )

  const handleWindowSizeChange = () => {
    setMobile(window.innerWidth <= 499)
  }

  useEffect(() => {
    const fetchVideos = async () => {
      setShowVideos([])
      for (let i = 1; i <= memoShowData.show.number_of_seasons; i++) {
        const response = await fetch(
          `https://api.themoviedb.org/3/tv/${memoShowData.show.id}/season/${i}/videos?api_key=${process.env.REACT_APP_THEMOVIEDB_API}&language=en-US`
        )
        const data = await response.json()
        setShowVideos((prevData) => [...prevData, data.results])
      }
    }

    const fetchUserData = async () => {
      const userSnapshot = await db
        .collection("users")
        .doc(location.state.userId)
        .get()
      setUserWatchingTime(userSnapshot.data().watching_time)
      setUserWatchedEpisodes(userSnapshot.data().total_episodes)
    }

    const findTrailer = () => {
      let trailerIndex = 0
      let foundTrailer = false

      memoShowData.show.videos.results.some((res, index) => {
        if (res.name.includes("Trailer")) {
          trailerIndex = index
          foundTrailer = true

          setYoutubeId(memoShowData.show.videos.results[trailerIndex].id)
          setYoutubeKey(memoShowData.show.videos.results[trailerIndex].key)
          setVideoIsSelected(true)
        }
      })

      if (!foundTrailer) {
        memoShowData.show.videos.results.some((res, index) => {
          if (res.name.includes("Teaser")) {
            trailerIndex = index
            foundTrailer = true

            setYoutubeId(memoShowData.show.videos.results[trailerIndex].id)
            setYoutubeKey(memoShowData.show.videos.results[trailerIndex].key)
            setVideoIsSelected(true)
          }
        })
      }
    }

    fetchVideos()
    fetchUserData()
    findTrailer()

    window.addEventListener("resize", handleWindowSizeChange)
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange)
    }
  }, [memoShowData.show])

  useEffect(() => {
    for (let i = 0; i < memoShowData.show.number_of_seasons; i++) {
      if (memoVideosData.showVideos[i]?.length > 0) {
        setMoreVideosAvailable(true)
        break
      }
    }
  }, [memoVideosData.showVideos])

  useEffect(() => {
    localStorage.setItem("watching_time", userWatchingTime)

    localStorage.setItem("total_episodes", userWatchedEpisodes)
  }, [userWatchingTime, userWatchedEpisodes])

  useEffect(() => {
    setIsShowAddedInWatchList(false)
    db.collection(`watchlist-${location.state.userId}`)
      .where("show_name", "==", memoShowData.show.name)
      .get()
      .then((querySnapshot) => {
        if (!querySnapshot.empty) {
          setIsShowAddedInWatchList(true)
        }
      })

    db.collection(`watchlist-${location.state.userId}`)
      .where("show_name", "==", memoShowData.show.name)
      .onSnapshot((snapshot) => {
        setShowUserStatus(
          snapshot.docs.map((doc) => ({
            status: doc.data().status,
          }))
        )
      })

    for (let i = 0; i < divSeasonRef.current.childNodes.length; i++) {
      divSeasonRef.current.childNodes[i].classList.remove("active")
    }
    divSeasonRef.current.childNodes[0].classList.add("active")

    setSeasonNumber("1")
    setFinished(false)
  }, [memoShowData.show, isShowAddedInWatchList])

  useEffect(() => {
    var total_season_time = 0
    if (isMarkSeasonClicked) {
      seasonRuntimeData?.forEach((time) => {
        total_season_time += time
        localStorage.setItem(
          "watching_time",
          parseInt(localStorage.getItem("watching_time")) + time
        )
      })

      localStorage.setItem(
        "total_episodes",
        parseInt(localStorage.getItem("total_episodes")) +
          seasonRuntimeData.length
      )

      db.collection("users")
        .doc(location.state.userId)
        .update({
          watching_time: parseInt(localStorage.getItem("watching_time")),
          total_episodes: parseInt(localStorage.getItem("total_episodes")),
        })

      db.collection(`watchlist-${location.state.userId}`)
        .where("show_name", "==", memoShowData.show.name)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            // UPDATE DATABASE
            if (
              parseInt(seasonNumber) + 1 <=
                memoShowData.show.number_of_seasons ||
              memoShowData.show.status === "Returning Series"
            ) {
              doc.ref.update({
                season_number: parseInt(seasonNumber) + 1,
                episode_number: 0,
                status: "watching",
              })
            } else {
              if (
                memoShowData.show.status === "Ended" ||
                memoShowData.show.status === "Canceled"
              ) {
                doc.ref.update({
                  status: "finished",
                })
              }
            }
          })
        })

      addDoc(collection(db, `history-${location.state.userId}`), {
        show_name: memoShowData.show.name,
        show_id: memoShowData.show.id,
        season_number: parseInt(seasonNumber),
        episode_number: seasonRuntimeData.length,
        date_watched: serverTimestamp(),
        episode_name: "Entire Season Watched",
        show_cover: memoShowData.show.backdrop_path,
        episode_time: total_season_time,
      })
    }
  }, [seasonRuntimeData])

  function markSeasonWatched(event) {
    event.stopPropagation()

    setSeasonRuntimeData(() => {
      return selectedSeasonData.episodes.map((episode) => {
        if (episode.runtime !== null) {
          return parseInt(episode.runtime)
        } else {
          return 0
        }
      })
    })

    setCurrentUserSeason((prevSeason) => prevSeason + 1)

    setIsMarkSeasonClicked(true)
  }

  useEffect(() => {
    fetch(
      `https://api.themoviedb.org/3/tv/${memoShowData.show.id}/season/${seasonNumber}?api_key=${process.env.REACT_APP_THEMOVIEDB_API}&language=en-US`
    )
      .then((res) => res.json())
      .then((data) => {
        setSeasonDetails(data)
      })
      .then(() => {
        setFinished(true)
      })
  }, [finished, seasonNumber])

  useEffect(() => {
    const userCountry = localStorage.getItem("userCountry")

    // MDBLIST API
    const url_mdblist = `https://mdblist.p.rapidapi.com/?i=${memoShowData.show.external_ids.imdb_id}`
    const options_1 = {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": `${process.env.REACT_APP_MDBLIST_API}`,
        "X-RapidAPI-Host": "mdblist.p.rapidapi.com",
      },
    }

    fetch(url_mdblist, options_1)
      .then((res) => res.json())
      .then((data_ratings) => {
        if (data_ratings.response) {
          setImdbRating(data_ratings.ratings[0]?.value)
          setRottenTomatoesRating(data_ratings.ratings[4]?.value)
          setTraktRating(data_ratings.ratings[3]?.value)
        }
      })

    // Streaming Availability API
    const url_stream_availability = `https://streaming-availability.p.rapidapi.com/get?output_language=en&country=gr&imdb_id=${memoShowData.show.external_ids.imdb_id}`
    const options_2 = {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": `${process.env.REACT_APP_STREAMING_AVAILABILITY_API}`,
        "X-RapidAPI-Host": "streaming-availability.p.rapidapi.com",
      },
    }

    fetch(url_stream_availability, options_2)
      .then((res) => res.json())
      .then((data) => {
        if (userCountry && data.result?.streamingInfo[userCountry]) {
          setStreamServicesAvailable(data.result?.streamingInfo[userCountry])
        }
      })
  }, [location])

  useEffect(() => {
    setSeasonUntilReleasedEpisode([])

    var collectionRef = db.collection(`watchlist-${location.state.userId}`)
    var query = collectionRef.where("show_name", "==", memoShowData.show.name)

    query.get().then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        // Access the data in each document
        var data = doc.data()
        setCurrentUserEpisode(data.episode_number)
        setCurrentUserSeason(data.season_number)
      })
    })

    fetch(
      `https://api.themoviedb.org/3/tv/${memoShowData.show.id}/season/${seasonNumber}?api_key=${process.env.REACT_APP_THEMOVIEDB_API}&language=en-US`
    )
      .then((res) => res.json())
      .then((data) => {
        setSelectedSeasonData(data)
        data.episodes.forEach((episode) => {
          const airDate = new Date(episode.air_date)
          const today = new Date()
          const difference = airDate.getTime() - today.getTime()
          const totalDaysUntilEpisode = Math.ceil(
            difference / (1000 * 3600 * 24)
          )

          setSeasonUntilReleasedEpisode((prevData) => [
            ...prevData,
            totalDaysUntilEpisode,
          ])
        })
      })
  }, [seasonNumber])

  useEffect(() => {
    seasonUntilReleasedEpisode.forEach((day) => {
      if (day > 0) {
        setSemiReleasedSeason(true)
      }
    })
  }, [seasonUntilReleasedEpisode])

  const divImgStyle = {
    backgroundImage: `url('https://image.tmdb.org/t/p/original/${memoShowData.show.backdrop_path}')`,
  }

  function navigateToPeople(id) {
    navigate("/people", {
      state: {
        userId: location.state.userId,
        person_id: id,
      },
    })
  }

  // DATES CONVERTED
  const last_date_fix =
    memoShowData.show.last_episode_to_air &&
    memoShowData.show.last_episode_to_air.air_date.split("-")
  const lastDate =
    last_date_fix !== null
      ? `${last_date_fix[2]}-${last_date_fix[1]}-${last_date_fix[0]}`
      : "-"
  const next_date_fix =
    memoShowData.show.next_episode_to_air !== null &&
    memoShowData.show.next_episode_to_air.air_date.split("-")
  const nextDate =
    memoShowData.show.next_episode_to_air === null &&
    (memoShowData.show.status === "Canceled" ||
      memoShowData.show.status === "Ended")
      ? "Ended Series"
      : memoShowData.show.next_episode_to_air === null
      ? "TBA"
      : `${next_date_fix[2]}-${next_date_fix[1]}-${next_date_fix[0]}`

  let nextEpisodeDate = new Date(
    `${next_date_fix[1]}/${next_date_fix[2]}/${next_date_fix[0]}`
  )
  let today = new Date()

  let difference = nextEpisodeDate.getTime() - today.getTime()
  let TotalDaysUntilEpisode =
    memoShowData.show.status !== "Ended"
      ? nextDate === "TBA"
        ? "--"
        : memoShowData.show.status === "Canceled" ||
          memoShowData.show.status === "Ended"
        ? "-"
        : Math.ceil(difference / (1000 * 3600 * 24))
      : "-"

  const opts = {
    height: mobile ? "200px" : "600px",
    width: "95%",
  }

  function changeSeason(event) {
    const { id } = event.target

    setSeasonNumber(parseInt(id) + 1)

    for (let i = 0; i < divSeasonRef.current.childNodes.length; i++) {
      divSeasonRef.current.childNodes[i].classList.remove("active")
    }

    divSeasonRef.current.childNodes[id].classList.add("active")
  }

  let seasons = []
  for (let i = 1; i <= memoShowData.show.number_of_seasons; i++) {
    seasons.push(
      <div
        key={i}
        id={i - 1}
        onClick={(e) => changeSeason(e)}
        className={i === 1 ? "season-div active" : "season-div"}
      >
        {isShowAddedInWatchList &&
          currentUserSeason === i &&
          (showUserStatus[0]?.status === "watching" ||
            showUserStatus[0]?.status === "not_started") && (
            <p
              className="watchingNow-p"
              onClick={(e) => {
                e.stopPropagation()
              }}
            >
              {showUserStatus[0]?.status === "not_started"
                ? "Watch Next"
                : "Watching Now"}
            </p>
          )}
        Season {i}
        {isShowAddedInWatchList &&
          currentUserSeason === seasonNumber &&
          seasonNumber === i &&
          currentUserEpisode === 0 &&
          semiReleasedSeason === false &&
          selectedSeasonData?.episodes?.length !== 0 &&
          (showUserStatus[0]?.status === "watching" ||
            showUserStatus[0]?.status === "not_started") && (
            <Icon
              icon="icon-park-solid:check-one"
              className="markSeason-check"
              onClick={(e) => markSeasonWatched(e)}
              width={30}
            />
          )}
      </div>
    )
  }

  const networkLogos = memoShowData.show.networks.map((logo) => {
    return (
      <img
        key={logo.id}
        className="logos-img"
        src={`https://image.tmdb.org/t/p/w500/${logo.logo_path}`}
        alt=""
      />
    )
  })

  const creators = memoShowData.show.created_by.map((creator) => {
    return (
      <p key={creator.id} className="creator">
        {creator.name}
      </p>
    )
  })

  const yearStarted_fix =
    memoShowData.show.first_air_date !== null
      ? memoShowData.show.first_air_date.split("-")
      : "-"
  const yearStarted = yearStarted_fix !== "-" ? `${yearStarted_fix[0]}` : "-"

  const languages = memoShowData.show.languages.map((language) => {
    return (
      <p key={nanoid()} className="show-languages">
        {language}
      </p>
    )
  })

  const cast = memoShowData.show.aggregate_credits.cast
    .slice(0, 10)
    .map((person) => {
      return (
        <div key={person.id} className="cast-id">
          {person.profile_path !== null ? (
            <img
              className="cast-img-profile"
              src={`https://image.tmdb.org/t/p/w500/${person.profile_path}`}
              alt="logo-network"
            />
          ) : (
            <img className="cast-no-img-profile" src={noImg} alt="not-found" />
          )}
          <div className="cast-info-div-profile">
            <h3
              className="cast-name"
              onClick={() => navigateToPeople(person.id)}
            >
              {person.name}
            </h3>
            <p className="cast-subinfo">{person.roles[0].character}</p>
            <p className="cast-subinfo">
              {person.roles[0].episode_count > 1
                ? `${person.roles[0].episode_count} Episodes`
                : `${person.roles[0].episode_count} Episode`}
            </p>
          </div>
        </div>
      )
    })

  const fullCast = memoShowData.show.aggregate_credits.cast.map((person) => {
    return (
      <div key={person.id} className="cast-id-full">
        {person.profile_path !== null ? (
          <img
            className="cast-img"
            src={`https://image.tmdb.org/t/p/w500/${person.profile_path}`}
            alt="logo-network"
          />
        ) : (
          <img className="cast-no-img" src={noImg} alt="not-found" />
        )}
        <div className="cast-info-div">
          <h3 className="cast-name" onClick={() => navigateToPeople(person.id)}>
            {person.name}
          </h3>
          <p className="cast-subinfo">{person.roles[0].character}</p>
          <p className="cast-subinfo">
            {person.roles[0].episode_count > 1
              ? `${person.roles[0].episode_count} Episodes`
              : `${person.roles[0].episode_count} Episode`}
          </p>
        </div>
      </div>
    )
  })

  const fullCrew = memoShowData.show.aggregate_credits.crew.map((person) => {
    return (
      <div key={person.id} className="cast-id-full">
        {person.profile_path !== null ? (
          <img
            className="cast-img"
            src={`https://image.tmdb.org/t/p/w500/${person.profile_path}`}
            alt="logo-network"
          />
        ) : (
          <img className="cast-no-img" src={noImg} alt="not-found" />
        )}
        <div className="cast-info-div">
          <h3 className="cast-name" onClick={() => navigateToPeople(person.id)}>
            {person.name}
          </h3>
          <p className="cast-subinfo">{person.known_for_department}</p>
          <p className="cast-subinfo">{person.jobs[0].job}</p>
        </div>
      </div>
    )
  })

  function navigateToShow(showID) {
    setShowVideos([])
    setCurrentUserSeason(0)
    setCurrentUserEpisode(0)
    fetch(
      `https://api.themoviedb.org/3/tv/${showID}?api_key=${process.env.REACT_APP_THEMOVIEDB_API}&language=en-US&append_to_response=external_ids,videos,aggregate_credits,content_ratings,recommendations,similar,watch/providers,images`
    )
      .then((res) => res.json())
      .then((data) => {
        navigate("/overview", {
          state: {
            data: data,
            userId: currentUser.uid,
            userSeason: 0,
          },
        })
      })
  }

  // TODO: CHECK THE CODE BELLOW

  const recommending = memoShowData.show.recommendations.results
    .slice(0, 10)
    .map((recommend) => {
      return (
        <div
          key={recommend.id}
          onClick={() => navigateToShow(recommend.id)}
          className="recomending-show"
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
          <h3 className="cast-name">{recommend.name}</h3>
        </div>
      )
    })

  function swapVisualDays() {
    setShowDaysUntil(!showDaysUntil)
  }

  function addToWatchList() {
    setIsShowAddedInWatchList(true)
    addDoc(collection(db, `watchlist-${location.state.userId}`), {
      show_name: memoShowData.show.name,
      show_id: memoShowData.show.id,
      season_number: 1,
      episode_number: 0,
      status: "not_started",
      date_watched: serverTimestamp(),
    })
  }

  function removeFromWatchList() {
    setIsShowAddedInWatchList(false)
    db.collection(`watchlist-${location.state.userId}`)
      .where("show_name", "==", memoShowData.show.name)
      .get()
      .then((querySnapshot) => {
        querySnapshot.docs[0].ref.delete()
      })
  }

  function showHideFullCast() {
    setToggleFullCast(!toggleFullCast)
  }

  useEffect(() => {
    if (toggleFullCast) {
      const fullCastDiv = document.querySelector(".fullCast-container")
      fullCastDiv?.scrollIntoView()
    } else {
      window.scrollTo(0, 0)
    }
  }, [toggleFullCast])

  function stopWatchingShow() {
    db.collection(`watchlist-${location.state.userId}`)
      .where("show_name", "==", memoShowData.show.name)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          doc.ref.update({
            status: "stopped",
            date_watched: serverTimestamp(),
          })
        })
      })
  }

  function resumeWatchingShow() {
    db.collection(`watchlist-${location.state.userId}`)
      .where("show_name", "==", memoShowData.show.name)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          doc.ref.update({
            status: "watching",
            date_watched: serverTimestamp(),
          })
        })
      })
  }

  function changeYoutubeVideo(key, id) {
    setVideoIsSelected(true)
    setYoutubeKey(key)
    setYoutubeId(id)
  }

  return (
    <div>
      <Navbar isLoggedIn={isLoggedIn} />
      <ScrollToTop />

      <div style={divImgStyle} className="div-show-img">
        <div className="show-main-title-details">
          <h4 className="show-status">
            {memoShowData.show.status === "In Production"
              ? "Upcoming"
              : memoShowData.show.status}
          </h4>

          <h1 className="show-title">{memoShowData.show.name}</h1>

          <div className="div-show-genres">
            {memoShowData.show.genres.map((gen) => (
              <p key={gen.id} className="show-genres">
                {gen.name}
              </p>
            ))}
          </div>

          {!isNaN(imdbRating) && (
            <div className="ratings-wrapper">
              <div className="div-ratings">
                <img
                  className="webRating-img-imdb"
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/IMDB_Logo_2016.svg/1200px-IMDB_Logo_2016.svg.png"
                  alt="IMDB Logo"
                />
                <p className="rating-num">
                  {imdbRating === null
                    ? "-"
                    : parseFloat(imdbRating).toFixed(1)}
                  <Icon icon="eva:star-fill" color="#fed600" />
                </p>
              </div>

              <div className="div-ratings">
                <img
                  className="webRating-img"
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Rotten_Tomatoes.svg/1200px-Rotten_Tomatoes.svg.png"
                  alt="Rotten Tomatoes"
                />
                <p className="rating-num">
                  {rottenTomatoesRating === null ? "-" : rottenTomatoesRating} %
                </p>
              </div>

              <div className="div-ratings">
                <img
                  className="webRating-img-trakt"
                  src={trakt_logo}
                  alt="trakt"
                />
                <p className="rating-num">
                  {traktRating === null ? "-" : traktRating} %
                </p>
              </div>
            </div>
          )}

          <div className="seasons-network-container">
            <h3 className="show-total-seasons">
              {memoShowData.show.number_of_seasons > 1
                ? `${memoShowData.show.number_of_seasons} Seasons`
                : `${memoShowData.show.number_of_seasons} Season`}
            </h3>
            <h3 className="show-total-seasons">&#8226;</h3>
            <h3 className="show-network">
              {memoShowData.show.networks.length > 0
                ? memoShowData.show.networks[0].name
                : "Unknown"}
            </h3>
            <h3 className="show-total-seasons">&#8226;</h3>
            <div className="show-watchlist-buttons"></div>
            {!isShowAddedInWatchList ? (
              <p onClick={addToWatchList} className="watchlist-show">
                <Icon
                  className="whishlist-icon-add-remove-show"
                  icon="bi:bookmark-plus-fill"
                />
                Add to Watchlist
              </p>
            ) : (
              <p onClick={removeFromWatchList} className="watchlist-show">
                <Icon
                  className="whishlist-icon-add-remove-show"
                  icon="bi:bookmark-star-fill"
                />
                Remove Show
              </p>
            )}
          </div>
          {isShowAddedInWatchList &&
            showUserStatus[0]?.status === "watching" && (
              <div className="seasons-network-container">
                <p
                  onClick={stopWatchingShow}
                  className="watchlist-show stopShow"
                >
                  <Icon
                    className="whishlist-icon-add-remove-show"
                    icon="akar-icons:circle-x-fill"
                  />
                  Stop Watching
                </p>
              </div>
            )}

          {isShowAddedInWatchList &&
            showUserStatus[0]?.status === "stopped" && (
              <div className="seasons-network-container">
                <p onClick={resumeWatchingShow} className="watchlist-show">
                  <Icon
                    className="whishlist-icon-add-remove-show"
                    icon="akar-icons:circle-x-fill"
                  />
                  Resume Show
                </p>
              </div>
            )}
        </div>
      </div>

      {!toggleFullCast && (
        <div className="show-info-container">
          <div className="top-info-div">
            {memoShowData.show.homepage !== "" &&
              memoShowData.show.homepage !== null &&
              (streamServicesAvailable !== undefined ||
                !streamServicesAvailable[0]?.link) && (
                <div className="info-div">
                  <h1>Where to watch</h1>
                  {streamServicesAvailable !== undefined &&
                  streamServicesAvailable[0]?.link ? (
                    <a
                      className="whereToWatch-link"
                      href={streamServicesAvailable[0]?.link}
                    >
                      <Icon icon="ci:play-circle-outline" />
                      Available Here
                    </a>
                  ) : (
                    memoShowData.show.homepage !== "" &&
                    memoShowData.show.homepage !== null && (
                      <a
                        className="whereToWatch-link"
                        href={memoShowData.show.homepage}
                      >
                        <Icon icon="ci:play-circle-outline" />
                        Official Site
                      </a>
                    )
                  )}
                </div>
              )}

            {lastDate !== "-" && (
              <div className="info-div">
                <h1>Latest Episode</h1>
                <p className="episodes-dates lastDate">{lastDate}</p>
              </div>
            )}

            <div className="info-div">
              <h1>
                {lastDate === "-" &&
                (memoShowData.show.status !== "Ended" ||
                  memoShowData.show.status !== "Canceled")
                  ? "Premiere"
                  : "Next Episode"}
              </h1>
              <p
                onClick={swapVisualDays}
                className={
                  TotalDaysUntilEpisode !== "-"
                    ? "episodes-dates"
                    : "episodes-dates ended"
                }
              >
                {showDaysUntil
                  ? TotalDaysUntilEpisode === "-"
                    ? "Ended Series"
                    : TotalDaysUntilEpisode !== 1
                    ? `${TotalDaysUntilEpisode} Days`
                    : `${TotalDaysUntilEpisode} Day`
                  : nextDate}{" "}
              </p>
            </div>
          </div>
        </div>
      )}

      {!toggleFullCast && (
        <div className="show-main-container">
          <div className="all-data-div">
            <div className="synopsis-div">
              {memoShowData.show.overview !== "" && <h1>Synopsis</h1>}
              {memoShowData.show.overview !== "" && (
                <p className="synopsis-text">{memoShowData.show.overview}</p>
              )}
              {memoShowData.show.videos.results.length > 0 &&
                videoIsSelected && (
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
                  isMobile={mobile}
                  changeVideo={changeYoutubeVideo}
                  data={memoVideosData.showVideos}
                />
              )}
            </div>

            <div>
              <h1 className="seasonsEpisodesTitle">Seasons & Episodes</h1>

              <div className="seasons-episodes-wrapper">
                <div ref={divSeasonRef} className="seasons-container">
                  {seasons}
                </div>

                <div className="season-episodes-container">
                  {finished && seasonDetails.episodes.length !== 0 ? (
                    seasonDetails.episodes.map((episode, index) => {
                      let air_date_fix =
                        episode.air_date_fix !== null &&
                        episode.air_date !== null &&
                        episode.air_date.split("-")
                      let new_air_date = new Date(
                        `${air_date_fix[1]}/${air_date_fix[2]}/${air_date_fix[0]}`
                      )

                      let difference_ep =
                        new_air_date.getTime() - today.getTime()
                      let daysUntilCurrentEpisode = Math.ceil(
                        difference_ep / (1000 * 3600 * 24)
                      )

                      return (
                        <ShowEpisodes
                          key={nanoid()}
                          episodesAnnounced={true}
                          episodeNum={index + 1}
                          seasonNum={seasonNumber}
                          episode={episode}
                          episodeName={episode.name}
                          episodeAirDate={episode.air_date}
                          episodeRuntime={episode.runtime}
                          daysUntilCurrentEpisode={daysUntilCurrentEpisode}
                          today={today}
                          new_air_date={new_air_date}
                          currentUserID={location.state.userId}
                          showName={memoShowData.show.name}
                          showID={memoShowData.show.id}
                          current_season_episodes_count={
                            seasonDetails.episodes.length
                          }
                        />
                      )
                    })
                  ) : (
                    <div key={nanoid()}>
                      <ShowEpisodes
                        key={nanoid()}
                        status={memoShowData.show.status}
                        episodesAnnounced={false}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {cast.length > 0 && (
              <div className="cast-wrapper">
                <h1>Series Cast</h1>
                <div className="cast-div">
                  {cast}
                  <div className="fullListCast-div">
                    <button onClick={showHideFullCast} className="all-cast-btn">
                      Full List
                      <Icon icon="codicon:arrow-small-right" width={40} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {recommending.length > 0 && (
              <div className="recommend-wrapper">
                <h1>Recommending Shows</h1>
                <div className="recommend-container">{recommending}</div>
              </div>
            )}
          </div>

          <div className="all-details-div">
            <div className="show-social">
              {memoShowData.show.external_ids.facebook_id !== null && (
                <a
                  className="socials-links"
                  href={`https://www.facebook.com/watch/${memoShowData.show.external_ids.facebook_id}`}
                >
                  <Icon
                    className="social-img facebook"
                    icon="akar-icons:facebook-fill"
                    width={30}
                  />
                </a>
              )}
              {memoShowData.show.external_ids.instagram_id !== null && (
                <a
                  className="socials-links"
                  href={`https://www.instagram.com/${memoShowData.show.external_ids.instagram_id}`}
                >
                  <Icon
                    className="social-img instagram"
                    icon="akar-icons:instagram-fill"
                    width={30}
                  />
                </a>
              )}
              {memoShowData.show.external_ids.twitter_id !== null && (
                <a
                  className="socials-links"
                  href={`https://twitter.com/${memoShowData.show.external_ids.twitter_id}`}
                >
                  <Icon
                    className="social-img twitter"
                    icon="simple-icons:x"
                    width={30}
                  />
                </a>
              )}
              {memoShowData.show.external_ids.imdb_id !== null && (
                <a
                  className="socials-links"
                  href={`https://www.imdb.com/title/${memoShowData.show.external_ids.imdb_id}`}
                >
                  <Icon
                    className="social-img imdb"
                    icon="cib:imdb"
                    width={30}
                  />
                </a>
              )}
            </div>

            {memoShowData.show.networks.length > 0 && (
              <div className="networks-container">
                <h3 className="details-title">
                  {memoShowData.show.networks.length > 1
                    ? "Networks"
                    : "Network"}
                </h3>
                <div className="logos-networks-div">{networkLogos}</div>
              </div>
            )}

            {creators.length > 0 && (
              <div>
                <h3 className="details-title">
                  {memoShowData.show.created_by.length > 1
                    ? "Creators"
                    : "Creator"}
                </h3>
                {creators}
              </div>
            )}

            {yearStarted !== "" && (
              <div>
                <h3 className="details-title">Year</h3>
                {yearStarted}
              </div>
            )}

            {memoShowData.show.languages.length > 0 && (
              <div>
                <h3 className="details-title">
                  {memoShowData.show.languages.length > 1
                    ? "Languages"
                    : "Language"}
                </h3>
                <div className="languages-div">{languages}</div>
              </div>
            )}

            <div>
              <h3 className="details-title">Episodes Runtime</h3>
              <p className="creator">
                {memoShowData.show.episode_run_time.length > 0
                  ? `${memoShowData.show.episode_run_time}'`
                  : "-"}
              </p>
            </div>

            <div>
              <h3 className="details-title">Number of Episodes</h3>
              <p className="creator">{memoShowData.show.number_of_episodes}</p>
            </div>

            <div>
              <h3 className="details-title">Type</h3>
              <p className="creator">{memoShowData.show.type}</p>
            </div>
          </div>
        </div>
      )}

      {toggleFullCast && (
        <div className="fullCast-container">
          <button onClick={showHideFullCast} className="backShow-btn">
            <Icon icon="bi:arrow-left" />
            Back to Show
          </button>
          <div className="cast-crew-wrapper">
            <div className="fullCast-div">
              <h1>Full Cast</h1>
              {fullCast}
            </div>
            <div className="fullCrew-div">
              <h1>Full Crew</h1>
              {fullCrew}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
