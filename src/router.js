import express from 'express';
import { MongoClient, ObjectId } from 'mongodb';
const router = express.Router();
export default router;
const client = new MongoClient('mongodb://localhost:27017');
const db = client.db('cars');
const carsCollection = db.collection('cars');

router.get('/', async (req, res) => {
    try {
        let cars = await carsCollection.find().toArray();
        res.render('index', { cars });
    } catch (error) {
        console.error("Error fetching cars:", error);
        res.status(500).send("Internal Server Error");
    }
});



router.post("/carAlert", async (req, res) => {
  
  try {
        const newCar = {
            _id: new ObjectId(),
            name: req.body.username,
            email: req.body.email,
            brand: req.body.brand,
            model: req.body.model,
            year: Number(req.body.year), 
            fuel: req.body.fuel_type,
            price: Number(req.body.price),
            km: Number(req.body.km),
            createdAt: new Date()
        };

  
        await carsCollection.insertOne(newCar);

        res.render("carInfo", {
            name: newCar.name,
            email: newCar.email,
            brand: newCar.brand,
            model: newCar.model,
            year: newCar.year,
            fuel: newCar.fuel,
            price: newCar.price,
            km: newCar.km
        });

    } catch (error) {
        console.error("Error saving car to database:", error);
        res.status(500).send("Error saving data to database");
    }
});