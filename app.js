var express = require('express')
var body_parser = require('body-parser')
var app = express()
var json_parser = body_parser.json()

//Landing page of the app
app.get('/', function landing(req, res) {
    res.send("Hey sweet heart <3")
})

//Webhook of the app
app.get('/webhook/', function (req, res) {
  if (req.query['hub.verify_token'] === 'validate_bot_sarah') {
    res.send(req.query['hub.challenge']);
  }
  res.send('Error, wrong validation token');
})

//Reply to user messages
app.post('/webhook/', json_parser, function reply_user(req, res) {
    var events = req.body.entry[0].messaging
    for(i = 0; i < events.length; i++)
    {
        var event = events[i]
        if(event.message && event.message.text)
        {
            sendMessage(event.sender.if, {text: "Echo: " + event.message.text})
        }
    }
    res.sendStatus(200)
})

//Port number listening
app.listen(process.env.PORT || 3000, function listening() {
    console.log("App listening on port 3000")
})
