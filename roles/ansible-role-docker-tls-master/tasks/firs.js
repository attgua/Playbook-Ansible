/*/ Create a server in Node.js  which exposes a “/articles” endpoint to obtain all the articles in a store */


const express = require('express')
const app = express()
 
app.get('/articles', function (req, res) {
  res.send('Hello World')
})
 
app.listen(3000)
