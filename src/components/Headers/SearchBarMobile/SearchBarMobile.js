import {
  Autocomplete,
  Backdrop,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material"
import React from "react"
import LiveTvRoundedIcon from "@mui/icons-material/LiveTvRounded"
import TheaterComedyRoundedIcon from "@mui/icons-material/TheaterComedyRounded"
import SearchRoundedIcon from "@mui/icons-material/SearchRounded"

export default function SearchBarMobile({
  showSearchBarMobile,
  setShowSearchBarMobile,
  navigateToSearchResults,
  searchSuggestionsList,
  setSearchValue,
}) {
  return (
    <Backdrop
      sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
      open={showSearchBarMobile}
      onClick={() => {
        setShowSearchBarMobile(false)
        setSearchValue("")
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="navbar-search-bar-mobile-container"
        style={{ width: "100%" }}
      >
        <Autocomplete
          size="small"
          freeSolo
          className="navbar-search-mobile"
          noOptionsText="No results"
          disableClearable={true}
          options={searchSuggestionsList.filter(
            (option) =>
              option?.media_type === "tv" || option?.media_type === "person"
          )}
          getOptionLabel={(option) => option?.name || ""}
          renderOption={(props, option) => {
            const { key, ...otherProps } = props
            return (
              <li key={option.id} {...otherProps}>
                {option?.media_type === "tv" ? (
                  <LiveTvRoundedIcon style={{ marginRight: 8 }} />
                ) : (
                  <TheaterComedyRoundedIcon style={{ marginRight: 8 }} />
                )}{" "}
                {option?.name}
              </li>
            )
          }}
          onChange={() => navigateToSearchResults()}
          renderInput={(params) => (
            <TextField
              autoFocus
              {...params}
              placeholder="Search..."
              onChange={(e) => setSearchValue(e.target.value)}
              InputProps={{
                ...params.InputProps,
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
