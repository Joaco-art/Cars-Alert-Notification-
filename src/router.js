import express from 'express';
const router = express.Router();
export default router;
import * as alertCars from "./scripts.js"
import * as filters from "./filtersAndPagination.js"
import { carsCollection } from './db.js';

router.get('/', async (req, res) => {

    const cars = await filters.getPaginatedCars(carsCollection.find().toArray());
    res.render("index", { cars});
});

router.post("/carAlert", alertCars.setAlert);
router.get("/carAlert/:id", alertCars.getAlertInfo);


router.get("/search", filters.getSearch);