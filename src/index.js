//Libraries
const fs = require('fs');
const express = require('express');
const app = express();
const session = require('express-session');
const passport = require('passport');
const _ = require('lodash');
const crypto = require('crypto');

// Library Initialization
app.use(express.json());
app.set('trust proxy', true)

//Credentials
require('dotenv').config({ path: './src/credentials.env' });

//Website Pages Setup //DO NOT REMOVE THIS
app.use(express.static('public'));

app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: 'SECRET'
}));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log('App listening on port ' + 3000));

//Global Variables
let userProfile;
let tempDataID;
let loggedIn = true; // Keep this at false for testing, real use keep false

// Functions

//Write User Data to File (JSON)

function writeUserDataToFile(JSONdata) {
  try {
    // Read existing JSON data from the file
    let existingData = fs.readFileSync('./src/studentinformation.json', 'utf8');

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
    const existingDataIndex = existingJSON.findIndex(item => item.email === JSONdata.email);

    if (existingDataIndex === -1) {
      // Append your new data to the JavaScript object
      existingJSON.push(JSONdata);
    } else {
      // Replace the existing data with the updated data
      existingJSON[existingDataIndex] = JSONdata;
    }

    // Convert the JavaScript object back to JSON
    let updatedJSON = JSON.stringify(existingJSON, null, 2);

    // Write the updated JSON data back to the file
    fs.writeFileSync('./src/studentinformation.json', updatedJSON);
    return "Success";
  } catch (err) {
    return "Error";
  }
}

//Generates Random Session Key

function generateRandomNumber(NumberofDigits) {
  let randomNumber = '';
  let digits = '0123456789';

  for (let i = 0; i < NumberofDigits; i++) {
    const randomIndex = Math.floor(Math.random() * digits.length);
    randomNumber += digits[randomIndex];
  }

  return randomNumber;
};

//Random encryption key and iv
const encryptionKey = crypto.randomBytes(32); // 256 bytes for AES-256

const iv = crypto.randomBytes(16); // 128 bytes for AES-256-CBC

//Encrypts Session ID
function encryptSessionID(newSessionID) {
  // Create an AES cipher object
  const cipher = crypto.createCipheriv('aes-256-cbc', encryptionKey, iv);

  // Encrypt the data
  let encryptedData = cipher.update(newSessionID, 'utf8', 'hex');
  encryptedData += cipher.final('hex');

  return encryptedData;
}

//Decrypts Encrypted Session ID
function decryptSessionID(encryptedData) {
  const decipher = crypto.createDecipheriv('aes-256-cbc', encryptionKey, iv);

  // Decrypt the data
  let decryptedData = decipher.update(encryptedData, 'hex', 'utf8');
  decryptedData += decipher.final('utf8');

  return decryptedData;
}

//IP Encryption
function encryptIP(ip) {
  let encryptedIP = "";
  for (let i = 0; i < ip.length; i++) {
    switch (ip[i]) {
      case "1": encryptedIP += "NF(@#&:;><"; break;
      case "2": encryptedIP += "!*FHNjahs#"; break;
      case "3": encryptedIP += "~~faC.;'{]"; break;
      case "4": encryptedIP += "CSV#jH!&)="; break;
      case "5": encryptedIP += "!*DFf!^(#["; break;
      case "6": encryptedIP += "(_(%)^fG':"; break;
      case "7": encryptedIP += "]}T~~$}''|"; break;
      case "8": encryptedIP += "H`G^%!jC;|"; break;
      case "9": encryptedIP += "KJH^,&j@b/"; break;
      case "0": encryptedIP += "+=$jHwSvGa"; break;
      case ".": encryptedIP += "!(%^!!)*(-"; break;
      case ":": encryptedIP += "VAf@*!)|}:"; break;

    }
  }
  return encryptedIP;
}




