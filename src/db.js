import  "dotenv/config";
import { MongoClient } from 'mongodb';

const URI = process.env.MONGODB_URI;
const client = new MongoClient(URI);

export async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("You successfully connected to MongoDB!");
    return client;
  } catch (err) {
    console.dir(err);
  }
}

// Call this only when your application terminates
export async function disconnectFromMongoDB() {
  await client.close();
}

const db = client.db('cars');

export const carsAlert = db.collection("alerts");
export const carsCollection = db.collection('cars');