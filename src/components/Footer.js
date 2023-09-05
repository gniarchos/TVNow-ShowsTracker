import React from "react"
import "./Footer.css"
import api_logo from "../images/api-logo.png"
import mdblist_logo from "../images/mdblist_logo.png"
import { Icon } from "@iconify/react"

export default function Footer() {
  return (
    <div className="footer-wrapper">
      <div className="socials">
        <a
          href="https://github.com/gniarchos/TVTime-ShowsTracker"
          aria-label="github"
        >
          <Icon icon="mdi:github" className="social-icon" width={35} />
        </a>
        <a
          href="https://www.linkedin.com/in/giannis-niarchos/"
          aria-label="linkedin"
        >
          <Icon icon="mdi:linkedin" className="social-icon" width={35} />
        </a>
      </div>

      <div className="copyright-wrapper">
        <a
          href="https://gniarchos.github.io/portfolio/"
          target="_blank"
          className="copyright link-portfolio"
          aria-label="portfolio link"
        >
          Giannis Niarchos
        </a>
        <p className="copyright"> © 2022-2023 </p>
      </div>

      <div className="footer-api">
        <p>Powered by </p>
        <a
          href="https://www.themoviedb.org/documentation/api"
          target="_blank"
          aria-label="themoviedb api"
        >
          <img
            className="api-images"
            src={api_logo}
            alt="api-logo"
            width="50"
          />
        </a>
        <a
          href="https://rapidapi.com/linaspurinis/api/mdblist/"
          target="_blank"
          aria-label="rapidapi api"
        >
          <img
            className="api-images"
            src={mdblist_logo}
            alt="api-logo"
            width="50"
          />
        </a>
      </div>
    </div>
  )
}
