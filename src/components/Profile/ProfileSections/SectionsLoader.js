import { useTheme } from "@emotion/react"
import { Button, Skeleton, useMediaQuery } from "@mui/material"
import React from "react"

export default function SectionsLoader({ sectionType }) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"))
  return (
    <div className="profile-sections-wrapper" id="watchlist">
      <div className="profile-section-header">
        <h1 className="profile-section-title">{sectionType}</h1>
      </div>
      <div className="profile-sections-container">
        <div className="profile-sections">
          <Skeleton
            sx={{ bgcolor: "grey.800" }}
            variant="rectangular"
            width={isMobile ? "calc(100vw - 20px)" : 500}
            height={isMobile ? 100 : 281}
          />

          <Skeleton
            sx={{ bgcolor: "grey.800" }}
            variant="rectangular"
            width={isMobile ? "calc(100vw - 20px)" : 500}
            height={isMobile ? 100 : 281}
          />

          <Skeleton
            sx={{ bgcolor: "grey.800" }}
            variant="rectangular"
            width={isMobile ? "calc(100vw - 20px)" : 500}
            height={isMobile ? 100 : 281}
          />
        </div>
      </div>
    </div>
  )
}
