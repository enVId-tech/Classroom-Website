// Libraries
import fs from 'fs';
import express, { json } from 'express';
const app = express();
import session from 'express-session';
import passport from 'passport';
import _ from 'lodash';
import { processCommand } from './modules/consolecommands.js';
import { generateRandomNumber, encryptSessionID, decryptSessionID, encryptIP } from './modules/encryption.js';
import { writeToDatabase, modifyInDatabase, getItemsFromDatabase } from './modules/mongoDB.js';

// Library Initialization
app.use(express.json());
app.set('trust proxy', true);

//Credentials
import dotenv from 'dotenv';
dotenv.config({ path: './src/credentials.env' });

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

//Agenda Write Permissions
app.post('/agenda/permission', (req, res) => {
  let dataID = decryptSessionID(req.body.dataID);

  //let existingData = fs.readFileSync('./src/studentinformation/studentinformation.json', 'utf8');
  let existingJSON = getItemsFromDatabase("students", dataID);

  console.log("/agenda/permission: " + existingJSON);

  let findData;

  for (let i = 0; i < existingJSON.length; i++) {
    if (existingJSON[i].dataIDNum == dataID) {
      findData = existingJSON[i];
      break;
    }
  }

  if (findData.isStaff == true) {
    res.send({ hasPermission: true });
  } else {
    res.send({ hasPermission: false });
  }
});

//Write to agenda
app.post('/agenda/write', (req, res) => {
  const content = req.body;

  let agendaJSON = getItemsFromDatabase("agenda");

  console.log("/agenda/write: " + agendaJSON);

  for (let i = 0; i < agendaJSON.length; i++) {
    if (agendaJSON[i].filePath == content.filePath) {
      agendaJSON[i].content = content.content;
      break;
    }
  }

  res.send(content);
});

//Console Commands
app.post('/console', (req, res) => {
  try {
    const input = req.body.input;
    const commandprocess = processCommand(input);
    res.send({ commandprocess })
  } catch (err) {
    res.send({ commandprocess: err.message });
  }
});

//Get sidebar data
app.post('/sidebarget', async function (req, res) {
  try {
    const data = req.body;
    const dataID = decryptSessionID(data.dataID);
    let existingJSON;

    console.log("Before getItemsFromDatabase");
    existingJSON = await getItemsFromDatabase("students", dataID);
    console.log("After getItemsFromDatabase");
    console.log("existingJSON:", existingJSON);

    console.log("Here 3");

    const sidebarJSON = await getItemsFromDatabase("classesavailable");

    console.log("Here 1");
    const parsedData = JSON.parse(existingJSON);
    console.log(parsedData);
    console.log(sidebarJSON);
    console.log("Here 2");

    let hasAccessTo = parsedData[0].hasAccessTo;
    let studentData = JSON.stringify(hasAccessTo);

    if (hasAccessTo && sidebarJSON) {
      res.send({ studentData, sidebarJSON });
    } else {
      res.send({ error: "User not found" });
    }
  } catch (err) {
    res.send({ error: err.message });
  }
});



app.post('/announcements/get', (req, res) => {
  try {
    // Retrieve the JSON data from the request body
    let data = req.body;

    // Read the existing JSON data from the file
    let jsonArray = getItemsFromDatabase("announcements");

    for (let i = 0; i < jsonArray.length; i++) {

      if (jsonArray[i].url == data.url) {
        res.send(jsonArray[i]);
        break;
      }
    }
  } catch (err) {
    res.send({ error: err.message });
  }
});

