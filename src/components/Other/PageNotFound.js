import React from "react"
import "./PageNotFound.css"
import error404 from "../../images/404.png"
import { Link } from "react-router-dom"

export default function PageNotFound() {
  return (
    <div className="page-not-found">
      <h1 className="error404-title">ERROR</h1>
      <img src={error404} alt="error404" />
      <h1>Page Not Found</h1>
      <Link className="go-home-error404" to="/">
        Return to Home page
      </Link>
      <img
        style={{ width: "350px", height: "350px" }}
        src="https://media.giphy.com/media/JY5dig6xQ9S7u/giphy.gif"
        alt="gif"
      />
    </div>
  )
}
