const express = require('express')
const mysql = require('mysql')
const config = require('config')
const nodeMailer = require("nodemailer")
const bodyParser = require('body-parser')
const signup = require('./routes/signup.js')
const login = require('./routes/login.js')
const forgot = require('./routes/forgot.js')
const profile = require('./routes/profile.js')
const settings = require('./routes/settings.js')
const GitHubStrategy = require('passport-github').Strategy;
const passport = require('passport')
const app = express()
const port = process.env.PORT || 3001

app.use(express.static(__dirname + '/static'));
app.set('views', __dirname + '/static');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(express.json())
app.use(bodyParser.json())
app.use(passport.initialize());
app.use(passport.session());

passport.use(new GitHubStrategy({
    clientID: "6971f33362c66588c949",
    clientSecret: "cc06cd353cbbea1c267d2a22476192da16b662a8",
    callbackURL: "http://localhost:8080/login/github",
    scope: ['user:email']
}, (accessToken, refreshToken, profile, done) => {
    return done(null, profile);
}
));

const db = mysql.createConnection(config.get('Database'))

db.connect((err) => {
    if (err)
        console.log(err)
    else
        console.log('Connected to database');
});
global.db = db;

var allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, x-auth-token, Credentials-Header');
    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
        res.sendStatus(200);
    }
    else {
        next();
    }
};

app.use(allowCrossDomain);

let smtpTransport = nodeMailer.createTransport(config.get("Mail"));
global.smtpTransport = smtpTransport;



var cors = require('cors');
app.use(cors())


app.use('/signup', signup);
app.use('/login', login);
app.use('/forgot', forgot);
app.use('/settings', settings);
app.use('/profile', profile);


app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.send('<h1 style="color:red;">Fiiin ghadii !!! Error with status 500</h1>');
});

app.get('*', (req, res) => {
    res.render('404.html');
})


app.listen(port, function () {
    console.log('Example app listening on port ' + port);
})