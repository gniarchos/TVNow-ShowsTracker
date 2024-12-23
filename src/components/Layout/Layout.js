import React, { createContext, useState } from "react"
import { Outlet } from "react-router-dom"
import Footer from "../Footer/Footer"
import "../../App.css"
import Navbar from "../Headers/Navbar"
import AutoScrollToTop from "../Other/AutoScrollToTop/AutoScrollToTop"
import { Alert, Snackbar, useMediaQuery } from "@mui/material"
import { useTheme } from "@emotion/react"
import { SnowOverlay } from "react-snow-overlay"

export const LayoutContext = createContext()

export default function Layout() {
  const isUserLoggedIn = localStorage.getItem("userToken") ? true : false

  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const [snackbarSeverity, setSnackbarSeverity] = useState("")

  const queryParams = new URLSearchParams(window.location.search)
  const isWebView = queryParams.get("isWebView") === "true"

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  const layoutValues = {
    isUserLoggedIn: isUserLoggedIn,
    setOpenSnackbar,
    setSnackbarMessage,
    setSnackbarSeverity,
    isWebView,
  }

  return (
    <LayoutContext.Provider value={layoutValues}>
      <AutoScrollToTop />
      <SnowOverlay maxParticles={isMobile ? 50 : 100} />
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
            sx={{ width: "100%" }}
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
