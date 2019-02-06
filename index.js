const express = require('express')
const app = express()
const PORT = process.env.PORT || 5000

const calls = require('./calls.js')

app.listen(PORT, () => {
  console.log('Server running on port ' + PORT)
})

app.get('/getMovie', (req, res, next) => {
  calls.getMovie(req.query.id, calls.getReview, res)
})
