var express = require('express')
var app = express()

app.get('/', function landing(req, res) {
    res.send("Hey sweet heart <3")
})

app.get('/webhook/', function (req, res) {
  if (req.query['hub.verify_token'] === 'validate_bot_sarah') {
    res.send(req.query['hub.challenge']);
  }
  res.send('Error, wrong validation token');
})

app.listen(process.env.PORT || 3000, function listening() {
    console.log("App listening on port 3000")
})
