import dotenv from "dotenv";
const envFile =
    process.env.NODE_ENV === "production" ? ".env.production" : ".env";
dotenv.config({ path: envFile });

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mailjet from "node-mailjet";
import connectDB from "./lib/connectDB.js";

import referenceRouter from "./routes/reference.route.js";

import imagesRouter from "./routes/images.js";

const app = express();
const PORT = process.env.PORT || 4000;

const IK_PRIVATE_KEY = process.env.IK_PRIVATE_KEY;

const mailjetClient = mailjet.apiConnect(
    process.env.MJ_APIKEY_PUBLIC,
    process.env.MJ_APIKEY_PRIVATE,
    {
        config: {},
        options: {},
    }
);

const allowedOrigins = ["http://localhost:5173", process.env.CLIENT_URL || "*"];

app.use(
    cors({
        origin: allowedOrigins,
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type"],
    })
);

app.use(bodyParser.json());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});

app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.url}`);
    next();
});

app.use("/reference", referenceRouter);

app.use("/api/images", imagesRouter);

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

app.get("/test", async (req, res) => {
    console.log("Got /test");
    console.log("Headers", req.headers);
    console.log("Body", req.body);
    res.status(200).json({ message: "OK" });
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        message: error.message || "Soemthing went wrong",
        status: error.status,
        stack: error.stack,
    });
});

app.listen(PORT, () => {
    connectDB();
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});

process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception:", err);
});

process.on("unhandledRejection", (reason, promise) => {
    console.error("Unhandled Rejection at:", promise, "reason:", reason);
});
