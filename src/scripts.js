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
        hasConsent: Boolean(req.body.consent),
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
        !Number.isFinite(newAlert.year) || newAlert.year < 1900 || newAlert.year > 2027 ||
        !Number.isFinite(newAlert.price) || newAlert.price <= 0 ||
        !Number.isFinite(newAlert.km) || newAlert.km < 0;
    
    const hasNoConsent = !newAlert.hasConsent;

    if (hasInvalidText || hasInvalidNumbers || hasNoConsent) {
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
    from: '"CarsAlert" <team@example.com>', // sender address
    to: `${alert.email}`, // list of recipients
    subject: "New car alert created", // subject line
    html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>New car alert created</title>
    </head>
    <body style="margin: 0; padding: 24px 16px; background-color: #f4f6f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #111827;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
        <tr>
          <td align="center">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 580px; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 10px; overflow: hidden;">
              <tr>
                <td style="background-color: #0f172a; color: #ffffff; padding: 22px 28px;">
                  <div style="font-size: 11px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: #cbd5e1; margin-bottom: 6px;">
                    CarsAlert
                  </div>
                  <h1 style="margin: 0; font-size: 20px; font-weight: 600; line-height: 1.3;">
                    New car alert created
                  </h1>
                </td>
              </tr>
              <tr>
                <td style="padding: 28px; font-size: 15px; line-height: 1.6; color: #374151;">
                  <div style="background-color: #ecfdf5; border: 1px solid #a7f3d0; color: #065f46; padding: 12px 16px; border-radius: 8px; font-size: 14px; font-weight: 500; margin-bottom: 20px;">
                    Your search alert has been received and is now active.
                  </div>

                  <p style="margin: 0 0 14px;">
                    Hello, ${alert.name},  we have received your petition successfully. We are actively monitoring for a matching vehicle and will notify you by email as soon as one is found.
                  </p>

                  <p style="margin: 0 0 22px;">
                    Stay tuned for updates. No further action is required from your side at this moment.
                  </p>

                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f8fafc; border: 1px solid #e5e7eb; border-radius: 8px; padding: 14px 18px; font-size: 14px;">
                    <tr>
                      <td style="padding: 5px 0; color: #6b7280; font-weight: 500;">Status</td>
                      <td align="right" style="padding: 5px 0; color: #111827; font-weight: 600;">Active search</td>
                    </tr>
                    <tr>
                      <td style="padding: 5px 0; color: #6b7280; font-weight: 500;">Notification channel</td>
                      <td align="right" style="padding: 5px 0; color: #111827; font-weight: 600;">Email (${alert.email})</td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td style="background-color: #fafafa; border-top: 1px solid #e5e7eb; padding: 16px 28px; font-size: 12px; color: #6b7280;">
                  Automated notification from CarsAlert.
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `,// plain text body
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