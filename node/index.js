// Libraries
import express from 'express';
const app = express();
import session from 'express-session';
import passport from 'passport';
import _ from 'lodash';
import Filter from 'bad-words';
const filter = new Filter();
import { processCommand } from './modules/consolecommands.js';
import { generateRandomNumber, encryptPassword, comparePassword, encryptData, decryptData, encryptIP } from './modules/encryption.js';
import { writeToDatabase, modifyInDatabase, getItemsFromDatabase } from './modules/mongoDB.js';
import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth';

// Library Initialization
app.use(express.json());
app.set('trust proxy', true);

//Credentials
import dotenv from 'dotenv';
dotenv.config({ path: './node/credentials.env' });

//Website Pages Setup //DO NOT REMOVE THIS
app.use(express.static('./build'));

//DO NOT REMOVE 
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: 'SECRET'
}));


app.use(passport.initialize());
app.use(passport.session());
// DO NOT REMOVE

const port = process.env.PORT || 3001;
app.listen(port, () => console.log('App listening on port ' + port));

//Global Variables
var userProfile;
var tempDataID;
var loggedIn = false;
var existingJSON;
var mainServerAuthTag;

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

app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/error' }), async (req, res) => {
  try {
    // Set the userProfile to the user's profile
    const userProfile = req.user;

    // Check if the user is using a valid email domain
    const validEmailDomains = ["student.auhsd.us", "auhsd.us", "frc4079.org"];
    if (validEmailDomains.includes(userProfile._json.hd)) {
      // Generate a random 64 integer number for the data ID
      const randomNumber = await generateRandomNumber(64);
      // Creates a variable to store the current date and time
      const currentDate = new Date().toString().slice(0, 24);
      const newDate = new Date();
      // Sets the date to 7 days from the current date
      newDate.setDate(newDate.getDate() + 7);
      const updatedDate = newDate.toString().slice(0, 24);

      // Retrieves database data from the database
      const fileData = JSON.parse(await getItemsFromDatabase("students"));
      // Finds the index of the user's email in the database
      const numberFound = fileData.findIndex(item => item.email === userProfile.emails[0].value);

      // Creates a variable to store the JSON data
      let JSONdata;
      // If the numberFound variable is -1, then run the code below
      if (numberFound === -1) {
        // Create a JSON object to store the newly created user data
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
          siteUsername: null,
          sitePassword: null,
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

        // Sets a global variable to the data ID
        tempDataID = randomNumber;
        // Write the data to the database
        await writeToDatabase(JSONdata, "students").catch(console.error);
      } else {
        // Sets the JSONdata variable to the data in the database based off of the index
        JSONdata = fileData[numberFound];
        // Sets properties in the JSONdata variable
        JSONdata.unchangeableSettings.isLoggedin = true;
        JSONdata.unchangeableSettings.latestTimeLoggedIn = currentDate;
        JSONdata.unchangeableSettings.dayToLogOut = updatedDate;
        JSONdata.unchangeableSettings.latestIPAddress = encryptIP(req.socket.remoteAddress);
        JSONdata.dataIDNum = randomNumber;

        // Sets a global variable to the data ID
        tempDataID = randomNumber;
        // Modify the data in the database based off of the user's email
        await modifyInDatabase({ email: fileData[numberFound].email }, JSONdata, "students").catch(console.error);
      }

      // Sets true to the loggedIn variable
      loggedIn = true;
      // Redirect to the home page
      res.redirect('/');
    } else {
      // Redirect to the login page if unsuccessful or not a student
      res.redirect('/User/Authentication/Log-In');
    }
  } catch (error) {
    console.error(error);
    res.redirect('/error');
  }
});


//Requests for classes

