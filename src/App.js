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
import Layout from "./components/Layout/Layout"
import PageNotFound from "./components/Other/PageNotFound"

export default function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route index path="/index" element={<LandingPage />} />
            <Route path="/" element={<PrivateRoute />}>
              <Route element={<Layout />}>
                <Route path="/" element={<Home />} />

                <Route path="/show" element={<ShowOverview />} />

                <Route path="/people" element={<People />} />

                <Route path="/discover" element={<DetailedSliders />} />

                <Route path="/profile" element={<Profile />} />

                <Route path="/error404" element={<PageNotFound />} />
                <Route path="*" element={<PageNotFound />} />
              </Route>
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </div>
  )
}
