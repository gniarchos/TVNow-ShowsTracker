import React from "react"
import "./Headers.css"
import logo from "../../images/logo.png"
import { Link } from "react-router-dom"

export default function LandingNavbar(props) {
  const backgroundStyle = {
    background: "transparent",
  }

  return (
    <div style={backgroundStyle} className="navbar-wrapper landing">
      <Link to="/" className="logo-link">
        {/* <img className="logo-img" src={logo} alt="logo" /> */}
        Watchee
      </Link>

      {!props.hideStarting && (
        <button className="login-btn" onClick={props.goToLogin}>
          Login
        </button>
      )}

      {props.hideStarting &&
        (props.showLogin ? (
          <button className="login-btn" onClick={props.switchToSignUp}>
            Sign up
          </button>
        ) : (
          <button className="login-btn" onClick={props.switchToLogin}>
            Login
          </button>
        ))}
    </div>
  )
}
