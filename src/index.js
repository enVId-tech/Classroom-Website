// index.js
const fs = require('fs');

require('dotenv').config({ path: './src/credentials.env' });
/*  EXPRESS */

const path = require('path');
const express = require('express');
const app = express();
const session = require('express-session');

app.use(express.static('public'));

app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: 'SECRET'
}));

const portnum = 3000;

const port = process.env.PORT || portnum;
app.listen(port, () => console.log('App listening on port ' + 3000));
/*  PASSPORT SETUP  */

const passport = require('passport');
var userProfile;

app.use(passport.initialize());
app.use(passport.session());


app.get('/api/GetAll', (req, res) => {
  // Send a response with the userProfile data
  res.send({ userProfile });
});

app.get('/error', (req, res) => res.send("error logging in"));

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
  cb(null, obj);
});


// Google Auth

const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const GOOGLE_CLIENT_ID = process.env.CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.CLIENT_SECRET;
passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:3000/auth/google/callback"
},
  function (accessToken, refreshToken, profile, done) {
    userProfile = profile;
    return done(null, userProfile);
  }
));

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/error' }),
  function (req, res) {
    // Successful authentication, redirect success.
    if(userProfile._json.hd == "student.auhsd.us" || userProfile._json.hd == "auhsd.us") {
      
      let sessionIDCreate = userProfile.id;
      let newSessionID = "";
      function encryptSessionID() {
        for (let i = 0; i < sessionIDCreate.length; i++) {
          switch (sessionIDCreate[i]) {
            case "1": newSessionID += "&$*M<%"; break;
            case "2": newSessionID += "@@F$>."; break;
            case "3": newSessionID += "@(&F$f"; break;
            case "4": newSessionID += "#!NF*#"; break;
            case "5": newSessionID += "@#!F?@"; break;
            case "6": newSessionID += "(%)^"; break;
            case "7": newSessionID += "]}T~~$"; break;
            case "8": newSessionID += "H`G^&>"; break;
            case "9": newSessionID += "KJH^,&"; break;
            case "0": newSessionID += "F!,%^/"; break;
        }
      }
    }
      encryptSessionID();
      let JSONdata = {
        "displayName": userProfile.displayName,
        "firstName": userProfile.name.givenName,
        "lastName": userProfile.name.familyName,
        "email": userProfile.emails[0].value,
        "profilePicture": userProfile.photos[0].value,
        "id": userProfile.id,
        "hd": userProfile._json.hd,
        "session_id": newSessionID
      }
      fs.appendFile("./src/studentinformation.json", JSON.stringify(JSONdata), function(err) {console.log(err)});
      res.redirect('/');
    } else {
      res.redirect('/User/Authentication/Log-In').send("You are not a student");
    }
  });