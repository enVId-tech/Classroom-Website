// Libraries
import express from 'express';
const app = express();
import session from 'express-session';
import passport from 'passport';
import _ from 'lodash';
import { processCommand } from './modules/consolecommands.js';
import { generateRandomNumber, encryptSessionID, decryptSessionID, encryptIP } from './modules/encryption.js';
import { writeToDatabase, modifyInDatabase, getItemsFromDatabase } from './modules/mongoDB.js';
import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth';

// Library Initialization
app.use(express.json());
app.set('trust proxy', true);

//Credentials
import dotenv from 'dotenv';
dotenv.config({ path: './src/credentials.env' });

//Website Pages Setup //DO NOT REMOVE THIS
app.use(express.static('public'));

//DO NOT REMOVE 
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: 'SECRET'
}));


app.use(passport.initialize());
app.use(passport.session());
// DO NOT REMOVE

const port = process.env.PORT || 3000;
app.listen(port, () => console.log('App listening on port ' + 3000));

//Global Variables
var userProfile;
var tempDataID;
var loggedIn = true; // Keep this at false for testing, real use keep false
var existingJSON;
// Google OAuth Credentials
const GOOGLE_CLIENT_ID = process.env.CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.CLIENT_SECRET;

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
  cb(null, obj);
});

//Google OAuth2 Page

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

//Google Login

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

//Permission to write to agenda in the database
app.post('/class/agenda/permission', async function (req, res) {
  try {
    // Retrieve the data ID number from the request body
    const dataID = decryptSessionID(req.body.dataID);

    //If the global variable existingJSON is not defined, then read the data from the database
    if (!existingJSON) {
      // Read the existing JSON data from the file
      existingJSON = JSON.parse(await getItemsFromDatabase("students", dataID));
    }

    // Check if the user has permission to write to the agenda
    if (existingJSON.isStaff == true) {
      // Send true if the user has permission
      res.send({ hasPermission: true });
    } else {
      // Send false if the user does not have permission
      res.send({ hasPermission: false });
    }
  } catch (err) {
    // Send an error message if there is an error
    console.log(err);
    res.send({ error: err.message });
  }
});

// Write to the agenda in the database
app.post('/class/agenda/write', async (req, res) => {
  try {
  // Retrieve the content from the request body
  const content = req.body.content;

  // Retrieve the URL from the request body
  const windowURL = req.body.windowURL;

  // Runs for the length of the agendaJSON array
  for (let i = 0; i < agendaJSON.length; i++) {
    // If the URL matches the URL in the JSON object, then add the content to the array
    if (agendaJSON[i].url === windowURL) {
      // Add the content to the array
      agendaJSON[i].Calendar += content.content;
      // Write the data to the database
      await modifyInDatabase({ url: windowURL }, agendaJSON, "agenda");
      // Breaks out of the loop
      break;
    }
  }

  res.send(agendaJSON);
} catch (err) {
  // Send an error message if there is an error
  console.log(err);
  res.send({ error: err });
}
});

// Get the data in announcements from the database
app.post('/class/announcements/get', async function (req, res) {
  try {
    // Retrieve the data ID number from the request body
    let data = req.body;

    // Read the existing JSON data from the file
    const jsonArray = JSON.parse(await getItemsFromDatabase("announcements"));

    // Runs for the length of the jsonArray
    for (let i = 0; i < jsonArray.length; i++) {
      // If the URL matches the URL in the JSON object, then add the content to the array
      if (jsonArray[i].url == data.url) {
        // Send the data to the client
        res.send(jsonArray[i]);
        // Breaks out of the loop
        break;
      }
    }
  } catch (err) {
    // Send an error message if there is an error
    console.log(err);
    res.send({ error: err.message });
  }
});

// Process the command in the console
app.post('/class/console/process', (req, res) => {
  try {
    // Retrieve the input from the request body
    const input = req.body.input;
    // Process the command in the processCommand function
    const commandprocess = processCommand(input);
    // Send the processed command to the client
    res.send({ commandprocess })
  } catch (err) {
    // Send an error message if there is an error
    console.log(err);
    res.send({ commandprocess: err.message });
  }
});

