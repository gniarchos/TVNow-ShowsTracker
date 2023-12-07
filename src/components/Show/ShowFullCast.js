import { useContext, useEffect } from "react"
import { Link } from "react-router-dom"
import noFace from "../../images/no-face.png"
import "./ShowFullCast.css"
import { Icon } from "@iconify/react"
import { ShowOverviewContext } from "./ShowOverview"

export default function ShowFullCast(props) {
  const { showHideFullCast } = useContext(ShowOverviewContext)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const fullCast = props.showData.aggregate_credits?.cast.map((person) => {
    return (
      <Link
        to={`/people?person_name=${person.name}&person_id=${person.id}`}
        key={person.id}
        className="cast-id-full"
      >
        {person.profile_path !== null ? (
          <img
            className="cast-img"
            src={`https://image.tmdb.org/t/p/w500/${person.profile_path}`}
            alt="logo-network"
          />
        ) : (
          <img className="cast-no-img" src={noFace} alt="not-found" />
        )}
        <div className="cast-info-div">
          <h3 className="cast-name">{person.name}</h3>
          <p className="cast-subinfo">{person.roles[0].character}</p>
          <p className="cast-subinfo">
            {person.roles[0].episode_count > 1
              ? `${person.roles[0].episode_count} Episodes`
              : `${person.roles[0].episode_count} Episode`}
          </p>
        </div>
      </Link>
    )
  })

  const fullCrew = props.showData.aggregate_credits?.crew.map((person) => {
    return (
      <Link
        to={`/people?person_name=${person.name}&person_id=${person.id}`}
        key={person.id}
        className="cast-id-full"
      >
        {person.profile_path !== null ? (
          <img
            className="cast-img"
            src={`https://image.tmdb.org/t/p/w500/${person.profile_path}`}
            alt="logo-network"
          />
        ) : (
          <img className="cast-no-img" src={noFace} alt="not-found" />
        )}
        <div className="cast-info-div">
          <h3 className="cast-name">{person.name}</h3>
          <p className="cast-subinfo">{person.known_for_department}</p>
          <p className="cast-subinfo">{person.jobs[0].job}</p>
        </div>
      </Link>
    )
  })

  return (
    <>
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
    </>
  )
}
