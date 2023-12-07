import React, { useContext, useState } from "react"
import { db } from "../../services/firebase"
import { Link } from "react-router-dom"
import "firebase/compat/firestore"
import { Icon } from "@iconify/react"
import "./ProfileSectionsStyles.css"
import { ProfileContext } from "./Profile"
import { HistoryContext } from "./ProfileHistory"

export default function HistoryEpisodes(props) {
  const zeroPad = (num, places) => String(num).padStart(places, "0")

  const { triggerFetchUserData, setTriggerFetchUserData } =
    useContext(ProfileContext)

  const { setWaitForDelete } = useContext(HistoryContext)

  function markAsUnwatched() {
    setWaitForDelete(true)
    if (props.history_episode_name === "Entire Season Watched") {
      let ids_to_delete = []

      const getSeasonsToDelete = async () => {
        return await db
          .collection(`history-${props.currentUserID}`)
          .where("show_name", "==", props.history_show_name)
          .where("episode_name", "==", "Entire Season Watched")
          .get()
          .then((snap) => {
            snap.forEach((doc) => {
              if (doc.data().season_number >= props.history_season_number) {
                ids_to_delete.push(doc.id)
              }
            })
          })
      }

      const updateWatchList = async () => {
        return await db
          .collection(`watchlist-${props.currentUserID}`)
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
      }

      Promise.all([getSeasonsToDelete(), updateWatchList()])
        .then(() => {
          let watchingTime = 0
          let totalEpisodes = 0

          ids_to_delete.map((delete_id) => {
            db.collection(`history-${props.currentUserID}`)
              .doc(delete_id)
              .get()
              .then((doc) => {
                watchingTime = parseInt(
                  localStorage.getItem("watching_time") -
                    doc.data().episode_time
                )
                totalEpisodes = parseInt(
                  localStorage.getItem("total_episodes") -
                    doc.data().episode_number
                )

                db.collection("users").doc(props.currentUserID).update({
                  watching_time: watchingTime,
                  total_episodes: totalEpisodes,
                })
              })
              .then(() => {
                localStorage.setItem("watching_time", watchingTime)
                localStorage.setItem("total_episodes", totalEpisodes)
                deleteEpisodeOrSeasonFromHistory(delete_id)
              })
          })
        })
        .catch((error) => {
          console.error("Error fetching data:", error)
        })
    } else {
      let ids_to_delete = []

      const getEpisodesToDelete = async () => {
        return await db
          .collection(`history-${props.currentUserID}`)
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
      }

      const updateWatchList = async () => {
        return await db
          .collection(`watchlist-${props.currentUserID}`)
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
      }

      Promise.all([getEpisodesToDelete(), updateWatchList()])
        .then(() => {
          let watchingTime = 0
          let totalEpisodes = 0

          ids_to_delete.map((delete_id) => {
            db.collection(`history-${props.currentUserID}`)
              .doc(delete_id)
              .get()
              .then((doc) => {
                watchingTime = parseInt(
                  localStorage.getItem("watching_time") -
                    doc.data().episode_time
                )
                totalEpisodes = parseInt(
                  localStorage.getItem("total_episodes") - 1
                )

                db.collection("users").doc(props.currentUserID).update({
                  watching_time: watchingTime,
                  total_episodes: totalEpisodes,
                })
              })
              .then(() => {
                localStorage.setItem("watching_time", watchingTime)
                localStorage.setItem("total_episodes", totalEpisodes)
                deleteEpisodeOrSeasonFromHistory(delete_id)
              })
          })
        })
        .catch((error) => {
          console.error("Error fetching data:", error)
        })
    }

    function deleteEpisodeOrSeasonFromHistory(episode_to_delete) {
      const deleteEpisodeOrSeason = async () => {
        return await db
          .collection(`history-${props.currentUserID}`)
          .doc(episode_to_delete)
          .delete()
      }

      Promise.all([deleteEpisodeOrSeason()])
        .then(() => {
          setTriggerFetchUserData(!triggerFetchUserData)
        })
        .then(() => {
          setWaitForDelete(false)
        })
        .catch((error) => {
          console.error("Error fetching data:", error)
        })
    }
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
          <Link
            to={`/show?show_name=${props.history_show_name}&show_id=${props.history_show_id}`}
            className="show-name-profile-history"
          >
            {props.history_show_name}
          </Link>
          {props.history_episode_name === "Entire Season Watched" ? (
            <p className="episode-num-card-history">
              Season {props.history_season_number}
            </p>
          ) : (
            <p className="episode-num-card-history">
              S{zeroPad(props.history_season_number, 2)} | E
              {zeroPad(props.history_episode_number + 1, 2)}
            </p>
          )}
          <p className="profile-episode-name-history">
            {props.history_episode_name}
          </p>
        </div>

        <div>
          <Icon
            icon="icon-park-solid:close-one"
            color="rgb(255, 99, 71)"
            width={35}
            onClick={markAsUnwatched}
            className="markIcon"
          />
        </div>
      </div>
    </div>
  )
}
