import React from "react"
import "./MovieGeneralInfo.css"
import { FaImdb } from "react-icons/fa"
import { FaFacebook } from "react-icons/fa"
import { FaInstagram } from "react-icons/fa"
import { FaXTwitter } from "react-icons/fa6"

export default function MovieGeneralInfo({ movieData }) {
  const productionCompaniesLogos = movieData.production_companies
    ?.filter((company) => company.logo_path !== null)
    .map((logo) => {
      return (
        <img
          key={logo.id}
          className="movie-general-info-logos-img"
          src={`https://image.tmdb.org/t/p/w500/${logo.logo_path}`}
          alt=""
        />
      )
    })

  const spokenLanguages = movieData.spoken_languages?.map((language, index) => {
    return (
      <p key={index} className="movie-general-info-language">
        {language.iso_639_1}
      </p>
    )
  })

  return (
    <div className="movie-general-info-wrapper">
      <div className="movie-general-info-socials-links">
        {movieData.external_ids?.facebook_id !== null && (
          <a
            className="movie-general-info-socials-links"
            href={`https://www.facebook.com/watch/${movieData.external_ids?.facebook_id}`}
          >
            <FaFacebook className="movie-general-info-social-img fb" />
          </a>
        )}
        {movieData.external_ids?.instagram_id !== null && (
          <a
            className="movie-general-info-socials-links"
            href={`https://www.instagram.com/${movieData.external_ids?.instagram_id}`}
          >
            <FaInstagram className="movie-general-info-social-img instagram" />
          </a>
        )}
        {movieData.external_ids?.twitter_id !== null && (
          <a
            className="movie-general-info-socials-links"
            href={`https://twitter.com/${movieData.external_ids?.twitter_id}`}
          >
            <FaXTwitter className="movie-general-info-social-img xTwitter" />
          </a>
        )}
        {movieData.external_ids?.imdb_id !== null && (
          <a
            className="movie-general-info-socials-links"
            href={`https://www.imdb.com/title/${movieData.external_ids?.imdb_id}`}
          >
            <FaImdb className="movie-general-info-social-img imdb" />
          </a>
        )}
      </div>

      {movieData.production_companies?.length > 0 && (
        <div className="movie-general-info-networks-container">
          <h3 className="movie-general-info-titles">
            {movieData.production_companies?.length > 1
              ? "Production Companies"
              : "Production Company"}
          </h3>
          <div className="movie-general-info-networks-wrapper">
            {productionCompaniesLogos}
          </div>
        </div>
      )}

      {movieData.original_language && (
        <div>
          <h3 className="movie-general-info-titles">Language</h3>
          <div className="movie-general-info-container">
            <p className="movie-general-info-language">
              {movieData.original_language}
            </p>
          </div>
        </div>
      )}

      {movieData.spoken_languages.length > 0 && (
        <div>
          <h3 className="movie-general-info-titles">
            {movieData.spoken_languages.length > 1
              ? "Spoken Languages"
              : "Spoken Language"}
          </h3>
          <div className="movie-general-info-container">{spokenLanguages}</div>
        </div>
      )}
    </div>
  )
}
