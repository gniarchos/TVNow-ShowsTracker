# Changelog

## [1.10.1] - 3-5-2024

### Added

- Added "Discover" button in PWA app leading to trending.

### Updated

- Updated animations and active page in PWA navigation bar.
- Updated pagination style in discover.

---

## [1.10.0] - 28-4-2024

### Added

- Added new functions to handle api calls and database calls.
- Added error messages alert in Profile.

### Updated

- Updated api calls in Profile.
- Updated database calls in Profile.
- Improved animations.

### Fixed

- Fixed loading time in Profile.

### Removed

- Removed old files.

---

## [1.9.5] - 3-3-2024

### Updated

- Updated the spacing of episodes cards in Profile.
- Updated the app's scrollbar size.
- Updated the position of popup message when changing layout from grid to list in Profile.
- Updated season number container size in mobile/desktop.
- Re-enable the functionality to remove a show from watchlist. Now when a show is been removed and the re-add it, it will have all the previous watch history.

### Fixed

- Fixed popup message when changing layout from grid to list in Profile not wrapping.
- Fixed cover selection container in Profile in PWA mode to be in wrong offset.

### Removed

- Removed Navbar old files.

---

## [1.9.4] - 25-12-2023

### Added

- Added filters in Full Cast page to improve user experience.

### Updated

- Renamed the "Just a moment... Popcorns on the way!" in Loader into "Just a moment Popcorns on the way!".
- Optimized code in DetailedShowsList component for handling better the fetching of data.
- Cleared code.
- Updated the UI in Full Cast page.

### Fixed

- Fixed ratings in Shows not displaying the correct rating sometimes.
- Fixed toggling Full Cast button in Show to cause page load slow and removed unnecessary link parameters.
- Fixed in Show the show's started date displaying incorrect date.

---

## [1.9.3] - 17-12-2023

### Updated

- Updated the log out confirmation message in the PWA app by adding an transparent background.
- Renamed the "Reloading data..." in Loader into "Just a moment... Popcorns on the way!".

### Fixed

- Fixed social media container to be visible even if there are no social media for the Show.

---

## [1.9.2] - 16-12-2023

### Fixed

- Fixed the "Show Full Cast" button in Show to cause page to break.
- Fixed shows not getting the user's watching status in Show Overview.
- Fixed upcoming date for new Shows to be blank if not date is announced, now it displays "Coming Soon".
- Fixed the format of the show ID to be added in user's Watchlist in database that caused issues.

---

## [1.9.1] - 9-12-2023

### Added

- Re-added the footer on the Landing page.
- Added a new file inside Other folder, "Loader", to include it in every component that has a loader.

### Updated

- Reduced the size of the TVTime logo in the navbar in the PWA app.
- Decreased the height of the bottom navbar in the PWA app.
- Adjusted the position of the logout button in the PWA app.
- Cleaned up "DetailedShowsList" component code.

### Fixed

- Corrected the wrong position of the search bar in the PWA app.
- Made minor UI fixes to the Login/Logout buttons in the navbar on the landing page.
- Rectified the navbar in the Landing page and its interaction with the content below in the UI.
- Fixed a bug in Show Overview that caused the page to crash if the first air date waw empty.
- Fixed a bug that caused two shows with the same name to be added to user's Watchlist.

### Removed

- Removed loader code from every component, and replaced it with a new Loader component.

---

## [1.9.0] - 7-12-2023

### Added

- Implemented a comprehensive app layout that incorporates a Navbar and Footer in a more effective manner.
- Added separate Navbar versions for logged-in and logged-out users, enhancing usability.
- Created a new file, "LandingHeader," within the Headers folder for the landing page.
- Included an "Error 404 Page Not Found" feature.
- Enabled link sharing among users.
- Added new components, "Filters.js" and "ShowCard.js," within the DetailedShowList folder to improve code organization.
- Added components such as "ShowBanner," "ShowDetailedGeneralInfo," "ShowFullCast," and "ShowTrackingInfo" into the Show folder.
- Added a "DetailedInfoContainer" directory inside the Show folder.
- Added "ShowDetailedInfoContainer," "DetailedSeasonsEpisodes," "DetailedShowCast," "DetailedShowEpisodes," and "YoutubeVideos" components into the DetailedInfoContainer folder.
- Added a loader within the ShowOverview component to display while data is being fetched.
- Implemented a new bottom navbar in the PWA app (standalone app) to enhance the user experience.
- Added the "ProfileCover" component into the Profile folder.

