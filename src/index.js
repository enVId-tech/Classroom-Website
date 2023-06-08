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

// Retrieve and parse the JSON data only once (during server initialization or when data is updated)
var jsonData = getItemsFromDatabase("students");
var existingJSON;

//Agenda Write Permissions
app.post('/agenda/permission', async function (req, res) {
  try {
    let dataID = decryptSessionID(req.body.dataID);

    if (!existingJSON) {
      //let existingData = fs.readFileSync('./src/studentinformation/studentinformation.json', 'utf8');
      existingJSON = JSON.parse(await getItemsFromDatabase("students", dataID));
    }

    if (existingJSON.isStaff == true) {
      res.send({ hasPermission: true });
    } else {
      res.send({ hasPermission: false });
    }
  } catch (err) {
    console.log(err);
    res.send({ error: err.message });
  }
});

// Write to agenda
app.post('/agenda/write', async (req, res) => {
  const dataID = req.body.dataID;

  const content = req.body.content;

  const windowURL = req.body.windowURL;

  let agendaJSON = await getItemsFromDatabase("agenda", dataID);

  for (let i = 0; i < agendaJSON.length; i++) {
    if (agendaJSON[i].url === windowURL) {
      agendaJSON[i].Calendar += content.content;
      await modifyInDatabase({ url: windowURL }, agendaJSON, "agenda");
      break;
    }
  }

  res.send(agendaJSON);
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

app.post('/sidebarget', async function (req, res) {
  try {
    const data = req.body;
    const dataID = decryptSessionID(data.dataID);

    const existingJSON = await getItemsFromDatabase("students", dataID);

    const sidebarJSON = await getItemsFromDatabase("classesavailable");

    let studentData;
    try {
      const parsedData = JSON.parse(existingJSON);
      studentData = JSON.stringify(parsedData[0].hasAccessTo);
    } catch (err) {
      throw new Error("Invalid JSON data");
    }

    if (studentData && sidebarJSON) {
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
app.post('/submitlearninglog', async (req, res) => {
  try {
    const data = req.body;
    const dataID = decryptSessionID(data.dataID);
    const studentDatabaseData = JSON.parse(await getItemsFromDatabase("students", dataID));

    if (studentDatabaseData.length === 0) {
      res.send({ error: 'User not found' });
      return;
    }

    let studentLogData = JSON.parse(await getItemsFromDatabase("assignmentslist"));

    if (studentLogData.length === 0) {
      studentLogData = null;
    }

    let sendData;
    if (studentLogData != null) {
      for (let i = 0; i < studentLogData.length; i++) {
        if (studentLogData[i].Email == studentDatabaseData[0].email) {
          sendData = studentLogData[i];

          sendData.Assignment.LearningLog.LearningLog = sendData.Assignment.LearningLog.LearningLog + 1;

          const learningLogName = "LearningLog " + sendData.Assignment.LearningLog.LearningLog.toString();

          const learningLogData = {
            "text": data.text,
            "date": data.date,
            "timeSubmitted": new Date().toLocaleString().toString().slice(0, 24)
          }

          sendData.Assignment.LearningLog[learningLogName] = learningLogData;

          await modifyInDatabase({ Email: studentDatabaseData[0].email }, sendData, "assignmentslist");
          break;
        }
      }
    } else if (studentLogData == null) {
      sendData = {
        "Name": studentData[0].firstName + " " + studentData[0].lastName,
        "Email": studentData[0].email,
        "Period": data.period,
        "Assignment": {
          "LearningLog": {
            "LearningLog": 0,
          }
        },
        "Class": data.Class,
        "dataIDNum": dataID,
      }

      sendData.Assignment.LearningLog.LearningLog = sendData.Assignment.LearningLog.LearningLog + 1;

      const learningLogName = "LearningLog " + sendData.Assignment.LearningLog.LearningLog.toString();

      const learningLogData = {
        "text": data.text,
        "date": data.date,
        "timeSubmitted": new Date().toLocaleString().toString().slice(0, 24)
      }

      sendData.Assignment.LearningLog[learningLogName] = learningLogData;

      await writeToDatabase(sendData, "assignmentslist"); // Write the data to the database

    }
  } catch (err) {
    console.log(err);
    res.send({ error: err.message });
  }
});

//Logout
app.post('/logout', (req, res) => {
  try {
    // Read existing JSON data from the file
    let dataID = decryptSessionID(req.body.dataID);

    let existingJSON = getItemsFromDatabase("students", dataID);

    //console.log("/logout: " + existingJSON);

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
    const dataID = req.body.dataID;

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
    // Read the encrypted ID from the request body
    let encryptedKey = req.body.dataID;
    let decryptedKey = decryptSessionID(encryptedKey);

    // Retrieve the data from the database
    let jsonArray = await getItemsFromDatabase("students", decryptedKey);
    if (jsonArray.length === 0) {
      res.send({ error: 'Data not found' });
      return;
    }

    // Get the first object from the retrieved array
    let data = JSON.parse(jsonArray)[0];

    // Remove the "dataIDNum" property
    delete data.dataIDNum;

    res.send(data); // Send the retrieved data as the response
  } catch (err) {
    res.send({ error: 'Invalid data' }); // Handle the case when the data is invalid
  }
});


app.post('/checkLoggedIn', (req, res) => {
  try {
    const data = req.body.DataID;

    console.log("/checkLoggedIn: " + data);
    if (data == "Error" || data == "null") {
      console.log("No DataID");
      res.sendStatus(401);
      return;
    }

    const jsonArray = getDataByDataId(data, "students");

    const unencryptedData = decryptSessionID(data);

    const dataNumber = jsonArray.findIndex(obj => obj.dataIDNum === unencryptedData);

    console.log(dataNumber);
    if (dataNumber === -1) {
      res.sendStatus(401);
      return;
    }

    const expiraryDate = new Date(jsonArray[dataNumber].unchangeableSettings.dayToLogOut);
    const currentDate = new Date();

    if (expiraryDate < currentDate) {
      jsonArray[dataNumber].unchangeableSettings.isLoggedin = false;
      writeToDatabase(jsonArray[dataNumber], "students");
      res.sendStatus(401);
    } else if (jsonArray[dataNumber].unchangeableSettings.isLoggedin) {
      res.sendStatus(200);
    } else {
      res.sendStatus(401);
    }
  } catch (err) {
    res.send({ error: 'Invalid data' });
  }
});


app.get('/api/GetMain', (req, res) => {
  try {
    if (loggedIn) {
      const newSessionID = encryptSessionID(tempDataID);

      res.send({ newSessionID });
    } else {
      res.status(302).redirect('/User/Authentication/Log-In');
    }
  } catch (err) {
    res.status(500).send({ error: err.message });
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
import { send } from 'process';

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

  //console.log("/announcements: " + jsonArray);

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
app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/error' }), async function (req, res) {
  // Checks if the user is using an auhsd email
  if (userProfile._json.hd === "student.auhsd.us" || userProfile._json.hd === "auhsd.us" || userProfile._json.hd === "frc4079.org") {
    const randomNumber = generateRandomNumber(64);
    const newDate = new Date();
    const currentDate = newDate.toString().slice(0, 24);
    newDate.setDate(newDate.getDate() + 7);
    const updatedDate = newDate.toString().slice(0, 24);

    let JSONdata;
    const fileData = await getItemsFromDatabase("students").then(data => JSON.parse(data)).catch(console.error);
    const numberFound = fileData?.findIndex(item => item.email === userProfile.emails[0].value);

    if (numberFound === "null" || numberFound === -1) {
      JSONdata = {
        displayName: userProfile.displayName,
        firstName: userProfile.name.givenName,
        lastName: userProfile.name.familyName,
        email: userProfile.emails[0].value,
        profilePicture: userProfile.photos[0].value,
        hd: userProfile._json.hd,
        hasAccessTo: [
          { name: "CSD", hasAccess: false },
          { name: "CSP", hasAccess: false },
          { name: "CSA", hasAccess: false },
          { name: "MobileAppDev", hasAccess: false },
          { name: "AdminPanel", hasAccess: false }
        ],
        unchangeableSettings: {
          isLoggedin: true,
          latestTimeLoggedIn: currentDate,
          dayToLogOut: updatedDate,
          isStudent: true,
          isStaff: false,
          latestIPAddress: encryptIP(req.socket.remoteAddress),
          isLockedOut: false
        },
        dataIDNum: randomNumber
      };
      tempDataID = randomNumber;
      await writeToDatabase(JSONdata, "students").catch(console.error);
    } else {
      JSONdata = {
        displayName: fileData[numberFound].displayName,
        firstName: fileData[numberFound].firstName,
        lastName: fileData[numberFound].lastName,
        email: fileData[numberFound].email,
        profilePicture: fileData[numberFound].profilePicture,
        hd: fileData[numberFound].hd,
        hasAccessTo: fileData[numberFound].hasAccessTo.map(item => ({ name: item.name, hasAccess: item.hasAccess })),
        unchangeableSettings: {
          isLoggedin: true,
          latestTimeLoggedIn: currentDate,
          dayToLogOut: updatedDate,
          isStudent: fileData[numberFound].unchangeableSettings.isStudent,
          isStaff: fileData[numberFound].unchangeableSettings.isStaff,
          latestIPAddress: encryptIP(req.socket.remoteAddress),
          isLockedOut: fileData[numberFound].unchangeableSettings.isLockedOut
        },
        dataIDNum: randomNumber
      };
      tempDataID = randomNumber;
      await modifyInDatabase({ email: fileData[numberFound].email }, JSONdata, "students").catch(console.error);
    }

    loggedIn = true;
    res.redirect('/');
  } else {
    // Redirect to the login page if unsuccessful or not a student
    res.redirect('/User/Authentication/Log-In');
  }
});
