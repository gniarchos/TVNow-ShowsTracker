import React from "react"
import "./Footer.css"
import api_logo from "../images/api-logo.png"
import mdblist_logo from "../images/mdblist_logo.png"
import { Icon } from "@iconify/react"

export default function Footer() {
  return (
    <div className="footer-wrapper">
      <div className="socials">
        <a href="https://github.com/gniarchos/TVTime-ShowsTracker">
          <Icon icon="mdi:github" className="social-icon" width={35} />
        </a>
        <a href="https://www.linkedin.com/in/giannis-niarchos/">
          <Icon icon="mdi:linkedin" className="social-icon" width={35} />
        </a>
      </div>

      <div className="copyright-wrapper">
        <a
          href="https://gniarchos.github.io/portfolio/"
          target="_blank"
          className="copyright link-portfolio"
        >
          Giannis Niarchos
        </a>
        <h4 className="copyright"> © 2022-2023 </h4>
      </div>

      <div className="footer-api">
        <h4>Powered by </h4>
        <img className="api-images" src={api_logo} alt="api-logo" />
        <img className="api-images" src={mdblist_logo} alt="api-logo" />
      </div>
    </div>
  )
}
