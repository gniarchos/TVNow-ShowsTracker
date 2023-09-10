# Changelog

## [1.6.8] - 10-9-2023

### Added

- Added "SERIES FINALE" to the latest episode of the TV show.
- Added "PREMIERE" to the first episode of the TV show's season.

### Updated

- On the profile page, the "Up To Date" filter is initially set to "All" by default.

### Fixed

- Fixed an issue that caused the page number on the trending/on the air/Discover detailed page to not change to 1 when changing filters.

---

## [1.6.7] - 08-9-2023

### Updated

- Updated the PWA app's icon image.
- Made minor visual updates to the profile UI.

### Fixed

- Corrected slider images to the proper width and height on mobile devices.
- Resolved the issue of empty episode names in upcoming episodes that were either empty or null.

### Removed

- Deleted unused image files.

---

## [1.6.5] - 06-9-2023

### Added

- Added animations for the episode name, number, and title when the user marks the episode as watched.

### Updated

- Set the default layout of the profile page to 'Grid' upon user login.

### Fixed

- Performance improvements.
- Resolved code bugs and corrected spellings.
- Addressed spacing issues with user show statistics when the page is reloaded by adding an initial number ("Total Shows," "Watching Now," etc.).

---

## [1.6.4] - 05-9-2023

### Added

- Added a hover effect to my name on the footer, leading to my portfolio.
- Added links to APIs in the footer.
- Added a scroll-to-top button on the profile page in the desktop version.
- Added website's description in the header of HTML.

### Updated

- Updated the button in the Profile section to mark an episode as watched, it now shows a loader animation between episodes.
- Updated some dependencies.
- Optimized the method for history deletion to work properly.
- Cleaned the code.
- Better support of PWA compatibility.

### Fixed

- [BETA] Fixed the history section, which was not working properly when deleting episodes, now, deleting an episode/season reloads the page.
- [BETA] Fixed a critical bug that was causing episodes to not be deleted from the history at all.
- Fixed a bug that was causing multiple API calls on the shows page.
- Optimized the Landing page code with best practices using Lighthouse testing.

---

## [1.6.3] - 26-8-2023

### Added

- Added a background color to episode images in the Profile until the images load
- Added a "Load More" button at the bottom of the History section in the Profile to load more watched episodes

### Updated

- UI improvements in the mobile version of the Profile
- Marking an episode as watched in the Profile now applies instantly without displaying the loader
- Renamed the component "EpisodesProfile" to "ProfileEpisodes"
- Instantly update the user's TV Time and Episode Watched statistics
- Changed the name of "TV Time" to "Your TV Time" in the user statistics within the Profile
- Updated the logo image format from PNG to SVG
- Renamed "Shows" to "Total Shows" in Profile page user's statistics
- Renamed "Watching" to "Watching Now" in Profile page user's statistics
- Swapped position of "Not Started" and "Finished" statistics in Profile

### Fixed

- Fixed and optimized the code for better performance on the Profile page
- Resolved glitches in sections during the initial load of the Profile page
- Addressed content display issues on smaller browser sizes in the Profile
- Adjusted the position of the slide bar in scrolled element statistics on the Profile
- Resolved an issue where the 'Up to Date' filters were not hidden when the sections were hidden
- Addressed positioning of "Total Shows", "Watching Now" etc in smaller screen sizes
- Fixed tinny bugs

---

## [1.6.2] - 6-8-2023

### Added

- Added "Image Not Available" to show overview episodes if no image is available
- Added aired date and runtime to episode previews on the show page.

### Updated

- Updated background color in PWA mode
- Improved the way images load on the profile page.
- Made UI improvements to show names and info on show pages
- Made UI improvements to episodes on show pages

### Fixed

- Fixed a spacing issues on the shows page

---

## [1.6.1] - 2-8-2023

### Added

- Added PWA (standalone app) support
- Added changelog.md file

### Updated

- Updated README on GitHub

### Removed

- Deleted unnecessary video files

---

## [1.6.0] - 30-7-2023

### Added

- [BETA] Added the ability to mark seasons as unwatched from the History section

### Updated

- Improved the implementation for deleting episodes/seasons from the History
- Updated the favicon to ensure compatibility across all browsers and systems

---

## [1.5.6] - 28-7-2023

### Added

- Added a popup in the mobile profile when the layout is changed
- Included a link leading to my portfolio in the footer
- Added a confirmation popup when users click on the "Log Out" option

### Updated

- Updated animations in cover selection

### Fixed

- Fixed compatibility issues with the Firefox browser
- Corrected the UI for show genres on mobile
- Addressed an issue with the layout popup
- Fixed an issue in the search function where multiple searches did not redirect to page 1

---

## [1.5.5] - 20-7-2023

