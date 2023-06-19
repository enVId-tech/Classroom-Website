//Imports
import crypto from 'crypto';
import bcrypt from 'bcrypt';

//Generates Random Session Key

function generateRandomNumber(NumberofDigits) {
  let randomNumber = '';
  const digits = '0123456789';

  for (let i = 0; i < NumberofDigits; i++) {
    const randomIndex = Math.floor(Math.random() * digits.length);
    randomNumber += digits[randomIndex];
  }

  return randomNumber;
};

//Random encryption key and iv
const encryptionKey = crypto.randomBytes(32); // 256 bytes for AES-256
const iv = crypto.randomBytes(16); // 128 bytes for AES-256-CBC

async function encryptPassword(myPlaintextPassword, saltRounds) {
  try {
    const hash = await bcrypt.hash(myPlaintextPassword, saltRounds);
    return hash;
  } catch (err) {
    console.log(err);
    return err;
  }
}



async function comparePassword(password, hashedPassword) {
  try {
    return bcrypt.compare(password, hashedPassword);
  } catch (err) {
    console.log(err);
    return err;
  }
}


//Encrypts Session ID
async function encryptData(newSessionID) {
  try {
    // Create an AES cipher object
    const cipher = crypto.createCipheriv('aes-256-gcm', encryptionKey, iv);

    // Encrypt the data
    let encryptedData = cipher.update(newSessionID, 'utf8', 'hex');
    encryptedData += cipher.final('hex');

    // Get the authentication tag
    const authTag = cipher.getAuthTag();

    return { encryptedData, authTag };
  } catch (err) {
    console.log(err);
    return err;
  }
}

//Decrypts Encrypted Session ID
async function decryptData(encryptedData, authTag) {
  try {
    const decipher = crypto.createDecipheriv('aes-256-gcm', encryptionKey, iv);

    // Set the authentication tag
    decipher.setAuthTag(authTag);

    // Decrypt the data
    let decryptedData = decipher.update(encryptedData, 'hex', 'utf8');
    decryptedData += decipher.final('utf8');

    return decryptedData;
  } catch (err) {
    console.log(err);
    return err;
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

export {
  generateRandomNumber,
  encryptPassword,
  comparePassword,
  encryptData,
  decryptData,
  encryptIP
};