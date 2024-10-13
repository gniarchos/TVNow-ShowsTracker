import React from "react"
import "./ShowDetails.css"
import ReactPlayer from "react-player"
import dayjs from "dayjs"
import ShowSeasonsEpisodes from "./ShowSeasonsEpisodes/ShowSeasonsEpisodes"

export default function ShowDetails({
  showData,
  seasonNumber,
  setSeasonNumber,
  seasonInfo,
}) {
  return (
    <div className="show-details-wrapper">
      <div className="show-details-synopsis">
        {showData.overview !== "" && (
          <h1 className="show-details-titles">Storyline</h1>
        )}
        {showData.overview !== "" && (
          <p className="show-details-synopsis-text">{showData.overview}</p>
        )}
      </div>

      {/* TODO: if user has started watching the show show trailer based on latest season */}
      {showData.videos?.results?.length > 0 && (
        <div className="show-details-trailers">
          <ReactPlayer
            width={"100%"}
            height={"100%"}
            url={`https://www.youtube.com/watch?v=${
              showData.videos.results
                .sort((a, b) => dayjs(a.published_at) - dayjs(b.published_at))
                .filter((vid) => vid.type.includes("Trailer"))[0].key
            }`}
          />
        </div>
      )}

      <ShowSeasonsEpisodes
        showData={showData}
        seasonNumber={seasonNumber}
        setSeasonNumber={setSeasonNumber}
        seasonInfo={seasonInfo}
      />
    </div>
  )
}