### Added

- Implemented a feature to sort shows by last watched in the profile

### Updated

- Enhanced the UI of the modal for cancelled shows
- Updated the links to social media profiles of shows
- Optimized the code for better performance

### Fixed

- Resolved an issue where users couldn't mark a season as watched in "Not Started" shows
- Fixed UI issues when adding a show
- Corrected some spelling errors
- Fixed an issue where marking the last episode of a season as watched failed to execute

---

## [1.5.4] - 16-7-2023

### Added

- Implemented scrolling to the section when clicking on the sections bar in the profile
- Added a check to remove the "Mark Season as Watched" button if the season has no episodes yet
- Re-enabled ratings

### Updated

- Updated to detect if the user has finished watching the show and removed the "Mark Season as Watched" button and the "Watching Now" label

### Fixed

- Corrected the calculation of watching time when marking the season as watched
- Made fixes to the functionality of marking the season as watched

---

## [1.5.3] - 15-7-2023

### Added

- Added labels

### Updated

- Updated recommending shows in home page

### Fixed

- Addressed a bug on the search function page: When applying a filter in the popular/discover detailed section, going to a show, and then returning, the filter was disabled
- Made UI fixes in the footer

---

## [1.5.2] - 14-7-2023

### Added

- Introduced a new section in the profile for the user's Stopped shows

### Fixed

- Resolved the issue of the default cover image not being applied correctly
- Corrected an issue in the method used for marking a season as watched

---

## [1.5.1] - 13-7-2023

### Added

- Implemented an improved method for updating profile cover images

### Fixed

- Addressed an issue that caused auto-detecting canceled shows to change status to finished even if the user hasn't finished watching the show yet
- Corrected the default cover image

---

## [1.5.0] - 11-7-2023

### Added

- Implemented a feature to mark an entire season as watched
- Added a label to indicate the season the user is currently in ("Watching Now" / "Watch Next").
- Added a method for resetting user's password
- Added a check to detect if an email already exists in the database

### Fixed

- Resolved an error message in the login page
- Addressed some general bugs in the code
- Corrected the method for calculating and saving user statistics when marking a season as watched
- Fixed an issue related to marking a season as watched in Returning Series

---

## [1.4.1] - 6-7-2023

### Update

- Revamped the menu for selecting profile covers

---

## [1.4.0] - 3-7-2023

### Added

- Transitioned from using the iMDB API to the MDBList API due to pricing concerns

### Update

- Updated README

### Removed

- Eliminated the usage of the iMDB API

---

## [1.3.8] - 29-6-2023

### Added

- Added an info message when a new season of a show got announced but the episode list is still empty
- Added a function to detect if images failed to load correctly
- Implemented a new layout for TV show episode cards in the profile on mobile
- Added a button to switch between layouts
- Introduced a method to programmatically detect if the device is a mobile
- Added a focus method in the search bar when users press the search button, enabling immediate typing

### Update

- Enhanced the UI for mobile devices to be cleaner and more readable
- Updated the text displayed on the landing page
- Adjusted the position and style for displaying show names and genre texts in the suggestion carousel
- Updated background colors in the Navbar for logged-in and logged-out users
- Refined the placeholder text in the search bar
- Updated Navbar button sizes in small devices or screen sizes
- Updated the default values of ratings on the TV shows page

### Fixed

- Fixed the issue on the discover/trending detailed list where the page number was not reset to 1 when the user changed filters
- Corrected the UI in the discover/trending page
- Resolved a bug in navigating between suggested shows where if a user selected Season 2 in Show A, it was also selected in Show B instead of Season 1
- Performed code cleanup

### Removed

- Removed the "Find More" button from the suggestion carousel

---

## [1.2.0] - 11-1-2023

### Added

- Added a method to continuously check if the user's TV shows have been canceled

---

## [1.1.0] - 5-1-2023

### Update

- [BETA] Improved the History section in the profile to enhance the calculation for deleting episodes and updating the watch next shows
- [BETA] Raised the number of episodes displayed in the history section from 20 to 50

---

## [1.0.2] - 4-1-2023

### Added

- Added "FINALE" or "PREMIER" tags next to episodes tags on the profile page

### Updated

- Adjusted the default setting of Up to Date shows to "Soon.
- Extended loading time to mitigate potential issues

### Fixed

- Corrected profile episode card widths and sizes
- Rectified the method for calculating dates
- Fixed TV Time statistics spelling for singular/plural numbers (e.g., 1 MONTH / 2 MONTHS, etc.)
- Addressed the height of cast cards on the TV shows page
- Resolved a bug in the profile width on smaller screen size

---

## [1.0.1] - 16-12-2022

### Updated

- Updated README on GitHub

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
