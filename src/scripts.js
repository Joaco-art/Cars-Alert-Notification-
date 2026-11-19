import { ObjectId } from "mongodb";
import { carsAlert } from "./db.js";

export async function setAlert(req, res) {
    try {
        const newAlert = {
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

        const result = await carsAlert.insertOne(newAlert);
        return res.redirect(`/carAlert/${result.insertedId}`);
    } catch (error) {
        console.error("Error al guardar la alerta:", error);
        return res.status(500).send("Error interno al guardar la alerta.");
    }
}

export async function getAlertInfo(req, res) {
    try {
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
            return res.status(400).send("ID de alerta no válido.");
        }

        const alert = await carsAlert.findOne({ _id: new ObjectId(id) });

        if (!alert) {
            return res.status(404).send("Alerta no encontrada.");
        }

        return res.render("carInfo", {
            name: alert.name,
            email: alert.email,
            brand: alert.brand,
            model: alert.model,
            year: alert.year,
            fuel: alert.fuel,
            price: alert.price,
            km: alert.km
        });
    } catch (error) {
        console.error("Error al cargar la alerta:", error);
        return res.status(500).send("Error interno al recuperar la alerta.");
    }
}