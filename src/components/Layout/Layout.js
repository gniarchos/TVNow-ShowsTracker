import React, { createContext, useEffect, useState } from "react"
import { Outlet } from "react-router-dom"
import Footer from "../Footer/Footer"
import "../../App.css"
import Navbar from "../Headers/Navbar"
import AutoScrollToTop from "../Other/AutoScrollToTop/AutoScrollToTop"
import { Alert, Snackbar, useMediaQuery } from "@mui/material"
import { useTheme } from "@emotion/react"
// import { SnowOverlay } from "react-snow-overlay"

export const LayoutContext = createContext()

export default function Layout() {
  const isUserLoggedIn = localStorage.getItem("userToken") ? true : false

  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const [snackbarSeverity, setSnackbarSeverity] = useState("")

  const [isWebView, setIsWebView] = useState(false)

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  const layoutValues = {
    isUserLoggedIn: isUserLoggedIn,
    setOpenSnackbar,
    setSnackbarMessage,
    setSnackbarSeverity,
    isWebView,
  }

  const checkIsWebView = () => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera

    // Check for common WebView identifiers
    return (
      !!window.webkit?.messageHandlers || // iOS WebView
      !!window.Android || // Android WebView
      /wv/.test(navigator.userAgent) || // Generic WebView User-Agent
      /WebView/.test(navigator.userAgent)
    )
  }

  useEffect(() => {
    checkIsWebView() ? setIsWebView(true) : setIsWebView(false)
  }, [])

  function defineSnackbarPosition() {
    if (window.matchMedia("(display-mode: standalone)").matches) {
      return "50px"
    } else if (isWebView) {
      return "60px"
    } else {
      return false
    }
  }

  return (
    <LayoutContext.Provider value={layoutValues}>
      <AutoScrollToTop />
      <div
        className={
          !window.matchMedia("(display-mode: standalone)").matches && !isWebView
            ? "layout"
            : "standalone-layout"
        }
      >
        <Navbar />
        <div className="layout-outlet">
          <Outlet />
        </div>

        <Snackbar
          open={openSnackbar}
          autoHideDuration={3000}
          onClose={() => setOpenSnackbar(false)}
          anchorOrigin={{
            vertical: isMobile ? "top" : "bottom",
            horizontal: isMobile ? "center" : "right",
          }}
        >
          <Alert
            onClose={() => setOpenSnackbar(false)}
            severity={snackbarSeverity}
            variant="filled"
            sx={{
              width: "100%",
              // marginTop: defineSnackbarPosition() && "100px",
              marginTop: defineSnackbarPosition(),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>

        {!window.matchMedia("(display-mode: standalone)").matches &&
          !isWebView && <Footer />}
      </div>
    </LayoutContext.Provider>
  )
}
