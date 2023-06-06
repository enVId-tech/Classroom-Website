import { MongoClient, ServerApiVersion } from 'mongodb';

const clientDB = "MrWaiDB";
const uri = "mongodb+srv://etran1:MydatabasePassword1422@mrwaidb.c4zt2hc.mongodb.net/?retryWrites=true&w=majority";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        await client.connect();
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } catch (error) {
        console.error(error);
    } finally {
        await client.close();
    }

}


run().catch(console.dir);

async function writeToDatabase(data, collectionName) {
    try {
        await client.connect();
        const database = client.db(clientDB);
        const collection = database.collection(collectionName);

        const result = await collection.insertOne(data);

        console.log("Inserted document with _id:", result.insertedId);
        return "Inserted document with _id:", result.insertedId;
    } catch (error) {
        console.dir(error);
    } finally {
        if (client) {
            await client.close();
        }
    }
}

async function modifyInDatabase(filter, update, collectionName) {
    try {
        await client.connect();
        const database = client.db(clientDB);
        const collection = database.collection(collectionName);

        const { _id, ...updateData } = update; // Exclude the _id field from the update

        const result = await collection.updateOne(filter, { $set: updateData });

        console.log("Modified", result.modifiedCount, "document(s)");
        return result.modifiedCount;
    } catch (error) {
        console.dir(error);
    } finally {
        if (client) {
            await client.close();
        }
    }
}



async function getItemsFromDatabase(collectionName, dataId) {
    let client; // Declare the client variable outside the try-catch block

    try {
        client = await MongoClient.connect(uri); // Connect to the MongoDB server

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
    } catch (error) {
        console.error("Error occurred while searching for dataId:", error);
        throw error; // Rethrow the error to be caught in the calling function
    } finally {
        if (client) {
            client.close(); // Close the MongoDB connection in the finally block
        }
    }
}


export {
    writeToDatabase,
    modifyInDatabase,
    getItemsFromDatabase
};