// On loading any page, get sidebar data from the database
app.post('/student/sidebar/get', async function (req, res) {
  try {
    // Retrieve the data ID number from the request body
    const dataID = decryptSessionID(req.body.dataID);

    // Read the student data from the file and return it using the student data ID, and makes it into an object after
    const existingJSON = JSON.parse(await getItemsFromDatabase("students", dataID));

    // Read the sidebar JSON data from the file
    const sidebarJSON = await getItemsFromDatabase("classesavailable");

    let studentData;
    try {
      // Make hasAccessTo in the existingJSON JSON object into a string
      studentData = JSON.stringify(existingJSON[0].hasAccessTo);
    } catch (err) {
      // Send an error message if there is an error
      throw new Error("Invalid JSON data");
    }

    // Send the student data and sidebar JSON data to the client if they are defined
    if (studentData && sidebarJSON) {
      // Send the student data and sidebar JSON data to the client
      res.send({ studentData, sidebarJSON });
    } else {
      // Send an error message if there is an error
      res.send({ error: "User not found" });
    }
  } catch (err) {
    // Send an error message if there is an error
    console.log(err);
    res.send({ error: err.message });
  }
});

// Get student assignment data from the database
// Write the comments for this after completing it.
app.post('/student/assignments/summary/get', async function (req, res) {
  try {
    let URL = req.body.url;
    let dataID = decryptSessionID(req.body.dataID);

    let studentData = JSON.parse(await getItemsFromDatabase("students", dataID));

    if (studentData.length === 0) {
      res.send({ error: 'User not found' });
      return;
    }

    let studentAssignmentData = JSON.parse(await getItemsFromDatabase("assignmentslist"));

    console.log(studentAssignmentData);

    if (studentAssignmentData.length === 0) {
      studentAssignmentData = null;
    }

    let sendData;
    if (studentAssignmentData != null) {
      for (let i = 0; i < studentAssignmentData.length; i++) {
        if (studentAssignmentData[i].Email == studentData[0].email) {
          sendData = studentAssignmentData[i].Assignment;
          break;
        }
      }
    } else if (studentAssignmentData == null) {
      sendData = "No Assignments";
    }

    res.send(sendData);

  } catch (err) {
    console.log(err);
    res.send({ error: err.message });
  }
})

// Writing learning log data to the database
app.post('/student/learninglog/submit', async (req, res) => {
  try {
    // Retrieve the data from the request body and puts it in a constant variable
    const data = req.body;
    // Decrypt the data ID
    const dataID = decryptSessionID(data.dataID);
    // Retrieve the student data from the database, get the data based off of the student's data ID and parse it
    const studentDatabaseData = JSON.parse(await getItemsFromDatabase("students", dataID));

    // If the student data is not found, then send an error message
    if (studentDatabaseData.length === 0) {
      res.send({ error: 'User not found' });
      return;
    }

    // Retrieve the student data from the database and parse it
    const studentLogData = JSON.parse(await getItemsFromDatabase("assignmentslist"));

    // If the student data is not found, then set it to null
    if (studentLogData.length === 0) {
      studentLogData = null;
    }

    // Create a variable to send the data to the database
    let sendData;
    // If the student data is not null, then run the code below
    if (studentLogData != null) {
      // Runs for the length of the studentLogData array
      for (let i = 0; i < studentLogData.length; i++) {
        // If the email matches the email in the JSON object, then add the content to the array
        if (studentLogData[i].Email == studentDatabaseData[0].email) {
          // Set the sendData variable to the studentLogData array
          sendData = studentLogData[i];

          // Add 1 to the learning log number
          sendData.Assignment.LearningLog.LearningLog = sendData.Assignment.LearningLog.LearningLog + 1;

          // Create a variable to store the learning log name
          const learningLogName = "LearningLog " + sendData.Assignment.LearningLog.LearningLog.toString();

          // Create a JSON variable to store the learning log data
          const learningLogData = {
            "text": data.text,
            "date": data.date,
            "timeSubmitted": new Date().toLocaleString().toString().slice(0, 24)
          }

          // Add the learning log data to the sendData variable
          sendData.Assignment.LearningLog[learningLogName] = learningLogData;

          // Write the data to the database
          await modifyInDatabase({ Email: studentDatabaseData[0].email }, sendData, "assignmentslist");
          
          // Breaks out of the loop
          break;
        }
      }
      // If the student data is null, then run the code below
    } else if (studentLogData == null) {
      // Create a JSON variable to store the learning log data
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

      // Add 1 to the learning log number
      sendData.Assignment.LearningLog.LearningLog = sendData.Assignment.LearningLog.LearningLog + 1;

      // Create a variable to store the learning log name
      const learningLogName = "LearningLog " + sendData.Assignment.LearningLog.LearningLog.toString();

      // Create a JSON variable to append on to the learning log data
      const learningLogData = {
        "text": data.text,
        "date": data.date,
        "timeSubmitted": new Date().toLocaleString().toString().slice(0, 24)
      }

      // Add the learning log data to the sendData variable
      sendData.Assignment.LearningLog[learningLogName] = learningLogData;

      // Write the data to the database
      await writeToDatabase(sendData, "assignmentslist"); // Write the data to the database
    }
  } catch (err) {
    // Send an error message if there is an error
    console.log(err);
    res.send({ error: err.message });
  }
});

