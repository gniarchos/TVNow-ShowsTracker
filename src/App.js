import React from "react"
import LandingPage from "./components/LandingPage"
import "./app.css"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { AuthProvider } from "./authentication/AuthContext"
import PrivateRoute from "./components/PrivateRoute"
import Home from "./components/Home"
import ShowOverview from "./components/ShowOverview"
import DetailedSliders from "./components/DetailedSliders"
import Profile from "./components/Profile"

export default function App() {
  return (
    <div className="App">
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/index" element={<LandingPage />} />

            <Route exact path="/" element={<PrivateRoute />}>
              <Route exact path="/" element={<Home />} />
            </Route>

            <Route exact path="/overview" element={<PrivateRoute />}>
              <Route exact path="/overview" element={<ShowOverview />} />
            </Route>

            <Route exact path="/discover" element={<PrivateRoute />}>
              <Route exact path="/discover" element={<DetailedSliders />} />
            </Route>

            <Route exact path="/profile" element={<PrivateRoute />}>
              <Route exact path="/profile" element={<Profile />} />
            </Route>
          </Routes>
        </AuthProvider>
      </Router>
    </div>
  )
}
