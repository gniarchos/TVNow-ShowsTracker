import React from "react"
import { Link } from "react-router-dom"
import noImg from "../../images/no-image.png"

export default function ShowMovieCard({ info, crew, series }) {
  return (
    <Link
      to={
        series
          ? `/show?show_name=${info.name}&show_id=${info.id}`
          : `https://www.google.com/search?q=${info.title}%20movie&oq=${info.title}%20movie`
      }
      target={!series ? "_blank" : "_self"}
      key={info.id}
      className="person-shows-list-card-content"
    >
      <div className="person-shows-list-card-content">
        <div className="person-shows-list-card-img-wrapper">
          {info.poster_path !== null ? (
            <img
              className="person-shows-list-card-img"
              src={`https://image.tmdb.org/t/p/w500/${info.poster_path}`}
            />
          ) : (
            <img className="people-no-media-img" src={noImg} alt="not-found" />
          )}
        </div>

        <div className="person-shows-list-card-info">
          {series ? (
            <span className="person-shows-list-card-title">{info.name}</span>
          ) : (
            <span className="person-shows-list-card-title">{info.title}</span>
          )}
          {crew ? (
            <span className="person-shows-list-card-subtitle">{info.job}</span>
          ) : (
            <span className="person-shows-list-card-subtitle">
              {info.character}
            </span>
          )}
          {series && info.episode_count && (
            <span className="person-shows-list-card-subtitle">
              {info.episode_count}{" "}
              {info.episode_count > 1 ? "episodes" : "episode"}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
