import { MongoClient } from 'mongodb';

//Credentials
import dotenv from 'dotenv';
dotenv.config({ path: './node/credentials.env' });
const uri = process.env.MONGODB_URI;
const clientDB = process.env.CLIENT_DB;
const client = new MongoClient(uri);

async function connectToDatabase() {
  try {
    await client.connect();
    //console.log("Connected to MongoDB successfully!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
}

async function writeToDatabase(data, collectionName) {
  try {
    await connectToDatabase();

    const database = client.db(clientDB);
    const collection = database.collection(collectionName);

    const result = await collection.insertOne(data);

    //console.log("Inserted document with _id:", result.insertedId);
    return result.insertedId;
  } catch (error) {
    console.error("Error writing to database:", error);
    throw error;
  }
}

async function modifyInDatabase(filter, update, collectionName) {
  try {
    await connectToDatabase();

    const database = client.db(clientDB);
    const collection = database.collection(collectionName);

    const { _id, ...updateData } = update;

    const result = await collection.updateOne(filter, { $set: updateData });

    console.log("Modified", result.modifiedCount, "document(s)");
    return result.modifiedCount;
  } catch (error) {
    console.error("Error modifying document:", error);
    throw error;
  }
}

async function deleteFromDatabase(filter, collectionName, type) {
  try {
    await connectToDatabase();
    
    const database = client.db(clientDB);

    if (type === 1 || type === "one") {
      const collection = database.collection(collectionName);

      const result = await collection.deleteOne(filter);

      console.log("Deleted", result.deletedCount, "document(s)");

      return result.deletedCount;

    } else if (type === 2 || type === "many") {
      const collection = database.collection(collectionName);

      const result = await collection.deleteMany(filter);

      console.log("Deleted", result.deletedCount, "document(s)");
      
      return result.deletedCount;
    }
  } catch (error) {
    console.error("Error deleting document(s):", error);
    throw error;
  }
}

async function getItemsFromDatabase(collectionName, dataId) {
  try {
    await connectToDatabase();

    const database = client.db(clientDB);
    const collection = database.collection(collectionName);
    const projection = { _id: 0 };
    let items;

    if (!dataId) {
      items = await collection.find({}, { projection }).toArray();
    } else {
      //console.log("Searching for dataId:", dataId);
      items = await collection.find({ dataIDNum: dataId }, { projection }).toArray();
    }

    return JSON.stringify(items);
  } catch (error) {
    console.error("Error getting items from database:", error);
    throw error;
  }
}

export {
  writeToDatabase,
  modifyInDatabase,
  getItemsFromDatabase,
  deleteFromDatabase
};
