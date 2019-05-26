const express = require('express')
var request=require('request');

// public root of built front end
// publicRoot = 'C:\\Users\\nisal\\OneDrive\\Documents\\Github\\vue-slack-messager\\vueauthclient\\dist'

// creating an express instance
const app = express()  
const cookieSession = require('cookie-session')  
const bodyParser = require('body-parser')  
const passport = require('passport')
const { WebClient } = require('@slack/web-api');

// getting the local authentication type
const LocalStrategy = require('passport-local').Strategy

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

// app.use(express.static(publicRoot)) 
// app.get("/", (req, res, next) => {
//    res.sendFile("index.html", { root: publicRoot })
//})


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

   0// console.log([user, req.session])

    res.send({ user: user })
})

app.get("/api/slack/login", (req, res) => {
    // slack api connection
    // console.log(req.query)

    const SLACK_TOKEN = 'xoxp-648015137095-646187439568-634750256291-7f326a56e677774fe6cb8ead3de5ed30'

    const options = {
      client_id: '648015137095.639839856641',
      client_secret: '7af2109835e6d1a4f691931087791fc1',
      code: req.query.code,
    };
    //console.log(options)
    request.get('https://slack.com/api/oauth.access', options ,(err,res,body) => {
        if (res) {
            console.log(body)
        }
        if (err) {
            console.log(res)
      }
      //TODO Do something with response
    });

    const web = new WebClient(SLACK_TOKEN);

    const currentTime = new Date().toTimeString();

    (async () => {
      // Use the `auth.test` method to find information about the installing user
      const res = await web.auth.test()

      // Find your user id to know where to send messages to
      const userId = res.user_id

      // Use the `chat.postMessage` method to send a message from this app
      await web.chat.postMessage({
        channel: userId,
        text: `The current time is ${currentTime}`,
      });
      console.log('Message posted!');
    })();
})

app.listen(3000, () => {
    console.log("Example app listening on port 3000")
})
