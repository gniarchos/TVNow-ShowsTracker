import React from "react"
import "./Footer.css"
import api_logo from "../../images/api-logo.png"
import mdblist_logo from "../../images/mdblist_logo.png"
import fastAPI_logo from "../../images/fastAPI_logo.png"
import supabase_logo from "../../images/supabase_logo.png"
import LinkedInIcon from "@mui/icons-material/LinkedIn"
import GitHubIcon from "@mui/icons-material/GitHub"

export default function Footer() {
  return (
    <div className="footer-wrapper">
      <div className="footer-socials">
        <a
          href="https://github.com/gniarchos/TVTime-ShowsTracker"
          target="_blank"
          aria-label="github"
        >
          <GitHubIcon className="social-icon github" />
        </a>
        <a
          href="https://www.linkedin.com/in/giannis-niarchos/"
          target="_blank"
          aria-label="linkedin"
        >
          <LinkedInIcon className="social-icon linkedin " />
        </a>
      </div>

      <div className="footer-copyright-wrapper">
        <a
          href="https://gniarchos.github.io/portfolio/"
          target="_blank"
          className="footer-copyright footer-link-portfolio"
          aria-label="portfolio link"
        >
          Giannis Niarchos
        </a>
        <p className="footer-copyright"> © {new Date().getFullYear()} </p>
      </div>

      <div className="footer-api-wrapper">
        <span>Powered by: </span>
        <div className="footer-api-container">
          <a
            href="https://www.themoviedb.org/documentation/api"
            target="_blank"
            aria-label="themoviedb api"
          >
            <img className="api-images" src={api_logo} alt="api-logo" />
          </a>
          <a
            href="https://rapidapi.com/linaspurinis/api/mdblist/"
            target="_blank"
            aria-label="rapidapi api"
          >
            <img className="api-images" src={mdblist_logo} alt="api-logo" />
          </a>
          <a
            href="https://fastapi.tiangolo.com/"
            target="_blank"
            aria-label="fastapi api"
          >
            <img className="api-images" src={fastAPI_logo} alt="api-logo" />
          </a>
          <a
            href="https://supabase.com/"
            target="_blank"
            aria-label="supabase api"
          >
            <img className="api-images" src={supabase_logo} alt="api-logo" />
          </a>
        </div>
      </div>
    </div>
  )
}
