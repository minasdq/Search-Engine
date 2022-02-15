const express = require("express")
const _ = require("lodash")
const SerpApi = require("google-search-results-nodejs")

const api_key =
  "526f7e72c69684a6f256eaffc86e10af557862ea850a7766d3bce74317514759"
const search = new SerpApi.GoogleSearch(api_key)
const app = express()
const port = process.env.PORT || 5000

app.listen(port, () => console.log(`Listening on port ${port}`))

const ranking = (results) => {
  const links = results.map((result) => ({
    url: result.link,
    position: result.position,
    title: result.title,
    displayed_link: result.displayed_link,
    snippet: result.snippet,
  }))

  let scoreLinks = {}
  links.forEach((link) => {
    scoreLinks = {
      ...scoreLinks,
      [link.url]: {
        score: (scoreLinks[link.url]?.score || 0) + 1 / (1 + link.position),
        title: link.title,
        link: link.url,
        displayed_link: link.displayed_link,
        snippet: link.snippet,
      },
    }
  })

  let gfg = _.sortBy(_.values(scoreLinks), ["score"])
  gfg.reverse()
  return gfg
}

const params = {
  location: "Austin, Texas, United States",
  hl: "en",
  gl: "us",
  google_domain: "google.com",
  num: 20,
}

app.post("/express_backend", (req, res) => {
  const results = []
  const queryParam = req.query["0"]
  search.json({ ...params, q: queryParam, engin: "google" }, (googleResult) => {
    results.unshift(...googleResult["organic_results"])

    search.json(
      { ...params, q: queryParam, p: queryParam, engin: "yahoo" },
      (yahooResult) => {
        results.unshift(...yahooResult["organic_results"])

        search.json(
          { ...params, q: queryParam, p: queryParam, engin: "bing" },
          (bingresult) => {
            results.unshift(...bingresult["organic_results"])
            const rankedResult = ranking(results)
            res.send(rankedResult)
          }
        )
      }
    )
  })
})
