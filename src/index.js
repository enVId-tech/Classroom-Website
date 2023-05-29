//Libraries
const fs = require('fs');
const express = require('express');
const app = express();
const session = require('express-session');
const passport = require('passport');
const _ = require('lodash');

// Library Initialization
app.use(express.json());

//Credentials
require('dotenv').config({ path: './src/credentials.env' });

//Website Pages Setup //DO NOT REMOVE THIS
app.use(express.static('public'));

app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: 'SECRET'
}));

const port = 3000;
app.listen(port, () => console.log('App listening on port ' + 3000));

//Global Variables
let userProfile;

//Data ID and Session ID Identification, Encryption, and Decryption

//Decrypts Encrypted Session ID and Retrieves Data
app.post('/getData', (req, res) => {
  try {
  // Read the encrypted ID from the request body
  let encryptedKey = req.body.dataID;
  let decryptedKey = "";

  function decryptSessionID() {
    //Decryption
    const unencryptedLength = 6;

    for (let i = 0; i < encryptedKey.length; i += unencryptedLength) {
      const encryptedChunk = encryptedKey.substr(i, unencryptedLength);

      switch (encryptedChunk) {
        case "&$*M<%": decryptedKey += "1"; break;
        case ")@F$>.": decryptedKey += "2"; break;
        case "$(&F$f": decryptedKey += "3"; break;
        case "#!NF*#": decryptedKey += "4"; break;
        case "@#!F?@": decryptedKey += "5"; break;
        case "(_(%)^": decryptedKey += "6"; break;
        case "]}T~~$": decryptedKey += "7"; break;
        case "H`G^&>": decryptedKey += "8"; break;
        case "KJH^,&": decryptedKey += "9"; break;
        case "F!,%^/": decryptedKey += "0"; break;
        default: break;
      }
    }
  }

  decryptSessionID();

  function retrieveDataFromFile() {
    // Read existing JSON data from the file
    let existingData = fs.readFileSync('./src/studentinformation.json', 'utf8');
    // Parse the JSON data into a JavaScript array
    let jsonArray = JSON.parse(existingData);

    // Iterate over the array to find the matching data based on the decrypted ID
    for (let i = 0; i < jsonArray.length; i++) {
      let data = jsonArray[i];

      // Assuming the decrypted ID matches the 'session_id' property
      if (data.data_id == decryptedKey) {
        return data; // Return the matching data
      }
    }
  }

  // Retrieve the data based on the decrypted ID
  let retrievedData = retrieveDataFromFile();
  
  const modifiedObject = _.omit(retrievedData, 'data_id');


  if (modifiedObject) {
    res.send(modifiedObject); // Send the retrieved data as the response
  } else {
    res.send({ error: 'Data not found' }); // Handle the case when no matching data is found
  }
  } catch (err) {
  res.send({ error: 'Invalid data' }); // Handle the case when the data is invalid
  }
});

//Sends Encrypted Session ID to Client
app.get('/api/GetMain', (req, res) => {
  // Read existing JSON data from the file
  let existingData = fs.readFileSync('./src/studentinformation.json', 'utf8');

  // Parse the JSON data into a JavaScript array
  let jsonArray = JSON.parse(existingData);

  if (jsonArray.length > 0) {
    // Access the first object in the array
    let firstObject = jsonArray[0];

    // Read the session ID from the first object
    let dataID = firstObject.data_id;

    let newSessionID = "";

    //Encryption
    function encryptSessionID() {
      for (let i = 0; i < dataID.length; i++) {
        switch (dataID[i]) {
          case "1": newSessionID += "&$*M<%"; break;
          case "2": newSessionID += ")@F$>."; break;
          case "3": newSessionID += "$(&F$f"; break;
          case "4": newSessionID += "#!NF*#"; break;
          case "5": newSessionID += "@#!F?@"; break;
          case "6": newSessionID += "(_(%)^"; break;
          case "7": newSessionID += "]}T~~$"; break;
          case "8": newSessionID += "H`G^&>"; break;
          case "9": newSessionID += "KJH^,&"; break;
          case "0": newSessionID += "F!,%^/"; break;
          default: break;
        }
      }
    }
    encryptSessionID();

    // Send the sessionID as the response
    res.send({ newSessionID });
  } else {
    // Handle the case when the JSON array is empty
    res.send({ error: 'No data available' });
  }
});



//Google Login

//DO NOT REMOVE 
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
  cb(null, obj);
});
//UP TO THIS POINT


//Google Authentication Page
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

// Google OAuth Credentials
const GOOGLE_CLIENT_ID = process.env.CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.CLIENT_SECRET;

// Passport session setup
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
    // Checks if the user is using an auhsd email
    if (userProfile._json.hd == "student.auhsd.us" || userProfile._json.hd == "auhsd.us") {

      let JSONdata = {
        "displayName": userProfile.displayName,
        "firstName": userProfile.name.givenName,
        "lastName": userProfile.name.familyName,
        "email": userProfile.emails[0].value,
        "profilePicture": userProfile.photos[0].value,
        "hd": userProfile._json.hd,
        "data_id": userProfile.id
      };

      // Read existing JSON data from the file
      let existingData = fs.readFileSync("./src/studentinformation.json", 'utf8');

      let existingJSON;

      // Check if the existing data is not empty
      if (existingData.trim() !== '') {
        // Parse the existing JSON data into a JavaScript object
        existingJSON = JSON.parse(existingData);
      } else {
        // If the existing data is empty, initialize with an empty array
        existingJSON = [];
      }

      // Check if the data already exists in the JSON
      const isDataAlreadyExists = existingJSON.some(item => item.email === JSONdata.email);

      if (!isDataAlreadyExists) {
        // Append your new data to the JavaScript object
        existingJSON.push(JSONdata);

        // Convert the JavaScript object back to JSON
        let updatedJSON = JSON.stringify(existingJSON, null, 2);

        // Write the updated JSON data back to the file
        fs.writeFileSync("./src/studentinformation.json", updatedJSON);
      } else {
        //console.log('Data already exists. Skipping write operation.');
      }
      // Redirect to the home page if successful
      res.redirect('/');
    } else {
      // Redirect to the login page if unsuccessful or not a student
      res.redirect('/User/Authentication/Log-In').send("You are not a student");
    }
  });