import { useState, useEffect, useContext } from "react"
import "./ProfileStatistics.css"
import { db } from "../../services/firebase"
import { ProfileContext } from "./Profile"

export default function ProfileStatistics(props) {
  const { triggerFetchUserData } = useContext(ProfileContext)
  const [watchingStatistic, setWatchingStatistic] = useState([])
  const [userWatchingTime, setUserWatchingTime] = useState(
    localStorage.getItem("watching_time") !== null
      ? localStorage.getItem("watching_time")
      : 0
  )
  const [userWatchedEpisodes, setUserWatchedEpisodes] = useState(
    localStorage.getItem("total_episodes") !== null
      ? localStorage.getItem("total_episodes")
      : 0
  )

  useEffect(() => {
    const getUserWatchingTime = async () => {
      return await db
        .collection("users")
        .doc(props.currentUser)
        .get()
        .then((doc) => {
          setUserWatchingTime(doc.data().watching_time)
          setUserWatchedEpisodes(doc.data().total_episodes)
          localStorage.setItem("watching_time", doc.data().watching_time)
          localStorage.setItem("total_episodes", doc.data().total_episodes)
        })
    }

    Promise.all([getUserWatchingTime()]).catch((error) => {
      console.error("Error fetching data:", error)
    })
  }, [triggerFetchUserData])

  useEffect(() => {
    let minutes = userWatchingTime
    const months = Math.floor(minutes / (30 * 24 * 60))

    const days = Math.floor((minutes % (30 * 24 * 60)) / (24 * 60))

    const hours = Math.floor((minutes % (24 * 60)) / 60)

    setWatchingStatistic([months, days, hours])
    //   }, [readLocalStorage, userWatchingTime, userTime, historyData])
  }, [userWatchedEpisodes])

  return (
    <div className="statistics-info-container">
      <div className="single-statistic-wrapper">
        <h1 className="stats-title">Your TV Time</h1>
        <div className="tvtime-container">
          <div>
            <p className="stats-number">{watchingStatistic[0]}</p>
            <p className="stats-subtitle">
              {watchingStatistic[0] === 1 ? "MONTH" : "MONTHS"}
            </p>
          </div>
          <div>
            <p className="stats-number">{watchingStatistic[1]}</p>
            <p className="stats-subtitle">
              {watchingStatistic[1] === 1 ? "DAY" : "DAYS"}
            </p>
          </div>
          <div>
            <p className="stats-number">{watchingStatistic[2]}</p>
            <p className="stats-subtitle">
              {watchingStatistic[2] === 1 ? "HOUR" : "HOURS"}
            </p>
          </div>
        </div>
      </div>

      <div className="single-statistic-wrapper">
        <h1 className="stats-title">Episodes Watched</h1>
        <p className="stats-number">{userWatchedEpisodes}</p>
      </div>

      {/* <div className="single-statistic-wrapper">
        <h1 className="stats-title">Watching Streak</h1>
        <p className="stats-number">15 days</p>
      </div>

      <div className="single-statistic-wrapper">
        <h1 className="stats-title">Watched in November</h1>
        <p className="stats-number">15 episodes</p>
      </div> */}
    </div>
  )
}
