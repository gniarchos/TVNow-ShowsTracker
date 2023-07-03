import React from "react"
import "./Footer.css"
import api_logo from "../images/api-logo.png"
import mdblist_logo from "../images/mdblist_logo.png"

export default function Footer() {
  return (
    <div className="footer-wrapper">
      <h4 className="copyright">© 2022 - Giannis Niarchos</h4>

      <div className="footer-api">
        <h4>Powered by </h4>
        <img width={50} height={50} src={api_logo} alt="api-logo" />
        <img width={50} height={50} src={mdblist_logo} alt="api-logo" />
      </div>
    </div>
  )
}
