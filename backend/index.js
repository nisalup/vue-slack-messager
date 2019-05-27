const express = require('express')
var request=require('request')
require('dotenv').config() 
const app = express()  
const cookieSession = require('cookie-session')  
const bodyParser = require('body-parser')  
const passport = require('passport')
const { WebClient } = require('@slack/web-api')

// getting the local authentication type
const LocalStrategy = require('passport-local').Strategy

// public root of built front end
publicRoot = 'C:\\Users\\nisal\\OneDrive\\Documents\\Github\\vue-slack-messager\\vueauthclient\\dist'

const authMiddleware = (req, res, next) => {
    if (!req.isAuthenticated()) {
        res.status(401).send('You are not authenticated')
    } else {
        return next()
    }
}

let users = [
    {
        id: 1,
        firstName: "Jude",
        lastName: "Rogans",
        telephone: "0765335263",
        email: "user@email.com",
        password: "password"
    },
     {
        id: 1,
        firstName: "Benoit",
        lastName: "Adams",
        telephone: "0765334463",
        email: "test@vizir.co",
        password: "testVizir2019"
    }
]

passport.use(
    new LocalStrategy(
        {
            usernameField: "email",
            passwordField: "password"
        },

        (username, password, done) => {
            let user = users.find((user) => {
                return user.email === username && user.password === password
            })

            if (user) {
                done(null, user)
            } else {
                done(null, false, { message: 'Incorrect username or password' })
            }
        }
    )
)

passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser((id, done) => {
    let user = users.find((user) => {
        return user.id === id
    })

    done(null, user)
})

//app.use(express.static(publicRoot)) 
/*app.get("/", (req, res, next) => {
   res.sendFile("index.html", { root: publicRoot })
})*/


app.use(bodyParser.json())

app.use(cookieSession({
    name: 'mysession',
    keys: ['vueauthrandomkey'],
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))

app.use(passport.initialize());

app.use(passport.session());




app.post("/api/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) {
            return next(err);
        }

        if (!user) {
            return res.status(400).send([user, "Cannot log in", info]);
        }

        req.login(user, err => {
            res.send("Logged in");
        });
    })(req, res, next);
});

app.get("/api/logout", function (req, res) {
    req.logout();

    console.log("logged out")

    return res.send();
});

app.get("/api/user", authMiddleware, (req, res) => {
    let user = users.find(user => {
        return user.id === req.session.passport.user
    })

   // console.log([user, req.session])

    res.send({ user: user })
})

app.get("/api/slacklogin", (req, res) => {
    // slack api connection
    // console.log(req.query)
    var options = {
        uri: 'https://slack.com/api/oauth.access?code='
            +req.query.code+
            '&client_id='+ process.env.CLIENT_ID+
            '&client_secret='+ process.env.CLIENT_SECRET,
        method: 'GET'
    }
    request(options, (error, response, body) => {
        var JSONresponse = JSON.parse(body)
        if (!JSONresponse.ok){
            console.log(JSONresponse)
            res.send({'user': {}})
        }else{
            req.session.passport.access_token = JSONresponse.access_token
            res.send({ 'user': JSONresponse.user, 'accessToken':  JSONresponse.access_token})
        }
    })

})


app.get("/api/channelList", (req, res) => {
    // slack api connection
    var options = {
        uri: 'https://slack.com/api/conversations.list?token='
            +req.session.passport.access_token,
        method: 'GET',
        headers: {
            'content-type': 'application/x-www-form-urlencoded'
        }
    }
    request(options, (error, response, body) => {
        var JSONresponse = JSON.parse(body)
        if (!JSONresponse.ok){
            res.send({'channelList': []})
        }else{
            res.send({ 'channels': JSONresponse.channels})
        }
    })

})

app.post("/api/postSlackMessage", (req, res) => {
    // slack api connection
    var options = {
        uri: 'https://slack.com/api/chat.postMessage',
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'Authorization':'Bearer ' + req.session.passport.access_token,
        },
        json: {
            'channel': req.body.channel,
            'text': req.body.text
        }
    }
    request(options, (error, response, body) => {
        console.log(body)
        var JSONresponse = body
        if (!JSONresponse.ok){
            console.log(JSONresponse)
            res.send({'response': []})
        }else{
            console.log('ddgd')
            console.log(JSONresponse)
            res.send({ 'response': JSONresponse})
        }
    })

})

app.listen(3000, () => {
    console.log("vue-slack-messager listening on port 3000")
})
