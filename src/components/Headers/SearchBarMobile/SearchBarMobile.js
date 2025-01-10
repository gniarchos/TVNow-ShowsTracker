import {
  Autocomplete,
  Backdrop,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material"
import React, { useEffect, useRef } from "react"
import LiveTvRoundedIcon from "@mui/icons-material/LiveTvRounded"
import TheaterComedyRoundedIcon from "@mui/icons-material/TheaterComedyRounded"
import SearchRoundedIcon from "@mui/icons-material/SearchRounded"

export default function SearchBarMobile({
  showSearchBarMobile,
  setShowSearchBarMobile,
  navigateToSearchResults,
  searchSuggestionsList,
  setSearchValue,
  navigateToSelectedOption,
  navigateOnEnter,
  searchValue,
  defineSearchIcon,
}) {
  return (
    <Backdrop
      sx={(theme) => ({
        color: "#fff",
        zIndex: theme.zIndex.drawer + 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        marginTop: "50px",
      })}
      open={showSearchBarMobile}
      onClick={() => {
        setShowSearchBarMobile(false)
        setSearchValue("")
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="navbar-search-bar-mobile-container"
      >
        <Autocomplete
          inputValue={searchValue}
          size="small"
          freeSolo
          className="navbar-search-mobile"
          noOptionsText="No results"
          disableClearable={true}
          options={searchSuggestionsList}
          getOptionLabel={(option) => {
            if (option?.media_type === "tv") {
              return option?.name
            } else if (option?.media_type === "person") {
              return option?.name
            } else if (option?.media_type === "movie") {
              return option?.title
            }
          }}
          renderOption={(props, option) => {
            const { key, ...otherProps } = props
            return (
              <li key={option.id} {...otherProps}>
                {defineSearchIcon(option?.media_type)}
                {option?.name || option?.title}
              </li>
            )
          }}
          onChange={(e, selectedOption) => {
            navigateToSelectedOption(e, selectedOption)
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Search a show, movie or person..."
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={(e) => navigateOnEnter(e)}
              InputProps={{
                ...params.InputProps,
                sx: { height: "60px !important" },
                endAdornment: (
                  <>
                    {params.InputProps.endAdornment}
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => navigateToSearchResults()}
                        edge="end"
                      >
                        <SearchRoundedIcon />
                      </IconButton>
                    </InputAdornment>
                  </>
                ),
              }}
            />
          )}
        />
      </div>
    </Backdrop>
  )
}
