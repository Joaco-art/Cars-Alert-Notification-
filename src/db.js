import { MongoClient} from 'mongodb';

const client = new MongoClient('mongodb://localhost:27017');
const db = client.db('cars');
export const carsAlert = db.collection("alerts");
export const carsCollection = db.collection('cars');