//Permission to write to agenda in the database
app.post('/class/agenda/permission', async (req, res) => {
  try {
    // Retrieve the data ID number from the request body
    const dataID = await decryptData(req.body.dataID, mainServerAuthTag);

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
app.post('/class/announcements/get', async (req, res) => {
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


// Requests for students

// On loading any page, get sidebar data from the database
app.post('/student/sidebar/get', async (req, res) => {
  try {
    // Retrieve the data ID number from the request body
    const dataID = await decryptData(req.body.dataID, mainServerAuthTag);
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
      console.log(err);
      res.send({ error: err.message });
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

// Work on getting assignments here
app.post('/student/assignments/summary/get', async (req, res) => {
  try {
    let URL = req.body.url;
    let dataID = await decryptData(req.body.dataID, mainServerAuthTag);

    let studentData = JSON.parse(await getItemsFromDatabase("students", dataID));

    if (studentData.length === 0) {
      res.send({ error: 'User not found' });
      return;
    }

    let studentAssignmentData = JSON.parse(await getItemsFromDatabase("assignmentslist"));

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
    const dataID = await decryptData(data.dataID, mainServerAuthTag);
    // Retrieve the student data from the database, get the data based off of the student's data ID and parse it
    const studentDatabaseData = JSON.parse(await getItemsFromDatabase("students", dataID));

    // If the student data is not found, then send an error message
    if (studentDatabaseData.length === 0) {
      res.send({ error: 'User not found' });
      return;
    }

    // Retrieve the student data from the database and parse it
    let studentLogData = JSON.parse(await getItemsFromDatabase("assignmentslist"));

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
        "Name": studentDatabaseData[0].firstName + " " + studentDatabaseData[0].lastName,
        "Email": studentDatabaseData[0].email,
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
app.post('/student/data/logout', async (req, res) => {
  try {
    // Retrieve the data ID from the request body
    const dataID = await decryptData(req.body.dataID, mainServerAuthTag);

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
        loggedIn = false;
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
app.post('/student/data/logout/check', async (req, res) => {
  try {
    // Retrieve the data ID from the request body

    const dataID = await decryptData(req.body.dataID, mainServerAuthTag);

    // If the data ID is null, then send an error message
    if (dataID == null) {
      res.sendStatus(401);
      return;
    }

    // If loggedIn is false, then send an error message
    if (loggedIn == false) {
      res.sendStatus(401);
      return;
    }

    // Retrieve the student data from the database, get the data based off of the student's data ID
    const existingJSON = JSON.parse(await getItemsFromDatabase("students", dataID));

    // If the existingJSON array is empty, then send an error message
    if (existingJSON.length === 0) {
      loggedIn = false;
      res.sendStatus(401);
      return;
    }

    // Sets date variables, one for the expirary date on the student's database profile and one for the current date
    const expiraryDate = new Date(existingJSON[0].unchangeableSettings.dayToLogOut);
    const currentDate = new Date();

    // If the expirary date is less than the current date, then set the isLoggedin property to false
    if (expiraryDate < currentDate) {
      loggedIn = false;
      existingJSON[0].unchangeableSettings.isLoggedin = false;
      writeToDatabase(jsonArray[dataNumber], "students");
      res.sendStatus(401);

      // If the isLoggedin property is true and the expirary date is greater than the current date, then send a status of 200
    } else if (existingJSON[0].unchangeableSettings.isLoggedin == true /*&&  expiraryDate > currentDate*/) {
      //Sends status of 200 to client
      res.sendStatus(200);
    } else {
      // Sends status of 401 to client
      loggedIn = false;
      res.sendStatus(401);
    }
  } catch (err) {
    // Send an error message if there is an error
    loggedIn = false;
    console.log(err);
    res.send({ err });
  }
});

// Gets student data from the database
app.post('/student/data', async (req, res) => {
  try {
    // Check if req.body.dataID or mainServerAuthTag is undefined
    if (!req.body.dataID || !mainServerAuthTag) {
      res.send({ error: 'Invalid data or authentication tag' });
      return;
    }

    // Retrieve the data ID from the request body
    const dataID = await decryptData(req.body.dataID, mainServerAuthTag);

    // Retrieve the data from the database
    const jsonArray = JSON.parse(await getItemsFromDatabase("students", dataID));

    // If the jsonArray is empty, then send an error message
    if (jsonArray.length === 0) {
      res.send({ error: 'Data not found' });
      return;
    }

    // Remove the "dataIDNum" property
    delete jsonArray.dataIDNum;
    // Remove the "siteUsername" property
    delete jsonArray.siteUsername;
    // Remove the "sitePassword" property
    delete jsonArray.sitePassword;

    // Send the data to the client
    res.send(jsonArray);
  } catch (err) {
    // Send an error message if there is an error
    console.log(err);
    res.send({ err });
  }
});

// Updates student username and password in database
app.post('/student/data/update', async (req, res) => {
  try {
    // Retrieve the data from the request body
    const data = req.body;
    if (data.URL.includes("/settings/")) {
      // If the username, password, or passwordconfirm is empty, then send an error message
      if (data.username == "" || data.password == "" || data.passwordconfirm == "") {
        res.send({ error: "Please fill out all fields" });
      } else {
        // If the password and passwordconfirm match, then run the code below
        if (data.password == data.passwordconfirm) {
          try {
            // Retrieve the student data from the database, get the data based off of the student's data ID
            const existingJSON = JSON.parse(await getItemsFromDatabase("students", await decryptData(data.dataIDNum, mainServerAuthTag)));
            const modifiedData = existingJSON[0];

            // Encrypt the password
            const encryptData = await encryptPassword(data.password, 10);

            // Set the siteUsername and sitePassword properties in the modifiedData variable
            modifiedData.siteUsername = existingJSON[0].email;
            modifiedData.sitePassword = encryptData;
            // Write the data to the database
            await modifyInDatabase({ email: existingJSON[0].email }, modifiedData, "students");

            // Send a success message if there is no error
            res.send({ success: "Success" });
          } catch (err) {
            // Send an error message if there is an error
            console.log(err);
            res.send({ error: "Server Side Error: " + err });
          }
          // If the password and passwordconfirm do not match, then send an error message
        } else {
          res.send({ error: "Passwords do not match" });
        }
      }
    } else if (data.URL.includes("/profile/")) {
      // Retrieve the student data from the database, get the data based off of the student's data ID
      const existingJSON = JSON.parse(await getItemsFromDatabase("students", await decryptData(data.dataIDNum, mainServerAuthTag)));
      const modifiedData = existingJSON[0];
      if (filter.isProfane(data.displayName)) {
        res.send({ error: "Please do not use profanity:" + filter.clean(data.displayName) });
      } else {
        // Set the profilePicture property in the modifiedData variable
        modifiedData.profilePicture = data.profilePicture;
        modifiedData.displayName = data.displayName;
        // Write the data to the database
        await modifyInDatabase({ email: existingJSON[0].email }, modifiedData, "students");

        // Send a success message if there is no error
        res.send({ success: "Success" });
      }
    }
  } catch (err) {
    // Send an error message if there is an error
    console.log(err);
    res.send({ err });
  }
});

// Logs the user in on the login page instead of the google login page
app.post('/student/data/login', async (req, res) => {
  try {
    // Retrieve the username and password from the request body
    const username = req.body.username;
    const password = req.body.password;

    // Retrieve the student data from the database
    const existingJSON = JSON.parse(await getItemsFromDatabase("students"));

    // If the existingJSON array is empty, then send an error message
    if (existingJSON.length === 0) {
      res.send({ error: "No users currently available in database" });
    }

    // Create a variable to store if the user is found
    let userFound = false;

    // Runs for the length of the existingJSON array
    for (let i = 0; i < existingJSON.length; i++) {
      // If the username matches the username in the JSON object, then run the code below
      if (existingJSON[i].siteUsername == username) {

        // Decrypt the password
        const decryptedPassword = await comparePassword(password, existingJSON[i].sitePassword, existingJSON[i].authTag);

        // If the decryptedPassword variable is true, then run the code below
        if (decryptedPassword) {
          // Sets the userFound variable to true
          userFound = true;

          // Generate a random 64 integer number for the data ID
          const randomNumber = await generateRandomNumber(64);
          // Creates a variable to store the current date and time
          const newDate = new Date();
          const currentDate = newDate.toString().slice(0, 24);
          // Sets the date to 7 days from the current date
          newDate.setDate(newDate.getDate() + 7);
          const updatedDate = newDate.toString().slice(0, 24);

          // Sets properties in the modifiedData variable
          const modifiedData = existingJSON[i];
          // Sets properties in the modifiedData variable
          modifiedData.unchangeableSettings.isLoggedin = true;
          modifiedData.unchangeableSettings.latestTimeLoggedIn = currentDate;
          modifiedData.unchangeableSettings.dayToLogOut = updatedDate;
          modifiedData.unchangeableSettings.latestIPAddress = encryptIP(req.socket.remoteAddress);
          modifiedData.dataIDNum = randomNumber;

          // Sets a global variable to the data ID
          tempDataID = randomNumber;
          // Sets true to the loggedIn variable
          loggedIn = true;

          // Write the data to the database
          await modifyInDatabase({ email: existingJSON[i].email }, modifiedData, "students");
          // Send a success message if there is no error
          res.send({ success: "Success" });
          // Breaks out of the loop
          break;
        } else {
          userFound = true;
          // Send an error message if there is an error
          res.send({ error: "Incorrect Password" });
          // Breaks out of the loop
          break;
        }
      }
    }

    // If the userFound variable is false, then send an error message
    if (!userFound) {
      res.send({ error: "Incorrect Username" });
      return;
    }
  } catch (err) {
    // Send an error message if there is an error
    console.log(err);
    res.send({ error: err });
  }
});

// Gets the student's randomly generated dataID
app.get('/student/data/ID', async (req, res) => {
  try {
    // If the tempDataID variable is not defined, then send an error message
    if (loggedIn === true) {
      // Encrypt the tempDataID variable
      const { encryptedData, authTag } = await encryptData(tempDataID);

      // Set the mainServerAuthTag variable to the authTag variable
      mainServerAuthTag = authTag;

      // Send the encrypted tempDataID variable to the client
      res.send({ encryptedData });
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