import React from "react"

export default function Filters(props) {
  const filtersSelection = props.allGenres.map((gen) => {
    return (
      <h4
        key={gen.id}
        className={
          props.param_section_filter === `${gen.id}`
            ? "filter-title active"
            : "filter-title"
        }
        id={gen.id}
        onClick={(e) => props.handleFilters(e)}
      >
        {gen.name}
      </h4>
    )
  })

  return <div className="search-discover-filters">{filtersSelection}</div>
}