//Writing Learning Log to File
app.post('/submitlearninglog', (req, res) => {
  try {
    const data = req.body;
    const dataID = decryptSessionID(data.dataID);
    const existingJSON = getItemsFromDatabase("students", dataID);

    //    const existingJSON = JSON.parse(existingData);
    let findData;

    for (let i = 0; i < existingJSON.length; i++) {
      if (existingJSON[i].dataIDNum == dataID) {
        findData = existingJSON[i];
        break;
      }
    }

    if (findData == null || findData == undefined || findData == "" || findData == "null" || findData == "undefined") {
      res.send({ error: "User not found" });
    } else {
      let StudentLearningLogJSON = getItemsFromDatabase("assignmentslist");

      console.log("/submitlearninglog: " + StudentLearningLogJSON);

      //let StudentLearningLogJSON
      /*if (!StudentLearningLogData == "") {
        StudentLearningLogJSON = JSON.parse(StudentLearningLogData);
      } else {
        StudentLearningLogJSON = [];
      }*/

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
          "dataIDNum": dataID,
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
  } catch (err) {
    res.send({ error: err.message });
  }
});

//Logout
app.post('/logout', (req, res) => {
  try {
    // Read existing JSON data from the file
    let dataID = decryptSessionID(req.body.dataID);

    let existingJSON = getItemsFromDatabase("students", dataID);

    console.log("/logout: " + existingJSON);

    let findData;

    if (existingJSON[i].dataIDNum == dataID) {
      findData = existingJSON[i];
      let modifiedData = findData;
      modifiedData.unchangeableSettings.isLoggedin = false;
      modifiedData.unchangeableSettings.latestTimeLoggedIn = "null";
      modifiedData.unchangeableSettings.dayToLogOut = "null";
      modifiedData.dataIDNum = "null";

      let userData = modifyInDatabase(findData, modifiedData, "students");

      if (userData == "Success") {
        res.redirect('/User/Authentication/Log-Out');
      } else {
        res.send({ error: "Error" });
      }
    }
  } catch (err) {
    res.send({ error: err.message });
  }
});



//User Access
app.post('/getstudentaccess', (req, res) => {
  try {
    // Read the JSON file
    const dataID = req.body.dataID;

    let jsonData = getItemsFromDatabase("students");

    console.log("/getstudentaccess: " + jsonData);

    if (err) {
      console.error('Error reading the file:', err);
      return;
    }

    try {
      let studentDataIDUnencrypted = decryptSessionID(dataID);
      // Find the student object with the matching dataIDNum
      const student = jsonData.find(item => item.dataIDNum === studentDataIDUnencrypted);

      if (student) {
        // Get the contents of "hasAccessTo"
        const hasAccessTo = student.hasAccessTo;
        // Send the student access data as the response
        res.send({ hasAccessTo });
      } else {
        // Handle the case when the student with the specified dataIDNum is not found
        res.status(404).send({ 'Error': 'Student not found' });
      }
    } catch (error) {
      console.error('Error parsing JSON:', error);
      res.status(500).send('Internal server error');
    }
  } catch (err) {
    res.send({ error: err.message });
  }
});

app.post('/getData', async function (req, res) {
  try {

    console.log("/getData 1: " + req.body.dataID)

    userProfile = "";

    // Read the encrypted ID from the request body
    let encryptedKey = req.body.dataID;
    let decryptedKey = decryptSessionID(encryptedKey);

    // Iterate over the array to find the matching data based on the decrypted ID
    let jsonArray = await getItemsFromDatabase("students", decryptedKey);

    await getItemsFromDatabase("students", decryptedKey).then((data) => {
      jsonArray = data;
    });
    
    // Parse the JSON string into an array of objects
    const data = JSON.parse(jsonArray);
    
    // Iterate over the array and remove the "dataIDNum" property
    data.forEach(obj => delete obj.dataIDNum);

    // Convert the updated array back into a JSON string
    const updatedJsonString = JSON.stringify(data[0]);

    if (updatedJsonString) {
      res.send(updatedJsonString); // Send the retrieved data as the response
    } else {
      res.send({ error: 'Data not found' }); // Handle the case when no matching data is found
    }
  } catch (err) {
    res.send({ error: 'Invalid data' }); // Handle the case when the data is invalid
  }
});

//Checks if User is Logged In
app.post('/checkLoggedIn', (req, res) => {
  try {
    let loggedIn;

    let data = req.body.DataID;

    if (data == null) {
      loggedIn = false;
      res.sendStatus(401);
    } else if (data != null) {
      jsonArray = getDataByDataId(data, "students");

      console.log("/checkLoggedIn: " + jsonArray);

      let unencryptedData = decryptSessionID(data);

      let dataNumber = 0;
      for (let i = 0; i < jsonArray.length; i++) {
        if (jsonArray[i].dataIDNum == unencryptedData) {
          dataNumber = i;
        } else if (jsonArray[i].dataIDNum != unencryptedData) {
          loggedIn = false;
        }
      }

      const expiraryDate = new Date(jsonArray[dataNumber].unchangeableSettings.dayToLogOut.toString())

      const currentDate = new Date()

      if (expiraryDate < currentDate) {
        loggedIn = false;
        res.sendStatus(401);
        jsonArray[dataNumber].unchangeableSettings.isLoggedin = false;
        writeToDatabase(jsonArray[dataNumber], "students");
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
  } catch (err) {
    res.send({ error: 'Invalid data' }); // Handle the case when the data is invalid
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
    res.send({ error: err.message }); // Handle the case when the data is invalid
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
import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth';

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
  let jsonArray = getItemsFromDatabase("announcements");

  console.log("/announcements: " + jsonArray);

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
  async function (req, res) {
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

        let fileData = null;

        await getItemsFromDatabase("students").then((data) => {
          fileData = JSON.parse(data); // Parse the JSON string to an object
        });

        let numberFound = null;
        if (fileData !== null) {
          for (let i = 0; i < fileData.length; i++) {
            if (fileData[i].email === userProfile.emails[0].value) {
              numberFound = i;
              break; // Exit the loop if a match is found
            }
          }
        }

        console.log("Number Found: " + numberFound);

        let jsonArray = JSON.stringify(fileData);
        jsonArray = JSON.parse(jsonArray);
        console.log("JSON Array: " + jsonArray);

        console.log("JSON Array Num:" + jsonArray[numberFound].hasAccessTo[0].hasAccess);
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
            "hasAccessTo": [
              {
                "name": "CSD",
                "hasAccess": false
              },
              {
                "name": "CSP",
                "hasAccess": false
              },
              {
                "name": "CSA",
                "hasAccess": false
              },
              {
                "name": "MobileAppDev",
                "hasAccess": false
              },
              {
                "name": "AdminPanel",
                "hasAccess": false
              }
            ],
            "unchangeableSettings": {
              "isLoggedin": true,
              "latestTimeLoggedIn": currentDate,
              "dayToLogOut": updatedDate,
              "isStudent": true,
              "isStaff": false,
              "latestIPAddress": encryptIP(req.socket.remoteAddress),
              "isLockedOut": false
            },
            "dataIDNum": randomNumber
          };
          tempDataID = randomNumber;

          writeToDatabase(JSONdata, "students").catch(console.error);;

        } else if (numberFound != null) {
          JSONdata = {
            "displayName": jsonArray[numberFound].displayName,
            "firstName": jsonArray[numberFound].firstName,
            "lastName": jsonArray[numberFound].lastName,
            "email": jsonArray[numberFound].email,
            "profilePicture": jsonArray[numberFound].profilePicture,
            "hd": jsonArray[numberFound].hd,
            "hasAccessTo": [
              {
                "name": "CSD",
                "hasAccess": jsonArray[numberFound].hasAccessTo[0].hasAccess
              },
              {
                "name": "CSP",
                "hasAccess": jsonArray[numberFound].hasAccessTo[1].hasAccess
              },
              {
                "name": "CSA",
                "hasAccess": jsonArray[numberFound].hasAccessTo[2].hasAccess
              },
              {
                "name": "MobileAppDev",
                "hasAccess": jsonArray[numberFound].hasAccessTo[3].hasAccess
              },
              {
                "name": "AdminPanel",
                "hasAccess": jsonArray[numberFound].hasAccessTo[4].hasAccess
              }
            ],
            "unchangeableSettings": {
              "isLoggedin": true,
              "latestTimeLoggedIn": currentDate,
              "dayToLogOut": updatedDate,
              "isStudent": jsonArray[numberFound].unchangeableSettings.isStudent,
              "isStaff": jsonArray[numberFound].unchangeableSettings.isStaff,
              "latestIPAddress": encryptIP(req.socket.remoteAddress),
              "isLockedOut": jsonArray[numberFound].unchangeableSettings.isLockedOut
            },
            "dataIDNum": randomNumber
          };


          tempDataID = randomNumber;

          modifyInDatabase({ email: jsonArray[numberFound].email }, JSONdata, "students");
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
            "hasAccessTo": [
              {
                "name": "CSD",
                "hasAccess": true
              },
              {
                "name": "CSP",
                "hasAccess": true
              },
              {
                "name": "CSA",
                "hasAccess": true
              },
              {
                "name": "MobileAppDev",
                "hasAccess": true
              },
              {
                "name": "AdminPanel",
                "hasAccess": true
              }
            ],
            "unchangeableSettings": {
              "isLoggedin": true,
              "latestTimeLoggedIn": currentDate,
              "dayToLogOut": updatedDate,
              "isStudent": false,
              "isStaff": true,
              "latestIPAddress": encryptIP(req.socket.remoteAddress),
              "isLockedOut": false
            },
            "dataIDNum": randomNumber,
          };
          tempDataID = randomNumber;
        };
        writeToDatabase(JSONdata, "students").catch(console.error);;

        //console.log(tempDataID);
        loggedIn = true;
        res.redirect('/');
      } else {
        // Redirect to the login page if unsuccessful or not a student
        res.redirect('/User/Authentication/Log-In').send("You are not a student");
      }
    };
  });
