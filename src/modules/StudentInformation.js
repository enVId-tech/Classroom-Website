//Imports
const fs = require('fs');
const crypto = require('crypto');

//Write User Data to File (JSON)

function writeUserDataToFile(JSONdata, filePath) {
    try {
      // Read existing JSON data from the file
      let existingData = fs.readFileSync(filePath, 'utf8');
  
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
      fs.writeFileSync(filePath, updatedJSON);
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
    try {  // Create an AES cipher object
      const cipher = crypto.createCipheriv('aes-256-cbc', encryptionKey, iv);
  
      // Encrypt the data
      let encryptedData = cipher.update(newSessionID, 'utf8', 'hex');
      encryptedData += cipher.final('hex');
  
      return encryptedData;
    } catch (err) {
      return "Error";
    }
  }
  
  //Decrypts Encrypted Session ID
  function decryptSessionID(encryptedData) {
    try {
      const decipher = crypto.createDecipheriv('aes-256-cbc', encryptionKey, iv);
  
      // Decrypt the data
      let decryptedData = decipher.update(encryptedData, 'hex', 'utf8');
      decryptedData += decipher.final('utf8');
  
      return decryptedData;
    } catch (err) {
      return "Error";
    }
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

module.exports = { writeUserDataToFile, generateRandomNumber, encryptSessionID, decryptSessionID, encryptIP };