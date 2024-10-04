import React, { createContext } from "react"
import { Outlet } from "react-router-dom"
import MainNavbar from "../Headers/MainNavbar"
import Footer from "../Footer/Footer"
import { useAuth } from "../../authentication/AuthContext"
import "../../App.css"
import Navbar from "../Headers/Navbar"

export const LayoutContext = createContext()

export default function Layout() {
  const isUserLoggedIn = localStorage.getItem("accessToken")
  // const { currentUser } = useAuth()

  // let isLoggedIn = false

  // if (currentUser === null) {
  //   isLoggedIn = false
  // } else {
  //   isLoggedIn = true
  // }

  const layoutValues = {
    isUserLoggedIn: isUserLoggedIn,
  }

  return (
    <LayoutContext.Provider value={layoutValues}>
      <div
        className={
          !window.matchMedia("(display-mode: standalone)").matches
            ? "layout"
            : "standalone-layout"
        }
      >
        {/* {isLoggedIn && <MainNavbar />} */}
        {/* <MainNavbar /> */}
        <Navbar />
        <Outlet />
        {!window.matchMedia("(display-mode: standalone)").matches && <Footer />}
      </div>
    </LayoutContext.Provider>
  )
}
