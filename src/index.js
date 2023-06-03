//Libraries
const fs = require('fs');
const express = require('express');
const app = express();
const session = require('express-session');
const passport = require('passport');
const _ = require('lodash');
const crypto = require('crypto');
const { saveAnnouncement, processCommand } = require('./modules/consolecommands.js');
const { writeUserDataToFile, generateRandomNumber, encryptSessionID, decryptSessionID, encryptIP } = require('./modules/StudentInformation.js');

// Library Initialization
app.use(express.json());
app.set('trust proxy', true);

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
var userProfile;
var tempDataID;
var loggedIn = true; // Keep this at false for testing, real use keep false

app.post('/console', function (req, res) {
  const input = req.body.input;
  const commandprocess = processCommand(input);
  res.send({ commandprocess })
});

app.post('/submitlearninglog', function (req, res) {
  const data = req.body;
  const dataID = decryptSessionID(data.dataID);
  const existingData = fs.readFileSync('./src/studentinformation/studentinformation.json', 'utf8');

  const existingJSON = JSON.parse(existingData);
  let findData;

  for (let i = 0; i < existingJSON.length; i++) {
    if (existingJSON[i].data_id == dataID) {
      findData = existingJSON[i];
      break;
    }
  }

  if (findData == null || findData == undefined || findData == "" || findData == "null" || findData == "undefined") {
    res.send({ error: "User not found" });
  } else {
    let StudentLearningLogData = fs.readFileSync('./src/studentinformation/assignmentslist.json', 'utf8');
    let StudentLearningLogJSON
    if (!StudentLearningLogData == "") {
      StudentLearningLogJSON = JSON.parse(StudentLearningLogData);
    } else {
      StudentLearningLogJSON = [];
    }

    let findStudent;

    for (let i = 0; i < StudentLearningLogJSON.length; i++) {
      if (StudentLearningLogJSON[i].Email) {
        if (StudentLearningLogJSON[i].Email == findData.email) {
          findStudent = StudentLearningLogJSON[i];
          break;
        }
      }
    }

    if (!findStudent) {
      findStudent = "null";
    }

    let modifiedData;
    if (findStudent == "null" || findStudent == null || findStudent == undefined || findStudent == "undefined" || findStudent == "") {
      modifiedData = {
        "Name": findData.firstName + " " + findData.lastName,
        "Email": findData.email,
        "Period": data.period,
        "Assignment": {
          "LearningLog": {
            "LearningLog": 0,
          }
        },
        "Class": data.Class,
        "data_id": dataID,
      }

      const tagName = "LearningLog " + modifiedData.Assignment.LearningLog.LearningLog.toString();
      modifiedData.Assignment.LearningLog.LearningLog = modifiedData.Assignment.LearningLog.LearningLog + 1;

      const tagData = {
        "text": data.text,
        "date": data.date,
        "timeSubmitted": new Date().toLocaleString().toString().slice(0, 24)
      }
      modifiedData.Assignment.LearningLog[tagName] = tagData;
    } else if (!findStudent == null || !findStudent == "null" || !findStudent == undefined || !findStudent == "undefined" || !findStudent == "") {
      modifiedData = findStudent;

      const tagName = "LearningLog " + modifiedData.Assignment.LearningLog.LearningLog.toString();
      modifiedData.Assignment.LearningLog.LearningLog = modifiedData.Assignment.LearningLog.LearningLog + 1;

      const tagData = {
        "text": data.text,
        "date": data.date,
        "timeSubmitted": new Date().toLocaleString().toString().slice(0, 24)
      }
      modifiedData.Assignment.LearningLog[tagName] = tagData;
    }
    writeUserDataToFile(modifiedData, './src/studentinformation/assignmentslist.json');
  }
});

//Logout
app.post('/logout', function (req, res) {
  // Read existing JSON data from the file
  let dataID = decryptSessionID(req.body.dataID);

  let existingData = fs.readFileSync('./src/studentinformation/studentinformation.json', 'utf8');
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
        "data_id": "null"
      }
      let userData = writeUserDataToFile(modifiedData, "./src/studentinformation/studentinformation.json");
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
  fs.readFile('./src/studentinformation/studentinformation.json', 'utf8', (err, data) => {
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
      let existingData = fs.readFileSync('./src/studentinformation/studentinformation.json', 'utf8');
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
    let fileData = fs.readFileSync('./src/studentinformation/studentinformation.json', 'utf8');
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

    if (expiraryDate < currentDate) {
      loggedIn = false;
      res.sendStatus(401);
      jsonArray[dataNumber].unchangeableSettings.isLoggedin = false;
      writeUserDataToFile(jsonArray[dataNumber], "./src/studentinformation/studentinformation.json");
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

app.post('/announcements', (req, res) => {
  // Retrieve the JSON data from the request body
  let data = req.body;

  // Read the existing JSON data from the file
  let jsonData = fs.readFileSync("/src/studentinformation/announcements.json", 'utf8');
  let jsonArray = JSON.parse(jsonData);

  // Iterate through each object in the array
  for (let i = 0; i < jsonArray.length; i++) {
    const obj = jsonArray[i];
    const key = Object.keys(obj)[0]; // Get the key of the object

    // Check if there is existing data
    if (Object.keys(obj[key]).length === 0) {
      // No existing data, assign the new data directly
      obj[key] = data;
    } else {
      // Existing data, update it with the new data
      Object.assign(obj[key], data);
    }
  }

  // Convert the modified array back to JSON
  let updatedJsonData = JSON.stringify(jsonArray, null, 2);

  // Write the updated JSON data to the file
  fs.writeFileSync('/src/studentinformation/announcements.json', updatedJsonData);

  res.send('Data written successfully!');
});


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

        let fileData = fs.readFileSync('./src/studentinformation/studentinformation.json', 'utf8');
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

          writeUserDataToFile(JSONdata, "./src/studentinformation/studentinformation.json");

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

          writeUserDataToFile(JSONdata, "./src/studentinformation/studentinformation.json");

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
            "data_id": randomNumber,
          };
          tempDataID = randomNumber;
        };
        writeUserDataToFile(JSONdata, "./src/studentinformation/studentinformation.json");

        //console.log(tempDataID);
        loggedIn = true;
        res.redirect('/');
      } else {
        // Redirect to the login page if unsuccessful or not a student
        res.redirect('/User/Authentication/Log-In').send("You are not a student");
      }
    };
  });
