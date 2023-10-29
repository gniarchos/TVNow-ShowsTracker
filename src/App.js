import React from "react"
import LandingPage from "./components/Landing/LandingPage"
import "./App.css"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AuthProvider } from "./authentication/AuthContext"
import PrivateRoute from "./components/Other/PrivateRoute"
import Home from "./components/Home/Home"
import ShowOverview from "./components/Show/ShowOverview"
import DetailedSliders from "./components/DetailedShowsList/DetailedShowsList"
import Profile from "./components/Profile/Profile"
import People from "./components/People/People"

export default function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/index" element={<LandingPage />} />

            <Route exact path="/" element={<PrivateRoute />}>
              <Route exact path="/" element={<Home />} />
            </Route>

            <Route exact path="/overview" element={<PrivateRoute />}>
              <Route exact path="/overview" element={<ShowOverview />} />
            </Route>

            <Route exact path="/people" element={<PrivateRoute />}>
              <Route exact path="/people" element={<People />} />
            </Route>

            <Route exact path="/discover" element={<PrivateRoute />}>
              <Route exact path="/discover" element={<DetailedSliders />} />
            </Route>

            <Route exact path="/profile" element={<PrivateRoute />}>
              <Route exact path="/profile" element={<Profile />} />
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </div>
  )
}
