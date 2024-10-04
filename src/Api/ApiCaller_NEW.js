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

    const headers = {
      Authorization: `Bearer ${accessToken}`,
      accept: "application/json",
    }

    const response = await fetch(params.url, {
      method: params.method,
      headers,
      body:
        params.method === "GET" && params.body === null ? null : params.body,
    })

    if (response.ok) {
      if (params.calledFrom === "login") {
        const jsonResponse = await response.json()
        localStorage.setItem("userToken", jsonResponse.access_token)
      } else {
        const jsonResponse = await response.json()
        return jsonResponse
      }
    } else {
      if (params.calledFrom === "login") {
        // const jsonResponse = await response.json()
        // const status = response.status
        // switch (status) {
        //   case 401:
        //     throw new Error(jsonResponse.message)
        //   default:
        //     throw new Error("Άγνωστο σφάλμα. Δοκιμάστε ξανά.")
        // }
      } else {
        const jsonResponse = await response.json()
        const status = response.status
        switch (status) {
          case 401:
            throw new Error(jsonResponse.message)
          default:
            throw new Error("Άγνωστο σφάλμα. Δοκιμάστε ξανά.")
        }
      }
    }
  } catch (error) {
    console.error(`[${params.calledFrom}] Fetching error:`, error)
    if (error.message === "Failed to fetch") {
      throw new Error("Αποτυχία σύνδεσης. Δοκιμάστε ξανά.")
    } else {
      throw new Error(error.message)
    }
  }
}
