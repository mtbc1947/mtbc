import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mailjet from "node-mailjet";

const app = express();
const PORT = process.env.PORT || 4000;

const mailjetClient = mailjet.connect(
    process.env.MJ_APIKEY_PUBLIC,
    process.env.MJ_APIKEY_PRIVATE
);

app.use(cors());
app.use(bodyParser.json());

app.post("/send-email", async (req, res) => {
    const { firstName, lastName, email, phone, message } = req.body;

    try {
        const result = await mailjetClient
            .post("send", { version: "v3.1" })
            .request({
                Messages: [
                    {
                        From: {
                            Email: "maidenheadtownbc@gmail.com",
                            Name: "MTBC",
                        },
                        To: [
                            {
                                Email: "allentrev88@gmail.com",
                                Name: "Trevor Allen",
                            },
                        ],
                        Subject: `Contact Form: ${firstName} ${lastName}`,
                        TextPart: `Name: ${firstName} ${lastName}\nEmail: ${email}\nPhone: ${phone}\nMessage:\n${message}`,
                        HTMLPart: `
            <h3>New Contact Form Submission</h3>
            <p><strong>Name:</strong> ${firstName} ${lastName}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Message:</strong><br/>${message}</p>
          `,
                    },
                ],
            });

        res.status(200).json({ message: "Email sent successfully!" });
    } catch (error) {
        console.error("Mailjet error:", error);
        res.status(500).json({ message: "Failed to send email." });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
