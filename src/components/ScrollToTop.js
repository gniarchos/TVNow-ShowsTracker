import React from "react"
import "./ScrollToTop.css"
import { Icon } from "@iconify/react"
// import { useScroll } from "react-hook-scroll"

export default function ScrollToTop() {
  const [showArrow, setShowArrow] = React.useState(false)

  function goToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 750) {
        setShowArrow(true)
      } else {
        setShowArrow(false)
      }
    }

    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <div
      className={
        showArrow ? "scrollToTop_wrapper showButton" : "scrollToTop_wrapper"
      }
    >
      <button className="scrollToTop_btn" onClick={goToTop}>
        <Icon icon="solar:round-arrow-up-bold" width={50} color="white" />
      </button>
    </div>
  )
}
