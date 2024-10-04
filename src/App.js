import React from "react"
import LandingPage from "./components/Landing/LandingPage"
import "./App.css"
import {
  BrowserRouter,
  Routes,
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom"
import { AuthProvider } from "./authentication/AuthContext"
import PrivateRoute from "./components/Other/PrivateRoute"
import Home from "./components/Home/Home"
import ShowOverview from "./components/Show/ShowOverview"
import DetailedSliders from "./components/DetailedShowsList/DetailedShowsList"
import Profile from "./components/Profile/Profile"
import People from "./components/People/People"
import Layout from "./components/Layout/Layout"
import PageNotFound from "./components/Other/PageNotFound"
import { createTheme } from "@mui/material"
import { ThemeProvider } from "@emotion/react"
import ComingSoon from "./ComingSoon/ComingSoon"

export default function App() {
  const theme = createTheme({
    palette: {
      primary: {
        main: "#dd840c",
        dark: "#b35e0a",
        contrastText: "#ffffff",
      },
      secondary: {
        main: "#337AB7",
        dark: "#004E8C",
        contrastText: "#ffffff",
      },
      third: {
        main: "#212d38",
        dark: "#4D5760",
        contrastText: "#ffffff",
      },
      primaryFaded: {
        main: "#4D5760",
        dark: "#212d38",
        contrastText: "#ffffff",
      },
      white: {
        main: "#ffffff",
        dark: "#CFCFCF",
        contrastText: "#212d38",
      },
      save: {
        main: "#008000",
        dark: "#1b5e20",
        contrastText: "#ffffff",
      },
      edit: {
        main: "#F28A00",
        dark: "#CC7400",
        contrastText: "#ffffff",
      },
      cancel: {
        main: "#c62828",
        dark: "#A51919",
        contrastText: "#ffffff",
      },
      success: {
        main: "#008000",
        dark: "#1b5e20",
        contrastText: "#ffffff",
      },
      error: {
        main: "#c62828",
        dark: "#A51919",
        contrastText: "#ffffff",
      },
      disabledCustom: {
        main: "rgba(211, 211, 211, 0.5)",
        dark: "#8C8C8C",
        contrastText: "#ffffff",
      },
    },
    typography: {
      button: {
        textTransform: "none",
      },
      fontFamily: ["Chillax", `sans-serif`].join(","),
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
            borderRadius: "10px",
          },
        },
      },
      MuiAutocomplete: {
        styleOverrides: {
          popper: {
            zIndex: 1500, // Set your desired z-index here
          },
        },
      },
    },
  })

  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        {/* <Route path="/login" element={<Login />} />

        <Route path="/" element={<PrivateRoute />}>
          <Route path="/lab-selection" element={<LabSelector />} />
          <Route element={<Layout />}>
            <Route path="*" element={<PageNotFound />} />
            <Route path="/" element={<Patients />} />
            <Route path="/orders" element={<Orders />}>
              <Route path=":patientID" element={<Orders />} />
            </Route>
            <Route path="/results" element={<Results />}>
              <Route path=":patientID" element={<Results />} />
            </Route>
            <Route path="/tests-results" element={<ResultsTests />} />
            <Route path="/daily-results" element={<ResultsDaily />} />
          </Route>
        </Route> */}

        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<ComingSoon />} />
        </Route>
      </>
    )
  )

  return (
    <div className="App">
      {/* <BrowserRouter>
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
      </BrowserRouter> */}
      <ThemeProvider theme={theme}>
        <RouterProvider router={router} />
      </ThemeProvider>
    </div>
  )
}