// Logs the user out
app.post('/student/logout', async function (req, res) {
  try {
    // Retrieve the data ID from the request body
    const dataID = decryptSessionID(req.body.dataID);

    // Retrieve the student data from the database, get the data based off of the student's data ID
    const existingJSON = JSON.parse(await getItemsFromDatabase("students", dataID));

    // Creates a variable to store the data
    let findData;

    // Runs for the length of the existingJSON array
    if (existingJSON[i].dataIDNum == dataID) {
      // Sets the findData variable to the existingJSON array based off of the index
      findData = existingJSON[i];
      // Sets modifiedData to the findData variable
      const modifiedData = findData;
      // Sets properties in the modifiedData variable
      modifiedData.unchangeableSettings.isLoggedin = false;
      modifiedData.unchangeableSettings.latestTimeLoggedIn = "null";
      modifiedData.unchangeableSettings.dayToLogOut = "null";
      modifiedData.dataIDNum = "null";

      // Writes the data to the database
      let userData = modifyInDatabase(findData, modifiedData, "students");

      // If the userData variable has a returned value of success, then redirect the user to the login page
      if (userData == "Success") {
        res.redirect('/User/Authentication/Log-Out');
      } else {
        // Send an error message if there is an error
        res.send({ error: "Error" });
      }
    }
  } catch (err) {
    // Send an error message if there is an error
    res.send({ error: err.message });
  }
});

// Checks if the user is logged out
app.post('/student/logout/check', async function (req, res) {
  try {
    // Retrieve the data ID from the request body
    const dataID = decryptSessionID(req.body.dataID);

    // If the data ID is null, then send an error message
    if (dataID == null) {
      res.sendStatus(401);
      return;
    }

    // Retrieve the student data from the database, get the data based off of the student's data ID
    const existingJSON = JSON.parse(await getItemsFromDatabase("students", dataID));

    // If the existingJSON array is empty, then send an error message
    if (existingJSON.length === 0) {
      res.sendStatus(401);
      return;
    }

    // Sets date variables, one for the expirary date on the student's database profile and one for the current date
    const expiraryDate = new Date(existingJSON[0].unchangeableSettings.dayToLogOut);
    const currentDate = new Date();

    // If the expirary date is less than the current date, then set the isLoggedin property to false
    if (expiraryDate < currentDate) {
      existingJSON[0].unchangeableSettings.isLoggedin = false;
      writeToDatabase(jsonArray[dataNumber], "students");
      res.sendStatus(401);

      // If the isLoggedin property is true and the expirary date is greater than the current date, then send a status of 200
    } else if (existingJSON[0].unchangeableSettings.isLoggedin == true /*&& expiraryDate > currentDate*/) {
      //Sends status of 200 to client
      res.sendStatus(200);
    } else {
      // Sends status of 401 to client
      res.sendStatus(401);
    }
  } catch (err) {
    // Send an error message if there is an error
    console.log(err);
    res.send({ err });
  }
});

// Gets student data from the database
app.post('/student/data', async function (req, res) {
  try {
    // Retrieve the data ID from the request body
    const dataID = decryptSessionID(req.body.dataID);

    // Retrieve the data from the database
    const jsonArray = JSON.parse(await getItemsFromDatabase("students", dataID));
    
    // If the jsonArray is empty, then send an error message
    if (jsonArray.length === 0) {
      res.send({ error: 'Data not found' });
      return;
    }

    // Remove the "dataIDNum" property
    delete jsonArray.dataIDNum;

    // Send the data to the client
    res.send(jsonArray);
  } catch (err) {
    // Send an error message if there is an error
    console.log(err);
    res.send({ err });
  }
});

// Gets the student's randomly generated dataID
app.get('/student/ID', (req, res) => {
  try {
    // If the tempDataID variable is not defined, then send an error message
    if (loggedIn === true) {
      // Encrypt the tempDataID variable
      const newSessionID = encryptSessionID(tempDataID);

      // Send the encrypted tempDataID variable to the client
      res.send({ newSessionID });
    } else {
      // Send an error message if there is an error
      res.status(302).redirect('/User/Authentication/Log-In');
    }
  } catch (err) {
    // Send an error message if there is an error
    console.log(err);
    res.status(500).send({ error: err });
  }
});