const axios = require('axios')
const omdbKey = require('./key/omdb').key
const nytKey = require('./key/nyt').key
const model = require('./model')

const OMDB_URL = 'http://www.omdbapi.com/'
const NYT_URL = 'https://api.nytimes.com/svc/movies/v2/reviews/search.json'

exports.getMovie = function (id, getReview, res) {
  axios.get(OMDB_URL, {
    params: {
      i: id,
      apikey: omdbKey
    }
  }).then(function (response) {
    let imdbInfo = response.data
    let movie = {}
    for (var key in imdbInfo) {
      let modelKey = key.uncapitalize()
      if (model[modelKey] !== undefined) {
        movie[modelKey] = imdbInfo[key]
      }
    }

    getReview(movie, res)
  }).catch(function (error) {
    console.log(error)
  })
}

exports.getReview = function (movie, res) {
  axios.get(NYT_URL, {
    params: {
      query: movie.title,
      'api-key': nytKey
    }
  }).then(function (response) {
    movie['review'] = response.data.results[0].link.url

    res.json(movie)
  }).catch(function (error) {
    console.log(error)
  })
}

String.prototype.uncapitalize = function () {
  return this.charAt(0).toLowerCase() + this.slice(1)
}
