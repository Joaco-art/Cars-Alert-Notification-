import { ObjectId } from "mongodb";
import { carsAlert } from "./db.js";
import { transporter } from "./nodemailer.js";

export async function setAlert(req, res) {
    const newAlert = {
        _id: new ObjectId(),
        name: String(req.body.username ?? "").trim(),
        email: String(req.body.email ?? "").trim(),
        brand: String(req.body.brand ?? "").trim(),
        model: String(req.body.model ?? "").trim(),
        year: Number(req.body.year),
        fuel: String(req.body.fuel_type ?? "").trim(),
        price: Number(req.body.price),
        km: Number(req.body.km),
        condition: String(req.body.condition ?? "").trim(),
        hasAccident: String(req.body.hasAccident ?? "").trim(),
        createdAt: new Date()
    };

    const hasInvalidText = !newAlert.name || !newAlert.email
        || !newAlert.brand || !newAlert.model
        || !newAlert.fuel || !newAlert.condition
        || !newAlert.hasAccident;

    const isEmptyNumber =
        String(req.body.year ?? "").trim() === "" ||
        String(req.body.price ?? "").trim() === "" ||
        String(req.body.km ?? "").trim() === "";

    const hasInvalidNumbers =
        isEmptyNumber ||
        !Number.isFinite(newAlert.year) || newAlert.year < 1900 || newAlert.year > 2026 ||
        !Number.isFinite(newAlert.price) || newAlert.price <= 0 ||
        !Number.isFinite(newAlert.km) || newAlert.km < 0;

    if (hasInvalidText || hasInvalidNumbers) {
        return res.status(400).render("error");
    }

    const result = await carsAlert.insertOne(newAlert);
    return res.redirect(`/carAlert/${result.insertedId}`);
}

export async function getAlertInfo(req, res) {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
        return res.status(400).send("ID de alerta no válido.");
    }

    const alert = await carsAlert.findOne({ _id: new ObjectId(id) });

    if (!alert) {
        return res.status(404).send("Alerta no encontrada.");
    }

    const emailSender = await transporter.sendMail({
    from: '"Example Team" <team@example.com>', // sender address
    to: `${alert.email}`, // list of recipients
    subject: "New car alert created", // subject line
    text: "Hello, we have received your petition succesfully, stay tunned for more", // plain text body
  })

    return res.render("carInfo", {
        name: alert.name,
        email: alert.email,
        brand: alert.brand,
        model: alert.model,
        year: alert.year,
        fuel: alert.fuel,
        price: alert.price,
        km: alert.km,
        condition: alert.condition,
        hasAccident: alert.hasAccident,
        emailSender
    });
}