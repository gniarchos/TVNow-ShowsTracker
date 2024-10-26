import React from "react"
import "./App.css"
import {
  BrowserRouter,
  Routes,
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom"
import Home from "./components/Home/Home"
import Layout from "./components/Layout/Layout"
import PageNotFound from "./components/Other/PageNotFound"
import { createTheme } from "@mui/material"
import { ThemeProvider } from "@emotion/react"
import ComingSoon from "./ComingSoon/ComingSoon"
import DetailedShowsList from "./components/DetailedShowsList/DetailedShowsList"
import Show from "./components/Show/Show"
import Person from "./components/Person/Person"
import Profile from "./components/Profile/Profile"

export default function App() {
  const theme = createTheme({
    palette: {
      action: {
        disabledBackground: "#3a3a3abe",
        disabled: "#4D5760",
      },
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
      MuiPaginationItem: {
        styleOverrides: {
          root: {
            color: "white", // Default color for the number buttons
            fontSize: "1.2rem",
            "&:hover": {
              backgroundColor: "rgba(25, 118, 210, 0.3)", // Hover color for the number buttons
            },
          },
          // selected: {
          //   backgroundColor: "#1976d2", // Color for the selected button
          //   color: "#fff", // Text color for the selected button
          //   "&:hover": {
          //     backgroundColor: "#1565c0", // Hover color for the selected button
          //   },
          // },
          outlined: {
            borderColor: "#1976d2", // Border color for outlined buttons
          },
        },
      },
    },
  })

  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<ComingSoon />} />
          <Route path="/discover" element={<DetailedShowsList />} />
          <Route path="/show" element={<Show />} />
          <Route path="/person" element={<Person />} />
          <Route path="/profile" element={<Profile />} />
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