//Logout
app.post('/logout', function (req, res) {
  // Read existing JSON data from the file
  let dataID = decryptSessionID(req.body.dataID);

  let existingData = fs.readFileSync('./src/studentinformation.json', 'utf8');
  let existingJSON = JSON.parse(existingData);

  let findData;

  for (let i = 0; i < existingJSON.length; i++) {
    if (existingJSON[i].data_id == dataID) {
      findData = existingJSON[i];
      let modifiedData = {
        "displayName": findData.displayName,
        "firstName": findData.firstName,
        "lastName": findData.lastName,
        "email": findData.email,
        "profilePicture": findData.profilePicture,
        "hd": findData.hd,
        "hasAccessTo": {
          "CSD": {
            "hasAccess": findData.hasAccessTo.CSD.hasAccess,
            "Assignments": findData.hasAccessTo.CSD.Assignments
          },
          "CSP": {
            "hasAccess": findData.hasAccessTo.CSP.hasAccess,
            "Assignments": findData.hasAccessTo.CSP.Assignments
          },
          "CSA": {
            "hasAccess": findData.hasAccessTo.CSA.hasAccess,
            "Assignments": findData.hasAccessTo.CSA.Assignments
          },
          "MobileWebDev": {
            "hasAccess": findData.hasAccessTo.MobileWebDev.hasAccess,
            "Assignments": findData.hasAccessTo.MobileWebDev.Assignments
          },
          "AdminPanel": {
            "hasAccess": findData.hasAccessTo.AdminPanel.hasAccess,
            "Assignments": findData.hasAccessTo.AdminPanel.Assignments
          }
        },
        "unchangeableSettings": {
          isLoggedin: false,
          latestTimeLoggedIn: "null",
          dayToLogOut: "null",
          isStudent: findData.unchangeableSettings.isStudent,
          isStaff: findData.unchangeableSettings.isStaff,
          latestIPAddress: findData.unchangeableSettings.latestIPAddress,
          isLockedOut: findData.unchangeableSettings.isLockedOut
        },
        "data_id": findData.data_id
      }
      let userData = writeUserDataToFile(modifiedData);
      if (userData == "Success") {
        res.redirect('/User/Authentication/Log-Out');
      }
    }
  }

  /*
    if (findData) {
      findData.unchangeableSettings.isLoggedin = false;
      let userData = writeUserDataToFile(findData);
      if (userData == "Success") {
        res.redirect('/User/Authentication/Log-Out');
      } else if (userData == "Error") {
        res.redirect('/User/Authentication/Log-In');
      }
    } else {
      console.log("User not found");
      res.redirect('/User/Authentication/Log-In');
    }
    */
  // Perform any other logout-related actions (e.g., session termination)
  //res.redirect('/User/Authentication/Log-In'); // Redirect to the home page or a login page
});



//User Access
app.post('/getstudentaccess', (req, res) => {
  // Read the JSON file
  const dataID = req.body.dataID;
  fs.readFile('./src/studentinformation.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading the file:', err);
      return;
    }

    try {
      // Parse the JSON data
      const jsonData = JSON.parse(data);

      let studentDataIDUnencrypted = decryptSessionID(dataID);
      // Find the student object with the matching data_id
      const student = jsonData.find(item => item.data_id === studentDataIDUnencrypted);

      if (student) {
        // Get the contents of "hasAccessTo"
        const hasAccessTo = student.hasAccessTo;
        // Send the student access data as the response
        res.send({ hasAccessTo });
      } else {
        // Handle the case when the student with the specified data_id is not found
        res.status(404).send({ 'Error': 'Student not found' });
      }
    } catch (error) {
      console.error('Error parsing JSON:', error);
      res.status(500).send('Internal server error');
    }
  });
});

//Data ID and Session ID Identification, Encryption, and Decryption



