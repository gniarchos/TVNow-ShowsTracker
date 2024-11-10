import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Slide,
  useMediaQuery,
} from "@mui/material"
import React, { useContext, useEffect, useState } from "react"
import "./Authentication.css"
import AccountCircle from "@mui/icons-material/AccountCircle"
import Visibility from "@mui/icons-material/Visibility"
import VisibilityOff from "@mui/icons-material/VisibilityOff"
import apiCaller from "../Api/ApiCaller_NEW"
import { LayoutContext } from "../components/Layout/Layout"
import LockOpenRoundedIcon from "@mui/icons-material/LockOpenRounded"
import { useTheme } from "@emotion/react"
import EmailRoundedIcon from "@mui/icons-material/EmailRounded"
import AppRegistrationRoundedIcon from "@mui/icons-material/AppRegistrationRounded"
import { ThreeDots } from "react-loader-spinner"

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />
})

export default function Authentication({ openAuth, handleCloseAuth }) {
  const [showPassword, setShowPassword] = useState(false)
  const [loginInputs, setLoginInputs] = useState({
    username: "",
    password: "",
  })
  const [signupInputs, setSignupInputs] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  })
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const [authMode, setAuthMode] = useState("login")
  const [loading, setLoading] = useState(false)

  const handleClickShowPassword = () => setShowPassword((show) => !show)

  const { setOpenSnackbar, setSnackbarMessage, setSnackbarSeverity } =
    useContext(LayoutContext)

  useEffect(() => {
    if (openAuth) {
      setLoginInputs({ username: "", password: "" })
      setSignupInputs({
        email: "",
        username: "",
        password: "",
        confirmPassword: "",
      })
    }
  }, [openAuth])

  function handleLoginUser(e) {
    setLoading(true)
    e.preventDefault()
    const data_to_post = new URLSearchParams({
      username: loginInputs.username,
      password: loginInputs.password,
    })

    apiCaller({
      url: `${process.env.REACT_APP_BACKEND_API_URL}/users/login`,
      method: "POST",
      contentType: "application/x-www-form-urlencoded",
      body: data_to_post,
      calledFrom: "login",
      isResponseJSON: true,
      extras: null,
    })
      .then(() => {
        apiCaller({
          url: `${process.env.REACT_APP_BACKEND_API_URL}/users/me`,
          method: "GET",
          contentType: "application/json",
          body: null,
          calledFrom: "me",
          isResponseJSON: true,
          extras: null,
        })
          .then(() => {
            setLoading(false)
            handleCloseAuth()
            setOpenSnackbar(true)
            setSnackbarSeverity("success")
            setSnackbarMessage(`Welcome back ${loginInputs.username}!`)
          })
          .catch((error) => {
            throw new Error(error.message)
          })
      })
      .catch((error) => {
        setLoading(false)
        setOpenSnackbar(true)
        setSnackbarSeverity("error")
        setSnackbarMessage(error.message)
      })
  }

  function handleRegisterUser(e) {
    setLoading(true)
    e.preventDefault()
    if (signupInputs.password !== signupInputs.confirmPassword) {
      setOpenSnackbar(true)
      setSnackbarSeverity("error")
      setSnackbarMessage("Passwords do not match")
      return
    }

    const data_to_post = {
      email: signupInputs.email,
      username: signupInputs.username,
      password: signupInputs.password,
    }

    apiCaller({
      url: `${process.env.REACT_APP_BACKEND_API_URL}/users/register`,
      method: "POST",
      contentType: "application/json",
      body: JSON.stringify(data_to_post),
      calledFrom: "register",
      isResponseJSON: true,
      extras: null,
    })
      .then((data) => {
        setLoading(false)
        // handleCloseAuth()
        setAuthMode("login")
        setOpenSnackbar(true)
        setSnackbarSeverity("success")
        setSnackbarMessage(`Registered successfully!`)
      })
      .catch((error) => {
        setLoading(false)
        setOpenSnackbar(true)
        setSnackbarSeverity("error")
        setSnackbarMessage(error.message)
      })
  }

  function handleAuthMode(changeTo) {
    setAuthMode(changeTo)
    setLoginInputs({ username: "", password: "" })
    setSignupInputs({
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
    })
  }

  const defineModeContent = () => {
    switch (authMode) {
      case "login":
        return (
          <DialogContent className="auth-dialog-content">
            <div className="auth-dialog-header">
              <LockOpenRoundedIcon sx={{ color: "white", mb: 1 }} />
              <h3 className="auth-dialog-title">Login</h3>
              <span
                onClick={() => handleAuthMode("signup")}
                className="auth-dialog-text"
              >
                Don't have an account?{" "}
                <span
                  style={{
                    fontWeight: "600",
                    textDecoration: "underline",
                    color: "blue",
                    cursor: "pointer",
                  }}
                >
                  Sign Up
                </span>{" "}
                now!
              </span>
            </div>

            <div className="auth-dialog-form">
              <FormControl
                sx={{
                  width: "100%",
                  "& .MuiOutlinedInput-root": { border: "none" },
                }}
                variant="outlined"
              >
                <InputLabel required htmlFor="outlined-adornment-username">
                  Username
                </InputLabel>
                <OutlinedInput
                  required
                  id="outlined-adornment-username"
                  value={loginInputs.username}
                  onChange={(e) =>
                    setLoginInputs({ ...loginInputs, username: e.target.value })
                  }
                  type="text"
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        sx={{ cursor: "default" }}
                        disableRipple
                        tabIndex={-1}
                        edge="end"
                      >
                        <AccountCircle />
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Username"
                />
              </FormControl>

              <FormControl sx={{ width: "100%" }} variant="outlined">
                <InputLabel required htmlFor="outlined-adornment-password">
                  Password
                </InputLabel>
                <OutlinedInput
                  required
                  id="outlined-adornment-password"
                  value={loginInputs.password}
                  onChange={(e) =>
                    setLoginInputs({ ...loginInputs, password: e.target.value })
                  }
                  type={showPassword ? "text" : "password"}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        tabIndex={-1}
                        onClick={handleClickShowPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Password"
                />
              </FormControl>
            </div>
          </DialogContent>
        )
      case "signup":
        return (
          <DialogContent className="auth-dialog-content">
            <div className="auth-dialog-header">
              <AppRegistrationRoundedIcon sx={{ color: "white", mb: 1 }} />
              <h3 className="auth-dialog-title">Create an Account</h3>
              <span
                onClick={() => handleAuthMode("login")}
                className="auth-dialog-text"
              >
                Already have an account?{" "}
                <span
                  style={{
                    fontWeight: "600",
                    textDecoration: "underline",
                    color: "blue",
                    cursor: "pointer",
                  }}
                >
                  Login
                </span>{" "}
              </span>
            </div>

            <div className="auth-dialog-form">
              <FormControl
                sx={{
                  width: "100%",
                  "& .MuiOutlinedInput-root": { border: "none" },
                }}
                variant="outlined"
              >
                <InputLabel required htmlFor="outlined-adornment-email">
                  Email
                </InputLabel>
                <OutlinedInput
                  required
                  id="outlined-adornment-email"
                  value={signupInputs.email}
                  onChange={(e) =>
                    setSignupInputs({ ...signupInputs, email: e.target.value })
                  }
                  type="email"
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        sx={{ cursor: "default" }}
                        disableRipple
                        tabIndex={-1}
                        edge="end"
                      >
                        <EmailRoundedIcon />
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Email"
                />
              </FormControl>
              <FormControl
                sx={{
                  width: "100%",
                  "& .MuiOutlinedInput-root": { border: "none" },
                }}
                variant="outlined"
              >
                <InputLabel required htmlFor="outlined-adornment-username">
                  Username
                </InputLabel>
                <OutlinedInput
                  required
                  id="outlined-adornment-username"
                  value={signupInputs.username}
                  onChange={(e) =>
                    setSignupInputs({
                      ...signupInputs,
                      username: e.target.value,
                    })
                  }
                  type="text"
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton disableRipple tabIndex={-1} edge="end">
                        <AccountCircle />
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Username"
                />
              </FormControl>

              <FormControl sx={{ width: "100%" }} variant="outlined">
                <InputLabel required htmlFor="outlined-adornment-password">
                  Password
                </InputLabel>
                <OutlinedInput
                  required
                  id="outlined-adornment-password"
                  value={signupInputs.password}
                  onChange={(e) =>
                    setSignupInputs({
                      ...signupInputs,
                      password: e.target.value,
                    })
                  }
                  type={showPassword ? "text" : "password"}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        tabIndex={-1}
                        onClick={handleClickShowPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Password"
                />
              </FormControl>

              <FormControl sx={{ width: "100%" }} variant="outlined">
                <InputLabel
                  required
                  htmlFor="outlined-adornment-confirm-password"
                >
                  Confirm Password
                </InputLabel>
                <OutlinedInput
                  required
                  id="outlined-adornment-confirm-password"
                  value={signupInputs.confirmPassword}
                  onChange={(e) =>
                    setSignupInputs({
                      ...signupInputs,
                      confirmPassword: e.target.value,
                    })
                  }
                  type={showPassword ? "text" : "password"}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        tabIndex={-1}
                        onClick={handleClickShowPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Confirm Password"
                />
              </FormControl>
            </div>
          </DialogContent>
        )
      default:
        return null
    }
  }

  return (
    <Dialog
      open={openAuth}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleCloseAuth}
      maxWidth="sm"
      fullWidth
      sx={{
        "& .MuiPaper-root": {
          borderRadius: "10px",
          padding: isMobile ? "5px" : "20px",
          background: "rgba(255, 255, 255, 0.8)",
          boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
          backdropFilter: "blur(4.9px)",
          border: "1px solid rgba(255, 255, 255, 0.26)",
        },
      }}
    >
      <form
        onSubmit={authMode === "login" ? handleLoginUser : handleRegisterUser}
      >
        {defineModeContent()}
        <DialogActions sx={{ justifyContent: "center" }}>
          {authMode === "login" ? (
            <Button
              sx={{ width: "90%" }}
              size={isMobile ? "small" : "medium"}
              type="submit"
              disabled={loading}
              color="primary"
              variant="contained"
              onClick={handleLoginUser}
            >
              {loading ? (
                <ThreeDots
                  visible={true}
                  height="25"
                  width="25"
                  color="white"
                  radius="9"
                  ariaLabel="three-dots-loading"
                  wrapperStyle={{}}
                  wrapperClass=""
                />
              ) : (
                "Login"
              )}
            </Button>
          ) : (
            <Button
              sx={{ width: "90%" }}
              size={isMobile ? "small" : "medium"}
              color="primary"
              disabled={loading}
              variant="contained"
              type="submit"
              // onClick={handleRegisterUser}
            >
              {loading ? (
                <ThreeDots
                  visible={true}
                  height="25"
                  width="25"
                  color="white"
                  radius="9"
                  ariaLabel="three-dots-loading"
                  wrapperStyle={{}}
                  wrapperClass=""
                />
              ) : (
                "Sign Up"
              )}
            </Button>
          )}
        </DialogActions>
      </form>
    </Dialog>
  )
}
