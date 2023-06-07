import { MongoClient } from 'mongodb';

const clientDB = "MrWaiDB";
const uri = "mongodb+srv://etran1:MydatabasePassword1422@mrwaidb.c4zt2hc.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);

async function connectToDatabase() {
  try {
    await client.connect();
    console.log("Connected to MongoDB successfully!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
}

async function writeToDatabase(data, collectionName) {
  await connectToDatabase();

  const database = client.db(clientDB);
  const collection = database.collection(collectionName);

  const result = await collection.insertOne(data);

  console.log("Inserted document with _id:", result.insertedId);
  return result.insertedId;
}

async function modifyInDatabase(filter, update, collectionName) {
  await connectToDatabase();

  const database = client.db(clientDB);
  const collection = database.collection(collectionName);

  const { _id, ...updateData } = update;

  const result = await collection.updateOne(filter, { $set: updateData });

  console.log("Modified", result.modifiedCount, "document(s)");
  return result.modifiedCount;
}

async function getItemsFromDatabase(collectionName, dataId) {
  await connectToDatabase();

  const database = client.db(clientDB);
  const collection = database.collection(collectionName);
  const projection = { _id: 0 };
  let items;

  if (!dataId) {
    items = await collection.find({}, { projection }).toArray();
  } else {
    console.log("Searching for dataId:", dataId);
    items = await collection.find({ dataIDNum: dataId }, { projection }).toArray();
  }

  return JSON.stringify(items);
}

export {
  writeToDatabase,
  modifyInDatabase,
  getItemsFromDatabase
};
