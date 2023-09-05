import React from "react"
import { db } from "../services/firebase"
import { useNavigate } from "react-router-dom"
import "firebase/compat/firestore"

export default function HistoryEpisodes(props) {
  const zeroPad = (num, places) => String(num).padStart(places, "0")
  const navigate = useNavigate()

  function markAsUnwatched() {
    if (props.history_episode_name === "Marked Season Watched") {
      let ids_to_delete = []

      db.collection(`history-${props.currentUserID}`)
        .where("show_name", "==", props.history_show_name)
        .where("episode_name", "==", "Marked Season Watched")
        .get()
        .then((snap) => {
          snap.forEach((doc) => {
            if (doc.data().season_number >= props.history_season_number) {
              ids_to_delete.push(doc.id)
            }
          })
        })
        .then(() => {
          db.collection(`watchlist-${props.currentUserID}`)
            .where("show_name", "==", props.history_show_name)
            .get()
            .then((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                doc.ref.update({
                  episode_number: 0,
                  season_number: props.history_season_number,
                })
              })
            })
        })
        .then(() => {
          var watchingTime = parseInt(localStorage.getItem("watching_time"))
          var totalEpisodes = parseInt(localStorage.getItem("total_episodes"))
          const promises = ids_to_delete.map((delete_id, index) => {
            return db
              .collection(`history-${props.currentUserID}`)
              .doc(delete_id)
              .get()
              .then((doc) => {
                const episodeTime = doc.data().episode_time
                if (index > 0) {
                  watchingTime = parseInt(
                    localStorage.getItem("watching_time") - episodeTime
                  )
                  totalEpisodes = parseInt(
                    localStorage.getItem("total_episodes") -
                      doc.data().episode_number
                  )
                }
                return db
                  .collection("users")
                  .doc(props.currentUserID)
                  .update({
                    watching_time: watchingTime - episodeTime,
                    total_episodes: totalEpisodes - doc.data().episode_number,
                  })
              })
          })

          Promise.all(promises).then(() => {
            ids_to_delete.map((delete_id, index) => {
              deleteEpisodeFromHistory(delete_id)
            })
          })
        })
    } else {
      let ids_to_delete = []

      db.collection(`history-${props.currentUserID}`)
        .where("show_name", "==", props.history_show_name)
        .where("season_number", "==", parseInt(props.history_season_number))
        .get()
        .then((snap) => {
          snap.forEach((doc) => {
            if (doc.data().episode_number >= props.history_episode_number) {
              if (doc.data().episode_name !== "Marked Season Watched") {
                ids_to_delete.push(doc.id)
              }
            }
          })
        })
        .then(() => {
          db.collection(`watchlist-${props.currentUserID}`)
            .where("show_name", "==", props.history_show_name)
            .get()
            .then((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                doc.ref.update({
                  episode_number: props.history_episode_number,
                  season_number: props.history_season_number,
                })
              })
            })
        })
        .then(() => {
          var watchingTime = parseInt(localStorage.getItem("watching_time"))
          var totalEpisodes = parseInt(localStorage.getItem("total_episodes"))
          const promises = ids_to_delete.map((delete_id, index) => {
            return db
              .collection(`history-${props.currentUserID}`)
              .doc(delete_id)
              .get()
              .then((doc) => {
                const episodeTime = doc.data().episode_time
                if (index > 0) {
                  watchingTime = parseInt(
                    localStorage.getItem("watching_time") - episodeTime
                  )
                  totalEpisodes = parseInt(
                    localStorage.getItem("total_episodes") - 1
                  )
                }
                return db
                  .collection("users")
                  .doc(props.currentUserID)
                  .update({
                    watching_time: watchingTime - episodeTime,
                    total_episodes: totalEpisodes - 1,
                  })
              })
          })

          Promise.all(promises).then(() => {
            ids_to_delete.map((delete_id, index) => {
              deleteEpisodeFromHistory(delete_id)
            })
          })
        })
    }

    function deleteEpisodeFromHistory(episode_to_delete) {
      db.collection(`history-${props.currentUserID}`)
        .doc(episode_to_delete)
        .delete()
        .then(() => {
          window.location.reload()
        })
    }
  }

  function goToShow(showID) {
    fetch(
      `https://api.themoviedb.org/3/tv/${showID}?api_key=***REMOVED***&language=en-US&append_to_response=external_ids,videos,aggregate_credits,content_ratings,recommendations,similar,watch/providers,images`
    )
      .then((res) => res.json())
      .then((data) => {
        navigate("/overview", {
          state: {
            data: data,
            userId: props.currentUserID,
          },
        })
      })
  }

  return (
    <div className="history-card-wrapper">
      <div className="history-profile-show-img-div">
        <img
          className="history-card-img"
          src={`https://image.tmdb.org/t/p/w500/${props.history_cover}`}
          alt="history-episode-card-img"
        />
      </div>

      <div className="history-badge-info-container">
        <div className="history-info-card">
          <h3
            style={{ cursor: "pointer" }}
            onClick={() => goToShow(props.history_show_id)}
          >
            {props.history_show_name}
          </h3>
          {props.history_episode_name === "Marked Season Watched" ? (
            <p className="episode-num-card">
              Season {props.history_season_number}
            </p>
          ) : (
            <p className="episode-num-card">
              S{zeroPad(props.history_season_number, 2)} | E
              {zeroPad(props.history_episode_number + 1, 2)}
            </p>
          )}
          <p className="profile-episode-name-history">
            {props.history_episode_name}
          </p>
        </div>

        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={85}
            height={85}
            viewBox="-5 -15 40 55"
          >
            <path
              style={{
                fill: "rgb(255, 99, 71)",
                width: "100%",
                cursor: "pointer",
                userSelect: "none",
              }}
              onClick={markAsUnwatched}
              d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm4.207 12.793-1.414 1.414L12 13.414l-2.793 2.793-1.414-1.414L10.586 12 7.793 9.207l1.414-1.414L12 10.586l2.793-2.793 1.414 1.414L13.414 12l2.793 2.793z"
            ></path>
          </svg>
        </div>
      </div>
    </div>
  )
}
