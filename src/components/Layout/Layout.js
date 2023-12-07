import React from "react"
import { Outlet } from "react-router-dom"
import MainNavbar from "../Headers/MainNavbar"
import Footer from "../Footer/Footer"
import { useAuth } from "../../authentication/AuthContext"
import "../../App.css"

export default function Layout() {
  const { currentUser } = useAuth()

  let isLoggedIn = false

  if (currentUser === null) {
    isLoggedIn = false
  } else {
    isLoggedIn = true
  }

  return (
    <div
      className={
        !window.matchMedia("(display-mode: standalone)").matches
          ? "layout"
          : "standalone-layout"
      }
    >
      {isLoggedIn && <MainNavbar />}
      <Outlet />
      {!window.matchMedia("(display-mode: standalone)").matches && <Footer />}
    </div>
  )
}
