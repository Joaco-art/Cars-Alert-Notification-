import express from 'express';
const router = express.Router();
import * as alertCars from "./scripts.js"
import * as filters from "./filtersAndPagination.js"
import { carsCollection, connectToMongoDB } from './db.js';

router.get('/', async (req, res) => {

    console.log(connectToMongoDB);
    const {cars, pagination} = await filters.getPaginatedCars(carsCollection.find().toArray(), req.query.page);
    res.render("index", { cars, pagination});
});

router.post("/carAlert", alertCars.setAlert);
router.get("/carAlert/:id", alertCars.getAlertInfo);


router.get("/search", filters.getSearch);

export default router;
