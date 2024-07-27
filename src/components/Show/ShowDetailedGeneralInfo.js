import React from "react"
import "./ShowDetailedGeneralInfo.css"
import { Icon } from "@iconify/react"
import { nanoid } from "nanoid"

export default function ShowDetailedGeneralInfo(props) {
  const networkLogos = props.showData.networks?.map((logo) => {
    return (
      <img
        key={logo.id}
        className="logos-img"
        src={`https://image.tmdb.org/t/p/w500/${logo.logo_path}`}
        alt=""
      />
    )
  })

  const creators = props.showData.created_by?.map((creator) => {
    return (
      <p key={creator.id} className="creator">
        {creator.name}
      </p>
    )
  })

  const [started_year, started_month, started_day] =
    props.showData?.first_air_date !== null &&
    props.showData?.first_air_date !== ""
      ? props.showData?.first_air_date.split("-")
      : ["-", "-", "-"]

  const yearStarted =
    started_day !== "-"
      ? `${started_day}-${started_month}-${started_year}`
      : "-"

  const languages = props.showData.languages?.map((language) => {
    return (
      <p key={nanoid()} className="show-languages">
        {language}
      </p>
    )
  })
  console.log(props.showData)
  return (
    <div className="all-details-div">
      {props.showData.external_ids?.facebook_id !== null &&
        props.showData.external_ids?.instagram_id !== null &&
        props.showData.external_ids?.twitter_id !== null &&
        props.showData.external_ids?.imdb_id !== null && (
          <div className="show-social">
            {props.showData.external_ids?.facebook_id !== null && (
              <a
                className="socials-links"
                href={`https://www.facebook.com/watch/${props.showData.external_ids?.facebook_id}`}
              >
                <Icon
                  className="social-img facebook"
                  icon="akar-icons:facebook-fill"
                  width={30}
                />
              </a>
            )}
            {props.showData.external_ids?.instagram_id !== null && (
              <a
                className="socials-links"
                href={`https://www.instagram.com/${props.showData.external_ids?.instagram_id}`}
              >
                <Icon
                  className="social-img instagram"
                  icon="akar-icons:instagram-fill"
                  width={30}
                />
              </a>
            )}
            {props.showData.external_ids?.twitter_id !== null && (
              <a
                className="socials-links"
                href={`https://twitter.com/${props.showData.external_ids?.twitter_id}`}
              >
                <Icon
                  className="social-img twitter"
                  icon="simple-icons:x"
                  width={30}
                />
              </a>
            )}
            {props.showData.external_ids?.imdb_id !== null && (
              <a
                className="socials-links"
                href={`https://www.imdb.com/title/${props.showData.external_ids?.imdb_id}`}
              >
                <Icon className="social-img imdb" icon="cib:imdb" width={30} />
              </a>
            )}
          </div>
        )}

      {props.showData.networks?.length > 0 && (
        <div>
          <h3 className="details-title">
            {props.showData.networks?.length > 1 ? "Networks" : "Network"}
          </h3>
          <div className="logos-networks-div">{networkLogos}</div>
        </div>
      )}

      {creators?.length > 0 && (
        <div>
          <h3 className="details-title">
            {props.showData.created_by?.length > 1 ? "Creators" : "Creator"}
          </h3>
          {creators}
        </div>
      )}

      {yearStarted !== "-" && (
        <div>
          <h3 className="details-title">Year</h3>
          {yearStarted}
        </div>
      )}

      {props.showData.languages?.length > 0 && (
        <div>
          <h3 className="details-title">
            {props.showData.languages?.length > 1 ? "Languages" : "Language"}
          </h3>
          <div className="languages-div">{languages}</div>
        </div>
      )}

      <div>
        <h3 className="details-title">Episodes Runtime</h3>
        <p className="creator">
          {props.showData.episode_run_time?.length > 0
            ? `${props.showData.episode_run_time}'`
            : "-"}
        </p>
      </div>

      <div>
        <h3 className="details-title">Number of Episodes</h3>
        <p className="creator">{props.showData.number_of_episodes}</p>
      </div>

      <div>
        <h3 className="details-title">Type</h3>
        <p className="creator">{props.showData.type}</p>
      </div>
    </div>
  )
}
