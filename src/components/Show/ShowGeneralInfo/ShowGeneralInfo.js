import React from "react"
import "./ShowGeneralInfo.css"
import { Icon } from "@iconify/react"
import { FaImdb } from "react-icons/fa"
import { FaFacebook } from "react-icons/fa"
import { FaInstagram } from "react-icons/fa"
import { FaXTwitter } from "react-icons/fa6"
import dayjs from "dayjs"

export default function ShowGeneralInfo({ showData }) {
  const networkLogos = showData.networks?.map((logo) => {
    return (
      <img
        key={logo.id}
        className="show-general-info-logos-img"
        src={`https://image.tmdb.org/t/p/w500/${logo.logo_path}`}
        alt=""
      />
    )
  })

  const creators = showData.created_by?.map((creator) => {
    return (
      <p key={creator.id} className="show-general-info-details">
        {creator.name}
      </p>
    )
  })

  const languages = showData.languages?.map((language) => {
    return (
      <p key={language} className="show-general-info-language">
        {language}
      </p>
    )
  })

  return (
    <div className="show-general-info-wrapper">
      <div className="show-general-info-socials-links">
        {showData.external_ids?.facebook_id !== null && (
          <a
            className="show-general-info-socials-links"
            href={`https://www.facebook.com/watch/${showData.external_ids?.facebook_id}`}
          >
            <FaFacebook className="show-general-info-social-img fb" />
          </a>
        )}
        {showData.external_ids?.instagram_id !== null && (
          <a
            className="show-general-info-socials-links"
            href={`https://www.instagram.com/${showData.external_ids?.instagram_id}`}
          >
            <FaInstagram className="show-general-info-social-img instagram" />
          </a>
        )}
        {showData.external_ids?.twitter_id !== null && (
          <a
            className="show-general-info-socials-links"
            href={`https://twitter.com/${showData.external_ids?.twitter_id}`}
          >
            <FaXTwitter className="show-general-info-social-img xTwitter" />
          </a>
        )}
        {showData.external_ids?.imdb_id !== null && (
          <a
            className="show-general-info-socials-links"
            href={`https://www.imdb.com/title/${showData.external_ids?.imdb_id}`}
          >
            <FaImdb className="show-general-info-social-img imdb" />
          </a>
        )}
      </div>

      {showData.networks?.length > 0 && (
        <div className="show-general-info-networks-container">
          <h3 className="show-general-info-titles">
            {showData.networks?.length > 1 ? "Networks" : "Network"}
          </h3>
          <div className="show-general-info-networks-wrapper">
            {networkLogos}
          </div>
        </div>
      )}

      {creators?.length > 0 && (
        <div>
          <h3 className="show-general-info-titles">
            {showData.created_by?.length > 1 ? "Creators" : "Creator"}
          </h3>
          {creators}
        </div>
      )}

      {showData.first_air_date !== null && (
        <div>
          <h3 className="show-general-info-titles">Year</h3>
          <p className="show-general-info-details">
            {dayjs(showData.first_air_date).format("DD-MM-YYYY")}
          </p>
        </div>
      )}

      {showData.languages?.length > 0 && (
        <div>
          <h3 className="show-general-info-titles">
            {showData.languages?.length > 1 ? "Languages" : "Language"}
          </h3>
          <div className="show-general-info-container">{languages}</div>
        </div>
      )}

      <div>
        <h3 className="show-general-info-titles">Episodes Runtime</h3>
        <p className="show-general-info-details">
          {showData.episode_run_time?.length > 0
            ? `${showData.episode_run_time}'`
            : "-"}
        </p>
      </div>

      <div>
        <h3 className="show-general-info-titles">Number of Episodes</h3>
        <p className="show-general-info-details">
          {showData.number_of_episodes}
        </p>
      </div>

      <div>
        <h3 className="show-general-info-titles">Type</h3>
        <p className="show-general-info-details">{showData.type}</p>
      </div>
    </div>
  )
}
