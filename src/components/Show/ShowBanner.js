import { useState, useEffect } from "react"
import "./ShowBanner.css"
import trakt_logo from "../../images/trakt-icon-red-white.png"
import { Icon } from "@iconify/react"
import { db } from "../../services/firebase"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"

export default function ShowBanner(props) {
  const [isShowAddedInWatchList, setIsShowAddedInWatchList] = useState(false)
  const divImgStyle = {
    backgroundImage: `url('https://image.tmdb.org/t/p/original/${props.showData.backdrop_path}')`,
  }
  const [imdbRating, setImdbRating] = useState(0.0)
  const [rottenTomatoesRating, setRottenTomatoesRating] = useState(0)
  const [traktRating, setTraktRating] = useState(0)

  useEffect(() => {
    const fetchRatingsData = async () => {
      return await fetch(
        `https://mdblist.p.rapidapi.com/?i=${props.showData?.external_ids?.imdb_id}`,
        {
          method: "GET",
          headers: {
            "X-RapidAPI-Key": process.env.REACT_APP_MDBLIST_API,
            "X-RapidAPI-Host": "mdblist.p.rapidapi.com",
          },
        }
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.response) {
            setImdbRating(data.ratings[0]?.value)
            setRottenTomatoesRating(data.ratings[4]?.value)
            setTraktRating(data.ratings[3]?.value)
          }
        })
        .catch((error) => {
          console.error("Error fetching data from endpoint 2:", error)
        })
    }

    const checkIfShowAddedInWatchList = async () => {
      return await db
        .collection(`watchlist-${props.currentUser}`)
        .where("show_id", "==", parseInt(props.show_id))
        .get()
        .then((querySnapshot) => {
          if (!querySnapshot.empty) {
            setIsShowAddedInWatchList(true)
          }
        })
    }

    Promise.all([fetchRatingsData(), checkIfShowAddedInWatchList()])
      .then(() => {
        // console.log("Both API calls finished.")
      })
      .catch((error) => {
        console.error("Error fetching data:", error)
      })
  }, [])

  function addShowToWatchList() {
    const addShowToDatabase = async () => {
      return await addDoc(collection(db, `watchlist-${props.currentUser}`), {
        show_name: props.show_name,
        show_id: parseInt(props.show_id),
        season_number: 1,
        episode_number: 0,
        status: "not_started",
        date_watched: serverTimestamp(),
      })
    }

    Promise.all([addShowToDatabase()])
      .then(() => {
        console.log("Show added to user's watchlist")
        // Handle any additional logic after both API calls are completed
        setIsShowAddedInWatchList(true)
      })
      .catch((error) => {
        console.error("Error adding to database:", error)
        // Handle errors if any of the promises reject
      })
  }

  function removeShowFromWatchList() {
    // TODO: proper deletion of the show and user's data (see issue in notes)
    // const removeShowFromDatabase = async () => {
    //   return await db
    //     .collection(`watchlist-${props.currentUser}`)
    //     .where("show_name", "==", props.show_name)
    //     .get()
    //     .then((querySnapshot) => {
    //       querySnapshot.docs[0].ref.delete()
    //     })
    // }

    // Promise.all([removeShowFromDatabase()])
    //   .then(() => {
    //     console.log("Show removed from user's watchlist")
    //     // Handle any additional logic after both API calls are completed
    //     setIsShowAddedInWatchList(false)
    //   })
    //   .catch((error) => {
    //     console.error("Error removing from database:", error)
    //     // Handle errors if any of the promises reject
    //   })

    console.log(
      "removeShowFromWatchList: Should delete the show and update user's data"
    )
  }

  function continueWatchingShow() {
    const continueWatching = async () => {
      return await db
        .collection(`watchlist-${props.currentUser}`)
        .where("show_id", "==", parseInt(props.show_id))
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

    Promise.all([continueWatching()])
      .then(() => {
        // console.log("Show re-added watching list")
      })
      .catch((error) => {
        console.error("Error adding to database:", error)
      })
  }

  function stopWatchingShow() {
    const stopWatching = async () => {
      return await db
        .collection(`watchlist-${props.currentUser}`)
        .where("show_name", "==", props.show_name)
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

    Promise.all([stopWatching()])
      .then(() => {
        // console.log("Show removed from watching list")
      })
      .catch((error) => {
        console.error("Error adding to database:", error)
      })
  }

  return (
    <div>
      <div style={divImgStyle} className="div-show-img">
        <div className="show-main-title-details">
          <h4 className="show-status">
            {props.showData.status === "In Production" ||
            props.showData.status === "Planned"
              ? "Upcoming"
              : props.showData.status}
          </h4>

          <h1 className="show-title">{props.showData.name}</h1>

          <div className="div-show-genres">
            {props.showData.genres?.map((gen) => (
              <p key={gen.id} className="show-genres">
                {gen.name}
              </p>
            ))}
          </div>

          <div className="ratings-wrapper">
            <div className="div-ratings">
              <img
                className="webRating-img-imdb"
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/IMDB_Logo_2016.svg/1200px-IMDB_Logo_2016.svg.png"
                alt="IMDB Logo"
              />
              <p className="rating-num">
                {imdbRating === null ? "-" : parseFloat(imdbRating).toFixed(1)}
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

          <div className="seasons-network-container">
            <h3>
              {props.showData.number_of_seasons > 1
                ? `${props.showData.number_of_seasons} Seasons`
                : `${props.showData.number_of_seasons} Season`}
            </h3>

            <h3>&#8226;</h3>
            <h3>
              {props.showData.networks?.length > 0
                ? props.showData.networks[0]?.name
                : "Unknown"}
            </h3>

            <h3>&#8226;</h3>

            {!isShowAddedInWatchList ? (
              <h3 onClick={addShowToWatchList} className="watchlist-show">
                <Icon
                  className="add-remove-continue-watchlist-icon"
                  icon="jam:bookmark-plus-f"
                />
                Add to Watchlist
              </h3>
            ) : (
              <h3 onClick={removeShowFromWatchList} className="watchlist-show ">
                <Icon
                  className="add-remove-continue-watchlist-icon"
                  icon="jam:bookmark-remove-f"
                />
                Remove Show
              </h3>
            )}

            {isShowAddedInWatchList && props.showUserStatus === "watching" && (
              <>
                <h3>&#8226;</h3>
                <h3
                  onClick={stopWatchingShow}
                  className="watchlist-show stopShow"
                >
                  <Icon icon="akar-icons:circle-x-fill" />
                  Stop Watching
                </h3>
              </>
            )}

            {isShowAddedInWatchList && props.showUserStatus === "stopped" && (
              <>
                <h3>&#8226;</h3>
                <h3 onClick={continueWatchingShow} className="watchlist-show">
                  <Icon
                    className="add-remove-continue-watchlist-icon"
                    icon="ic:round-replay-circle-filled"
                  />
                  Continue Show
                </h3>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
