export default async function apiCaller(urls, type) {
  try {
    const results = await Promise.all(
      urls.map(async (url, index) => {
        const response = await fetch(url)
        if (!response.ok) {
          if (type === "seasonData") {
            return {}
          } else {
            throw new Error(
              `Error fetching data from ${url}: ${response.statusText}`
            )
          }
        }
        return await response.json()
      })
    )
    return results
  } catch (err) {
    console.error("Error fetching data:", err)
    throw new Error(
      "Database Error: Something went wrong. Please check back later."
    )
  }
}
