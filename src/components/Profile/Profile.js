import React, { useContext } from "react"
import ProfileBanner from "./ProfileBanner/ProfileBanner"
import { LayoutContext } from "../Layout/Layout"
import { Navigate } from "react-router-dom"
import ProfileStatistics from "./ProfileStatistics/ProfileStatistics"

export default function Profile() {
  const { isUserLoggedIn } = useContext(LayoutContext)

  if (!isUserLoggedIn) {
    return <Navigate to="/" replace />
  }

  return (
    <div>
      <ProfileBanner />

      <ProfileStatistics />
    </div>
  )
}
