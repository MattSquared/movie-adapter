const axios = require('axios')
const omdbKey = require('./key/omdb').key
const nytKey = require('./key/nyt').key
const model = require('./model')

const OMDB_URL = 'http://www.omdbapi.com/'
const NYT_URL = 'https://api.nytimes.com/svc/movies/v2/reviews/search.json'

/**
 * Return movie information from OMDB API by imdb_id
 * @param {fucntion} getReview - callback function
 * @param {Message} msg - Telegram Message object
 * @param {Object} res - response object
 */
exports.getMovie = function (id, getReview, res) {
  let answer = {
    response: {},
    data: {}
  }

  axios.get(OMDB_URL, {
    params: {
      i: id,
      apikey: omdbKey
    }
  }).then(function (response) {
    if (response.data.Error === undefined) {
      let imdbInfo = response.data
      let movie = {}
      for (var key in imdbInfo) {
        let modelKey = key.uncapitalize()
        if (model[modelKey] !== undefined) {
          movie[modelKey] = imdbInfo[key]
        }
      }

      getReview(movie, res)
    } else {
      answer.response.status = 404
      answer.response.error = 'Movie Not Found'
      res.json(answer)
    }
  }).catch(function (error) {
    console.log(error)
    answer.response.status = 500
    answer.response.error = 'Internal Adapter Error'
    res.json(answer)
  })
}

/**
 * Return review for a movie from NYTimes API
 * @param {Object} res - response object
 */
exports.getReview = function (movie, res) {
  let answer = {
    response: {},
    data: {}
  }

  axios.get(NYT_URL, {
    params: {
      query: movie.title,
      'api-key': nytKey
    }
  }).then(function (response) {
    if (response.data.results.length > 0) {
      movie['review'] = response.data.results[0].link.url
    } else {
      movie['review'] = 'http://google.com/404'
    }

    answer.response.status = 200
    answer.response.message = 'Success'
    answer.data = movie
    res.json(answer)
  }).catch(function (error) {
    console.log(error)
    answer.response.status = 500
    answer.response.error = 'Internal Adapter Error'
    res.json(answer)
  })
}

// return string with the first char in lower case
String.prototype.uncapitalize = function () {
  return this.charAt(0).toLowerCase() + this.slice(1)
}
