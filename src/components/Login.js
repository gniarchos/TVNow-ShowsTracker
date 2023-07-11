import React from "react"
import "./Login.css"
import eye_off from "../images/eye-off.png"
import eye from "../images/eye.png"
import email from "../images/email.png"
import { useAuth } from "../authentication/AuthContext"
import { Link, useNavigate } from "react-router-dom"
import { Icon } from "@iconify/react"

export default function Login() {
  document.title = "TVTime | Login "

  const [mustShowPass, setMustShowPass] = React.useState(false)
  const [error, setError] = React.useState("")

  const emailRef = React.useRef()
  const passwordRef = React.useRef()
  const { login, loginGoogle, resetPassword } = useAuth()
  const navigate = useNavigate()

  const [message, setMessage] = React.useState("")
  const [forgotPass, setForgotPass] = React.useState(false)

  async function handleSubmit(e) {
    e.preventDefault()

    if (!resetPassword) {
      try {
        setError("")
        await login(emailRef.current.value, passwordRef.current.value)
        navigate("/")
      } catch {
        setError("Incorrect email or password")
      }
    } else {
      try {
        setMessage("")
        setError("")
        await resetPassword(emailRef.current.value)
        setMessage("Check your email inbox for instructions")
      } catch {
        setError("Failed to reset password. Try again")
      }
    }
  }

  function togglePasswordVisibility() {
    setMustShowPass(!mustShowPass)
  }

  const toggleStyleHidden = {
    display: mustShowPass ? "none" : "block",
  }

  const toggleStyleVisible = {
    display: !mustShowPass ? "none" : "block",
  }

  function handleForgotPassword() {
    setForgotPass(true)
  }

  return (
    <div className="login-wrapper">
      <div className="login-bg">
        <form onSubmit={handleSubmit} className="form-div">
          <h1>{forgotPass ? "Reset Password" : "Login"}</h1>
          {error && (
            <p className="error-messages">
              <Icon icon="fluent:error-circle-12-filled" />
              {error}
            </p>
          )}
          {message && (
            <p className="success-messages">
              <Icon icon="mdi:success-bold" />
              {message}
            </p>
          )}
          <div className="div-field">
            <input
              className="input-text"
              type="email"
              placeholder="Email*"
              ref={emailRef}
              required
            />
            <span className="span-img">
              <img className="email-img" src={email} alt="email" />
            </span>
          </div>

          {forgotPass === false && (
            <div className="div-field">
              <input
                className="input-text password"
                type={mustShowPass ? "text" : "password"}
                placeholder="Password*"
                required
                ref={passwordRef}
              />
              <span className="span-img" onClick={togglePasswordVisibility}>
                <img
                  style={toggleStyleHidden}
                  className="eye-off-img-log"
                  src={eye_off}
                  alt="eye-off"
                />
              </span>
              <span className="span-img" onClick={togglePasswordVisibility}>
                <img
                  style={toggleStyleVisible}
                  className="eye-img-log"
                  src={eye}
                  alt="eye"
                />
              </span>
            </div>
          )}

          {!forgotPass && (
            <div className="forgotPassword-link">
              <p onClick={handleForgotPassword} className="link-forgotPass">
                Forgot your password?
              </p>
            </div>
          )}

          <button type="submit" className="login-form-btn">
            {forgotPass ? "Submit" : "Login"}
          </button>
        </form>
      </div>
    </div>
  )
}
