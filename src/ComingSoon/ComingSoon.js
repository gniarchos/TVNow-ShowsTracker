import React from "react"

export default function ComingSoon() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        height: "calc(100vh - 160px)",
      }}
    >
      <h1>More Coming Soon!</h1>
      <p>Stay tuned!</p>

      <p>
        For now use{" "}
        <a
          target="_blank"
          style={{ color: "white" }}
          href="https://tvtime-app-tracker.web.app/"
        >
          Stable TVTime Shows Tracker
        </a>
      </p>
    </div>
  )
}
