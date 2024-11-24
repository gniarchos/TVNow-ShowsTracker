export default async function apiCaller(params) {
  /*
          {
              url: url, -- url link
              method: method, -- method: GET, POST, PUT, DELETE
              contentType: contentType, -- application/json etc...
              body: body, -- the data || null
              calledFrom: calledFrom, -- who called it? (for specific actions),
              isResponseJSON: isResponseJSON, -- if the response is JSON true || false
              extras: extras -- extra data if needed || null (ex. the filtersTable for localstorage)
          }
          */

  try {
    const accessToken = localStorage.getItem("userToken")

    const headers = (() => {
      switch (params.calledFrom) {
        case "streamingAvailability":
          return {
            "X-RapidAPI-Key": `${process.env.REACT_APP_STREAMING_AVAILABILITY_API}`,
            "X-RapidAPI-Host": "streaming-availability.p.rapidapi.com",
          }
        case "mdblist":
          return {
            "X-RapidAPI-Key": `${process.env.REACT_APP_MDBLIST_API}`,
            "X-RapidAPI-Host": "mdblist.p.rapidapi.com",
          }
        default:
          return {
            Authorization: `Bearer ${accessToken}`,
            accept: "application/json",
            "Content-Type": params.contentType,
          }
      }
    })()

    const response = await fetch(params.url, {
      method: params.method,
      headers: headers,
      body:
        params.method === "GET" && params.body === null ? null : params.body,
    })

    if (response.ok) {
      if (params.calledFrom === "login") {
        const jsonResponse = await response.json()
        localStorage.setItem("userToken", jsonResponse.access_token)
      } else if (params.calledFrom === "me") {
        const jsonResponse = await response.json()
        localStorage.setItem("username", jsonResponse.username)
        localStorage.setItem("user_id", jsonResponse.id)
      } else {
        const jsonResponse = await response.json()
        return jsonResponse
      }
    } else {
      if (params.calledFrom === "login" || params.calledFrom === "register") {
        const jsonResponse = await response.json()
        const status = response.status
        switch (status) {
          case 401:
            throw new Error(jsonResponse.detail)
          case 400:
            throw new Error(jsonResponse.detail)
          default:
            throw new Error("Something went wrong. Please try again later.")
        }
      } else if (params.calledFrom === "seasonInfo") {
        // const jsonResponse = await response.json()
        console.log("Season data is not available for this show yet.")
      } else {
        const jsonResponse = await response.json()
        const status = response.status
        switch (status) {
          case 400:
            throw new Error(jsonResponse.detail)
          case 401:
            throw new Error(jsonResponse.detail)
          default:
            throw new Error("Something went wrong. Please try again later.")
        }
      }
    }
  } catch (error) {
    console.error(`[${params.calledFrom}] Fetching error:`, error)
    if (error.message === "Failed to fetch") {
      throw new Error("Something went wrong. Please try again later.")
    } else {
      throw new Error(error.message)
    }
  }
}