### Fixed

- Fixed landing page visibility for logged-in users; now, it automatically redirects them to the home page.
- Implemented numerous UI improvements and fixes in the DetailedShowsList component.
- Set the maximum number of pages in the DetailedShowsList component to 500, aligning with API recommendations.
- Adjusted the video gallery in the ShowOverview component to hide the scrollbar when unnecessary.
- Rectified page interactions with the navbar regarding margins.
- Resolved issues within the Stopped section in the profile, ensuring correct data display.
- Addressed multiple bugs and eliminated repeated code across all components.
- Implemented UI fixes for Navbar elements.

### Updated

- Renamed the "Navbar" folder to "Headers".
- Split the "Navbar" component into "MainNavbar" and "LandingNavbar".
- Updated specific information details on the landing page.
- Ensured proper hiding of Navbar links on each page.
- Refactored code in DetailedShowsList and ShowList components.
- Changed the URL of the ShowOverview component from "/overview" to "/show".
- Improved filters in detailed lists.
- Code cleanup and improvements across all components.
- Transitioned from the "react-ipgeolocation" package to "ipapi.co" for retrieving user location from their IP.
- Completely rewrote the ShowOverview component.
- Renamed "ShowEpisodes" to "DetailedShowEpisodes".
- Improved UI in ShowOverview component for ShowBanner's buttons.
- Updated placeholder image usage when cast member photos are unavailable in ShowFullCast and DetailedShowCast components.
- Improved UI for ShowOverview content on desktop and mobile.
- Improved load performance on the ShowOverview and Profile pages.
- Renamed "Recommending Shows" to "More like this" in ShowOverview.
- Renamed "Synopsis" to "Storyline" in ShowOverview.
- Made UI improvements on the Profile page.
- Renamed "WatchNextSection" to "ProfileWatchNext".
- Reorganized and updated code in ProfileWatchNext component.
- Renamed "WatchlistSection" to "ProfileWatchlist".
- Reorganized and updated code in ProfileWatchlist component.
- Renamed "FinishedStoppedSections" to "ProfileFinishedStopped".
- Reorganized and updated code in ProfileFinishedStopped component.
- Removed the "Premiere" tag from TBA episodes in profile sections.
- Added an info message if profile sections are empty of episodes.
- Updated the History section to display a loader when deleting episodes or seasons until everything is deleted (e.g., multiple episodes/seasons).
- Improved handling of statistics in Profile.
- Renamed the "Modal" component to "CanceledShows" and relocated it to the Profile folder.
- Updated and enhanced the code in the People component.

### Removed

- Removed Navbar and Footer components from every component using Layout.
- Removed genre filters in "On the Air" and "Popular Today" from the detailed list section due to lack of support.
- Removed unnecessary code from all the component.
- Temporarily disabled the "Remove Show" functionality on the Show overview page - the button is still visible.

---

## [1.8.3] - 29-10-2023

### Updated

- Cleaned up the code.
- Implemented a lot of code optimizations in the profile.
- Improved load time in the profile page.
- Organized better the pages and the code into folders.
- Renamed "Slider" component to "ShowsList".
- Renamed "DetailedSlider" component to "DetailedShowsList".
- Divided profile page sections into new components: "WatchedNextSection", "UpToDateSection", "WatchlistSection", "FinishedStoppedSection" and "HistorySection".

---

## [1.8.2] - 24-10-2023

### Added

- Added the name of the person to the tab's name in the people page.

### Fixed

- Fixed the issue where "No image available" was not appearing correctly on mobile devices in the people page.
- Reset the scroll position to the top when visiting the people page.
- Fixed the issue where the titles "Movies" and "Series" were not appearing even if there was data to show on the people page.
- Fixed the issue where the "Not found more info" message appeared briefly before the data had loaded.
- UI fixes in detailed sliders page.
- Fixed the issue where networks were not showing up in the shows overview.
- Implemented a lot of code optimizations in the shows overview.
- Corrected functions and variable names in the shows overview.
- Fixed the issue where videos in the video gallery were not resetting when using the back browser's button in the shows overview.

### Updated

