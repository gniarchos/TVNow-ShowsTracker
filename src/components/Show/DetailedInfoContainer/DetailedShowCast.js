import { useContext } from "react"
import "./DetailedShowCast.css"
import noFace from "../../../images/no-face.png"
import { Link } from "react-router-dom"
import { Icon } from "@iconify/react"
import { ShowOverviewContext } from "../ShowOverview"

export default function DetailedShowCast(props) {
  const { showHideFullCast } = useContext(ShowOverviewContext)
  const cast = props.showData.aggregate_credits?.cast
    ?.slice(0, 10)
    .map((person) => {
      return (
        <Link
          to={`/people?person_name=${person.name}&person_id=${person.id}`}
          key={person.id}
          className="cast-id"
        >
          {person.profile_path !== null ? (
            <img
              className="cast-img-profile"
              src={`https://image.tmdb.org/t/p/w500/${person.profile_path}`}
              alt="logo-network"
            />
          ) : (
            <img className="cast-no-img-profile" src={noFace} alt="not-found" />
          )}
          <div className="cast-info-div-profile">
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

  return (
    <>
      {cast?.length > 0 && (
        <div className="cast-wrapper">
          <h1>Series Cast</h1>
          <div className="cast-div">
            {cast}
            <div className="fullListCast-div">
              <button
                onClick={showHideFullCast}
                to={`/show/full-cast?show_name=${props.show_name}&show_id=${props.show_id}`}
                type="button"
                className="all-cast-btn"
              >
                Full List
                <Icon icon="codicon:arrow-small-right" width={40} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
