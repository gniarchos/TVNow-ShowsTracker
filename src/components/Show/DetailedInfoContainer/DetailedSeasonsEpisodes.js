import React from "react"
import "./DetailedSeasonsEpisodes.css"
import { useEffect, useRef, useState } from "react"
import { db } from "../../../services/firebase"
import { Icon } from "@iconify/react"
import DetailedShowEpisodes from "./DetailedShowEpisodes"
import { nanoid } from "nanoid"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"

export default function DetailedSeasonsEpisodes(props) {
  const divSeasonRef = useRef("")
  const [seasonNumber, setSeasonNumber] = useState("1")
  const [currentUserSeason, setCurrentUserSeason] = useState(1)
  const [currentUserEpisode, setCurrentUserEpisode] = useState(0)
  const [semiReleasedSeason, setSemiReleasedSeason] = useState(false)
  const [selectedSeasonData, setSelectedSeasonData] = useState()
  const [seasonUntilReleasedEpisode, setSeasonUntilReleasedEpisode] = useState(
    []
  )
  const [seasonDetails, setSeasonDetails] = useState([])
  const [seasonRuntimeData, setSeasonRuntimeData] = useState([])
  const [isMarkSeasonClicked, setIsMarkSeasonClicked] = useState(false)

  useEffect(() => {
    const getUsersSeasonsEpisode = () => {
      return db
        .collection(`watchlist-${props.currentUser}`)
        .where("show_name", "==", props.showData.name)
        .get()
        .then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            // Access the data in each document
            var data = doc.data()
            setCurrentUserEpisode(data.episode_number)
            setCurrentUserSeason(data.season_number)
          })
        })
    }

    const fetchSelectedSeasonInfo = async () => {
      return await fetch(
        `https://api.themoviedb.org/3/tv/${props.show_id}/season/${seasonNumber}?api_key=${process.env.REACT_APP_THEMOVIEDB_API}&language=en-US`
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
    }

    const fetchSeasonData = async () => {
      return await fetch(
        `https://api.themoviedb.org/3/tv/${props.show_id}/season/${seasonNumber}?api_key=${process.env.REACT_APP_THEMOVIEDB_API}&language=en-US`
      )
        .then((res) => res.json())
        .then((data) => {
          setSeasonDetails(data)
        })
    }

    Promise.all([
      getUsersSeasonsEpisode(),
      fetchSelectedSeasonInfo(),
      fetchSeasonData(),
    ])
      .then(() => {
        // console.log(
        //   "Got the user's current season and episode - info of selected season and season data"
        // )
      })
      .catch((error) => {
        console.error("Error fetching data:", error)
      })
  }, [props.show_id, seasonNumber])

  useEffect(() => {
    for (let i = 0; i < divSeasonRef.current.childNodes.length; i++) {
      divSeasonRef.current.childNodes[i].classList.remove("active")
    }
    divSeasonRef.current.childNodes[0].classList.add("active")
  }, [])

  function changeSeason(event) {
    const { id } = event.target

    setSeasonNumber(parseInt(id) + 1)

    for (let i = 0; i < divSeasonRef.current.childNodes.length; i++) {
      divSeasonRef.current.childNodes[i].classList.remove("active")
    }

    divSeasonRef.current.childNodes[id].classList.add("active")
  }

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

      const updateUsersTimeEpisodes = () => {
        return db
          .collection("users")
          .doc(props.currentUser)
          .update({
            watching_time: parseInt(localStorage.getItem("watching_time")),
            total_episodes: parseInt(localStorage.getItem("total_episodes")),
          })
      }

      const updateUserShowStatus = () => {
        return db
          .collection(`watchlist-${props.currentUser}`)
          .where("show_name", "==", props.showData.name)
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              // UPDATE DATABASE
              if (
                parseInt(seasonNumber) + 1 <=
                  props.showData.number_of_seasons ||
                props.showData.status === "Returning Series"
              ) {
                doc.ref.update({
                  season_number: parseInt(seasonNumber) + 1,
                  episode_number: 0,
                  status: "watching",
                })
              } else {
                if (
                  props.showData.status === "Ended" ||
                  props.showData.status === "Canceled"
                ) {
                  doc.ref.update({
                    status: "finished",
                  })
                }
              }
            })
          })
      }

      const addSeasonToHistory = () => {
        return addDoc(collection(db, `history-${props.currentUser}`), {
          show_name: props.showData.name,
          show_id: parseInt(props.showData.id),
          season_number: parseInt(seasonNumber),
          episode_number: seasonRuntimeData.length,
          date_watched: serverTimestamp(),
          episode_name: "Entire Season Watched",
          show_cover: props.showData.backdrop_path,
          episode_time: total_season_time,
        })
      }

      Promise.all([
        updateUsersTimeEpisodes(),
        updateUserShowStatus(),
        addSeasonToHistory(),
      ])
        .then(() => {
          // console.log("Both API calls finished.")
        })
        .catch((error) => {
          console.error("Error fetching data:", error)
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

  let seasons = []
  for (let i = 1; i <= props.showData.number_of_seasons; i++) {
    seasons.push(
      <div
        key={i}
        id={i - 1}
        onClick={(e) => changeSeason(e)}
        className={i === 1 ? "season-div active" : "season-div"}
      >
        {props.showUserStatus &&
          currentUserSeason === i &&
          (props.showUserStatus === "watching" ||
            props.showUserStatus === "not_started") && (
            <p
              className="watchingNow-p"
              onClick={(e) => {
                e.stopPropagation()
              }}
            >
              {props.showUserStatus === "not_started"
                ? "Watch Next"
                : "Watching Now"}
            </p>
          )}
        Season {i}
        {props.showUserStatus &&
          currentUserSeason === seasonNumber &&
          seasonNumber === i &&
          currentUserEpisode === 0 &&
          semiReleasedSeason === false &&
          selectedSeasonData?.episodes?.length !== 0 &&
          (props.showUserStatus === "watching" ||
            props.showUserStatus === "not_started") && (
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

  useEffect(() => {
    seasonUntilReleasedEpisode.forEach((day) => {
      if (day > 0) {
        setSemiReleasedSeason(true)
      }
    })
  }, [seasonUntilReleasedEpisode])

  return (
    <div>
      <h1 className="seasons-episodes-title">Seasons & Episodes</h1>

      <div className="seasons-episodes-wrapper">
        <div ref={divSeasonRef} className="seasons-container">
          {seasons}
        </div>

        <div>
          {seasonDetails?.episodes?.length !== 0 ? (
            seasonDetails?.episodes?.map((episode, index) => {
              const today = new Date()

              const nextEpisodeDate_DateFormat =
                episode.air_date !== null
                  ? new Date(episode.air_date)
                  : new Date(0)

              const differenceOfDates =
                nextEpisodeDate_DateFormat.getTime() - today.getTime()

              const daysUntilCurrentEpisode = Math.ceil(
                differenceOfDates / (1000 * 3600 * 24)
              )

              return (
                <DetailedShowEpisodes
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
                  new_air_date={nextEpisodeDate_DateFormat}
                  currentUser={props.currentUser}
                  showName={props.showData.name}
                  showID={props.showData.id}
                  current_season_episodes_count={seasonDetails?.episodes.length}
                />
              )
            })
          ) : (
            <div key={nanoid()}>
              <DetailedShowEpisodes
                key={nanoid()}
                status={props.showData.status}
                episodesAnnounced={false}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
