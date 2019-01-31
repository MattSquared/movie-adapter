const express = require('express')
const app = express()
const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log('Server running on port ' + PORT)
})

app.get('/', (req, res, next) => {
  res.json(['Tony', 'Lisa', 'Michael', 'Ginger', 'Food'])
})