- Cleaned up the code.
- Now, when searching for something in the search bar on mobile, it will automatically close.
- Updated the function for toggling the full cast and crew in the shows overview to automatically scroll to the relevant section.
- UI updates in the show overview page for the latest/next panel on mobile and season episodes.

---

## [1.8.1] - 20-10-2023

### Added

- Added a message if there is no available data to show on the people page.
- Added a scroll to the top on the show overview page.

### Fixed

- Fixed "Movies" and "Series" not showing up in the "Known For" section for some persons.
- Fixed the YouTube player that was visible even when no trailer was selected on the show overview.
- Fixed "Where to Watch" to be visible even if there is a dead link on the show overview.
- Fixed an error that occurred in Streaming Availability when the user's country is not available.
- Fixed the show overview sections to handle empty info data.
- Fixed "More episodes coming soon!" that was visible for ended shows in the shows overview.
- Fixed the TVTime logo in the navbar not displaying properly in Firefox.
- Fixed the people top container to not display the "no face" image when no image is available.
- Fixed the position of "Days until episode" in the shows overview episodes.
- Fixed a spelling error that caused the ratings not to work in the shows overview.
- Fixed a bug in the function when checking for canceled shows.
- Fixed the modal that informs users which shows were canceled.

### Updated

- Updated the UI in shows overview episodes' images, there is no longer a white border around them.

### Removed

- Removed the custom Firefox scrollbar.

---

## [1.8.0] - 17-10-2023

### Added

- Added search suggestions in search box.
- Added a new page, "People," for actors and crew, providing information about them and their filmography.
- Enabled people search suggestions in the search.

### Fixed

- Fixed "Image Not Available" to overflow the container in profile's episodes.
- Fixed an issue where search box suggestions were not working well on smaller screens and mobile devices.

### Updated

- Changed Twitter logo to X logo in shows overview.
- Now when user clicks/hovers in shows overview the "Ended Series" under "Next Episode" no cursor is shown.
- Cleared code.
- Renamed "Watching Now" to "Watching" in profile.
- Now if user's shows counts are big numbers in mobile will increase font size to be visible.
- Updates in search function.
- Updated cast and crew links in the Show Overview to direct users to their respective detailed pages, providing information about them and their filmography.

---

## [1.7.2] - 12-10-2023

### Fixed

- Corrected long episode names on the show overview page that were causing overflow issues.
- Fixed the issue where the remove button from the watched history was not always visible on mobile.
- Minor UI fixes in profile episodes.
- Fixed cover selection menu not covering entire page.

### Updated

- Minor UI updates in the show overview episodes in mobile, specifically related to the release date.
- Resized the Navbar in desktop.
- Resized search bar and minor UI fixes.
- Updated scroll to top position and interaction with footer.
- Watched History is out of BETA.
- Updated cover selection titles and save button font sizes in mobile.
- Renamed "Marked Season Watched" to "Entire Season Watched" when a user marks a season as watched.
- Updated footer copyright text.

### Removed

- Removed unnecessary code.

---

## [1.7.1] - 3-10-2023

### Added

- NEW: In the shows overview, a gallery for more videos and trailers has been added.
- Added on profile page in upcoming new series a tag "NEW SERIES" instead of "PREMIERE."

### Fixed

- Fixed the position of the "NEW SERIES" tag (previously the "PREMIERE" tag) on mobile grid and cards layout.
- Addressed an issue when YouTube trailers and gallery were not updating correctly when the user is navigating between shows.
- Fixed the height of cast's cards in shows that caused issues if big names appeared.
- Fixed an issue where the official trailer was not found, and the YouTube player wasn't visible. Now, when the user selects a video from the gallery, the YouTube player is displayed correctly.

### Updated

- Updated README (15-9-2023).
- Code optimization.
- Renamed "History" section in profile to "Watched History".
- Updated gallery UI preview videos to be more mobile friendly.

---

## [1.7.0] - 14-9-2023

### Added

- NEW: show streaming availability based on user's country using Streaming Availability API.

---

## [1.6.9] - 12-9-2023

### Updated

- Updated history of the repo to clear previous uploaded API keys.
- Updated dependencies and outdated packages.

### Fixed

- Spelling on the profile page has been corrected.
- The "SEASON FINALE" tag now appears only on shows that have ended or finished.

### Removed

- Removed firebase.js into services folder for security reasons and replaced by the file "firebase_config_file".
- Removed API keys from code for security reasons.

---

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