//Decrypts Encrypted Session ID and Retrieves Data
app.post('/getData', (req, res) => {
  try {

    userProfile = "";

    // Read the encrypted ID from the request body
    let encryptedKey = req.body.dataID;
    let decryptedKey = decryptSessionID(encryptedKey);

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

//Checks if User is Logged In
app.post('/checkLoggedIn', (req, res) => {
  let loggedIn;

  let data = req.body.DataID;

  if (data == null) {
    loggedIn = false;
    res.sendStatus(401);
  } else if (data != null) {
    let fileData = fs.readFileSync('./src/studentinformation.json', 'utf8');
    let jsonArray = JSON.parse(fileData);

    let unencryptedData = decryptSessionID(data);

    let dataNumber = 0;
    for (let i = 0; i < jsonArray.length; i++) {
      if (jsonArray[i].data_id == unencryptedData) {
        dataNumber = i;
      } else if (jsonArray[i].data_id != unencryptedData) {
        loggedIn = false;
      }
    }

    const expiraryDate = new Date(jsonArray[dataNumber].unchangeableSettings.dayToLogOut.toString())

    const currentDate = new Date()

    console.log(expiraryDate);
    console.log(currentDate);
    console.log(expiraryDate < currentDate);

    if (expiraryDate < currentDate) {
      loggedIn = false;
      res.sendStatus(401);
      jsonArray[dataNumber].unchangeableSettings.isLoggedin = false;
      writeUserDataToFile(jsonArray[dataNumber]);
    } else if (!expiraryDate < currentDate) {
      if (jsonArray[dataNumber].unchangeableSettings.isLoggedin == true) {
        loggedIn = true;
        res.sendStatus(200);
      } else {
        loggedIn = false;
        res.sendStatus(401);
      }
    }
  }
});

//Sends Encrypted Session ID to Client
app.get('/api/GetMain', (req, res) => {
  try {
    if (loggedIn == true) {
      let newSessionID = encryptSessionID(tempDataID);

      // Send the sessionID as the response
      res.send({ newSessionID });
    } else if (loggedIn == false) {
      res.redirect('/User/Authentication/Log-In');
    }
  } catch (err) {
    res.send({ error: 'Invalid data' }); // Handle the case when the data is invalid
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
      let JSONdata;

      const randomNumber = generateRandomNumber(64);
      if (userProfile._json.hd == "student.auhsd.us") {
        let newDate = new Date();

        // Create a Date object for the current date
        let currentDate = newDate.toString().slice(0, 24);

        // Get the day of the month
        let day = newDate.getDate();

        // Add a day to the date
        newDate.setDate(day + 7);

        // Convert the updated date to a formatted string
        let updatedDate = newDate.toString().slice(0, 24);

        let fileData = fs.readFileSync('./src/studentinformation.json', 'utf8');
        let jsonArray = JSON.parse(fileData);

        let numberFound = null;
        for (let i = 0; i < jsonArray.length; i++) {
          if (jsonArray[i].email == userProfile.emails[0].value) {
            numberFound = i;
          }
        }

        if (numberFound == null) {
          // Create a Date object for the current date
          let newDate = new Date();

          // Create a Date object for the current date
          let currentDate = newDate.toString().slice(0, 24);

          // Get the day of the month
          let day = newDate.getDate();

          // Add a day to the date
          newDate.setDate(day + 7);

          // Convert the updated date to a formatted string
          let updatedDate = newDate.toString().slice(0, 24);

          JSONdata = {
            "displayName": userProfile.displayName,
            "firstName": userProfile.name.givenName,
            "lastName": userProfile.name.familyName,
            "email": userProfile.emails[0].value,
            "profilePicture": userProfile.photos[0].value,
            "hd": userProfile._json.hd,
            "hasAccessTo": {
              "CSD": {
                "hasAccess": false,
                "Assignments": {}
              },
              "CSP": {
                "hasAccess": false,
                "Assignments": {}
              },
              "CSA": {
                "hasAccess": false,
                "Assignments": {}
              },
              "MobileWebDev": {
                "hasAccess": false,
                "Assignments": {}
              },
              "AdminPanel": {
                "hasAccess": false,
                "Assignments": {}
              }
            },
            "unchangeableSettings": {
              isLoggedin: true,
              latestTimeLoggedIn: currentDate,
              dayToLogOut: updatedDate,
              isStudent: true,
              isStaff: false,
              latestIPAddress: encryptIP(req.socket.remoteAddress),
              isLockedOut: false
            },
            "data_id": randomNumber
          };
          tempDataID = randomNumber;

          writeUserDataToFile(JSONdata);

        } else if (numberFound != null) {
          JSONdata = {
            "displayName": jsonArray[numberFound].displayName,
            "firstName": jsonArray[numberFound].firstName,
            "lastName": jsonArray[numberFound].lastName,
            "email": jsonArray[numberFound].email,
            "profilePicture": jsonArray[numberFound].profilePicture,
            "hd": jsonArray[numberFound].hd,
            "hasAccessTo": {
              "CSD": {
                "hasAccess": jsonArray[numberFound].hasAccessTo.CSD.hasAccess,
                "Assignments": jsonArray[numberFound].hasAccessTo.CSD.Assignments
              },
              "CSP": {
                "hasAccess": jsonArray[numberFound].hasAccessTo.CSP.hasAccess,
                "Assignments": jsonArray[numberFound].hasAccessTo.CSP.Assignments
              },
              "CSA": {
                "hasAccess": jsonArray[numberFound].hasAccessTo.CSA.hasAccess,
                "Assignments": jsonArray[numberFound].hasAccessTo.CSA.Assignments
              },
              "MobileWebDev": {
                "hasAccess": jsonArray[numberFound].hasAccessTo.MobileWebDev.hasAccess,
                "Assignments": jsonArray[numberFound].hasAccessTo.MobileWebDev.Assignments
              },
              "AdminPanel": {
                "hasAccess": jsonArray[numberFound].hasAccessTo.AdminPanel.hasAccess,
                "Assignments": jsonArray[numberFound].hasAccessTo.AdminPanel.Assignments
              }
            },
            "unchangeableSettings": {
              isLoggedin: true,
              latestTimeLoggedIn: currentDate,
              dayToLogOut: updatedDate,
              isStudent: jsonArray[numberFound].unchangeableSettings.isStudent,
              isStaff: jsonArray[numberFound].unchangeableSettings.isStaff,
              latestIPAddress: encryptIP(req.socket.remoteAddress),
              isLockedOut: jsonArray[numberFound].unchangeableSettings.isLockedOut
            },
            "data_id": randomNumber
          }

          tempDataID = randomNumber;

          writeUserDataToFile(JSONdata);

        } else if (userProfile._json.hd == "auhsd.us" || userProfile._json.hs == "frc4079.org" || userProfile._json.hd == "gmail.com") {
          // Create a Date object for the current date
          let newDate = new Date();

          // Create a Date object for the current date
          let currentDate = newDate.toString().slice(0, 24);

          // Get the day of the month
          let day = newDate.getDate();

          // Add a day to the date
          newDate.setDate(day + 7);

          // Convert the updated date to a formatted string
          let updatedDate = newDate.toString().slice(0, 24);

          JSONdata = {
            "displayName": userProfile.displayName,
            "firstName": userProfile.name.givenName,
            "lastName": userProfile.name.familyName,
            "email": userProfile.emails[0].value,
            "profilePicture": userProfile.photos[0].value,
            "hd": userProfile._json.hd,
            "hasAccessTo": {
              "CSD": {
                "hasAccess": false,
                "Assignments": {}
              },
              "CSP": {
                "hasAccess": false,
                "Assignments": {}
              },
              "CSA": {
                "hasAccess": false,
                "Assignments": {}
              },
              "MobileWebDev": {
                "hasAccess": false,
                "Assignments": {}
              },
              "AdminPanel": {
                "hasAccess": false,
                "Assignments": {}
              }
            },
            "unchangeableSettings": {
              isLoggedin: true,
              latestTimeLoggedIn: currentDate,
              dayToLogOut: updatedDate,
              isStudent: false,
              isStaff: true,
              latestIPAddress: encryptIP(req.socket.remoteAddress),
              isLockedOut: false
            },
            "data_id": randomNumber
          };
          tempDataID = randomNumber;
        };
        writeUserDataToFile(JSONdata);

        //console.log(tempDataID);
        loggedIn = true;
        res.redirect('/');
      } else {
        // Redirect to the login page if unsuccessful or not a student
        res.redirect('/User/Authentication/Log-In').send("You are not a student");
      }
    };
  });
