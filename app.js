// var regex = require('regex')
var express = require('express')
var body_parser = require('body-parser')
var request = require('request')
var port = process.env.PORT || 3000
var app = express()
var json_parser = body_parser.json()
// var at_pattern = /@\w+/
// var at_regex = new regex(at_pattern)

function glad_after_struct_message(user_id)
{
    request(
        {
            url: "https://graph.facebook.com/v2.6/" + user_id + "?fields=first_name,last_name",
            qs: {access_token: process.env.PAGE_ACCESS_TOKEN},
            method: 'GET'
        }, function glad_message(err, res) {
                if (err) {
                    console.log("Error getting user name: " + err)
                }

                else {
                    console.log(res)
                }
        }
    )
}

function send_struct_messages(recipient_id, img_category)
{
    var image_url = "https://loremflickr.com/400/400/" + img_category

    var msg = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [
                    {
                        "title": img_category,
                        "image_url": image_url,
                        "buttons": [
                            {
                                "type": "web_url",
                                "url": image_url,
                                "title": img_category
                            },
                            {
                                "type": "postback",
                                "title": "I like this",
                                "payload": recipient_id + " likes " + img_category
                            }
                        ]
                    }
                ]
            }
        }
    }

    send_message(recipient_id, msg)
}

function send_message(recipient_id, msg) {
    request(
        {
            url: 'https://graph.facebook.com/v2.6/me/messages',
            qs: {access_token: process.env.PAGE_ACCESS_TOKEN},
            method: 'POST',
            json: {
                recipient: {
                    id: recipient_id
                },
                message: msg
            }
        }, function(error, response, body){
                    if(error)
                    {
                        console.log("Error sending message: ", error)
                    }
                    else if(response.body.error)
                    {
                        console.log("Error: ", response.body.error)
                    }
            }
    )
}

app.use(body_parser.urlencoded({extended: false}))
app.set('views', './views')
app.set('view engine', 'pug')

//Landing page of the app
app.get('/', function landing(req, res) {
    res.render('index.pug')
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
    console.log(res)
    var events = req.body.entry[0].messaging
    for(i = 0; i < events.length; i++)
    {
        var event = events[i]
        if(event.message && event.message.text)
        {
            var msg = event.message.text
            if(msg.slice(0, 1) === "@")
            {
                var category = msg.slice(1)
                send_struct_messages(event.sender.id, category)
            }
            else {
                send_message(event.sender.id, {text: msg})
            }
        }
        else if(event.postback)
        {
            console.log("POSTBACK RECEIVED: "+ JSON.stringify(event.postback))
        }
    }
    res.sendStatus(200)
})

//Port number listening
app.listen(port, function listening() {
    console.log("App started listening on "+ port)
})
