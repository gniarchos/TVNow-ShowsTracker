# Changelog

## [1.6.2] - 6-8-2023

### Added

- Added image not available in shows overview episodes if no image is available
- Added aired date and runtime in episodes previews in show page

### Updated

- Updated background color in PWA mode
- Improved the way of images loading in profile page
- UI improvements in show name and info in shows pages
- UI improvements in episodes in shows pages

### Fixed

- Fixed a spacing issues on shows page

---

## [1.6.1] - 2-8-2023

### Added

- Added PWA (standalone app) support
- Added changelog.md file

### Updated

- Updated README on github

### Removed

- Removed unnecessary video files

---

## [1.6.0] - 30-7-2023

### Added

- [BETA] Added mark seasons as unwatched from History section

### Updated

- Updated the implementation of deleting an episode/season from History
- Updated favicon to support all browsers and systems

---

## [1.5.6] - 28-7-2023

### Added

- Added a popup in profile in mobile when layout is changed
- Added a link leading to my portfolio in footer
- Added a confirmation popup when user click log out

### Updated

- Updated animations in cover selection

### Fixed

- Fixed some compatibility issues with Firefox browser
- Fixed UI in shows genres on mobile
- Fixed an issue with layout popup
- Fixed an issue when on search function in multiple searches not settings page to 1

---

## [1.5.5] - 20-7-2023

### Added

- Added a feature to sort shows by last watched in profile

### Updated

- Updated UI on cancelled shows modal
- Updated social media of shows links
- Code optimizations

### Fixed

- Fixed an issue where user couldn't mark a season as watched in Not Started shows
- UI fixes when adding a show
- Fixed some spellings
- Fixed an issue when marking the last episode of the season as watched failed to execute

---

## [1.5.4] - 16-7-2023

### Added

- Added a scroll to div when clicking on sections bar in profile
- Added a check to remove the mark season as watched button if the season has no episodes yet
- Reenabled ratings

### Updated

- Updated to detect if user finished watching the show and remove mark season as watched and watching now label

### Fixed

- Fixed calculating wrong watching time when marking the season as watched
- Fixes in marking season as watched

---

## [1.5.3] - 15-7-2023

### Added

- Added labels

### Updated

- Updated recommending shows in home page

### Fixed

- Fixed a bug in search function page when applying a filter in popular/discover detailed section and go to a show and the go back the filter was disabled
- UI fixes in footer

---

## [1.5.2] - 14-7-2023

### Added

- Added a new section in profile for user's Stopped shows

### Fixed

- Fixed default cover image not applying correctly
- Fixed an issue in method for marking a season as watched

---

## [1.5.1] - 13-7-2023

### Added

- Added a better method for updating profile cover images

### Fixed

- Fixed an issue that caused auto detecting canceled shows to change status to finished even if user hasn't finished watching the show yet
- Fixed default cover image

---

## [1.5.0] - 11-7-2023

### Added

- Added a feature to mark entire season as watched
- Added a label to show in which season the user currently is ("Watching Now" / "Watch Next")
- Added a method to reset password
- Added a check to detect if an email already exists in database

### Fixed

- Fixed error message in login page
- Fixed some general bugs in code
- Fixed the method calculating and saving user's statistics when marking the season as watched
- Fixed an issue when marking the season as watched in Returning Series

---

## [1.4.1] - 6-7-2023

### Update

- Redesigned profile cover selection menu

---

## [1.4.0] - 3-7-2023

### Added

- Switched from iMDB API to MDBList API due to pricing issues

### Update

- Updated README

### Removed

- Removed iMDB API

---

## [1.3.8] - 29-6-2023

### Added

- Added an info message when a new season of a show got announced but the episode list is still empty
- Added a function to detect if images didn't load correctly
- Added a new layout of tv show episodes cards in profile on mobile
- Added a button to switch between layouts
- Added an method to detect programmatically if the device is a mobile
- Added a focus method in search bar when the users press the search button to start typing immediately

### Update

- Updated UI on mobile devices to be more clean and readable
- Updated the texts showing in landing page
- Changed the position and style of displaying show name and genres text in suggestion carousel
- Updated background colors in Navbar for logged in and logout users
- Updated placeholder text in search bar
- Updated Navbar button sizes in small devices or screen sizes
- Updated default values of ratings in tv shows page

### Fixed

- Fixed on discover/trending detailed list the page number to be set to 1 when the user changes filters
- Fixed UI in discover/trending page
- Fixed a bug when navigating between suggested shows if in Show A user selected Season 2 it was already selected in Show B too instead of Season 1
- Cleared code

### Removed

- Removed button "Find More" in suggestion carousel

---

## [1.2.0] - 11-1-2023

### Added

- Added a method to constantly check if user's tv shows got canceled.

---

## [1.1.0] - 5-1-2023

### Update

- [BETA] Updated History section in profile to calculate delete episode better and update the watch next shows
- [BETA] Increased the number of episodes showed in history section from 20 to 50

---

## [1.0.2] - 4-1-2023

### Added

- Added in profile page next to episodes tags ("FINALE" or "PREMIER")

### Updated

- Updated the default setting of Up to Date shows to "Soon"
- Increased loading time to prevent issues

### Fixed

- Fixed profile episode cards widths and sizes
- Fixed method for calculating dates
- Fixed TV Time statistics spelling for single/plural numbers (ex. 1 MONTH / 2 MONTHS etc)
- Fixed on tv shows page the cast cards heights
- Fixed a bug in profile width on smaller screen sizes

---

## [1.0.1] - 16-12-2022

### Updated

- Updated README on github

---

## [1.0.0] - 25-7-2022

### Release

- Live site on Firebase

### Added

- Images and logos
- Added Home
- Added Profile
- Added Suggestions
- Added TV Shows page
- Added discover page
- Added Navbar

### Updated

- Updated README on github

### Removed

- Default React files

### Security

- Login and Signup page

---

## [0.0.1] - 18-5-2022

- Initialized Project

---
