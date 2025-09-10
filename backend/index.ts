// index.ts
import dotenv from "dotenv";
const envFile = process.env.NODE_ENV === "production" ? ".env.production" : ".env";
dotenv.config({ path: envFile });

import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
//import mailjet from "node-mailjet";
import nodemailer from "nodemailer";

import connectDB from "./lib/connectDB.js";

import refDataRouter from "./routes/refData.route.js";
import eventRouter from "./routes/event.route.js";
import imagesRouter from "./routes/images.route.js";
import memberRouter from "./routes/member.route.js";
import officerRouter from "./routes/officer.route.js";
import committeeRouter from "./routes/committee.route.js";

// ---------- Types ----------
/**
interface MailjetRecipient {
  Email: string;
  Name?: string;
}

export interface MailjetMessage {
  From: MailjetRecipient;
  To: MailjetRecipient[];
  Cc?: MailjetRecipient[];
  Bcc?: MailjetRecipient[];
  Subject: string;
  TextPart?: string;
  HTMLPart?: string;
  CustomID?: string;
}
*/

interface ContactFormBody {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  message: string;
}

// ---------- App setup ----------
const app = express();
const PORT = process.env.PORT || 4000;

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth:{
    user: process.env.NM_EMAIL_USER,
    pass: process.env.NM_EMAIL_PASS,
  }
})
/**
const mailjetClient = (mailjet as any).apiConnect(
  process.env.MJ_APIKEY_PUBLIC,
  process.env.MJ_APIKEY_PRIVATE,
  { config: {}, options: {} }
);
*/

const allowedOrigins =
  process.env.NODE_ENV === "production" && process.env.CLIENT_URL
    ? process.env.CLIENT_URL.split(",")
    : ["http://localhost:5173"];

console.log("Allowed origins:", allowedOrigins);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // allow Postman, curl
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(
          new Error(`CORS not allowed from this origin [${origin}]`),
          false
        );
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
    credentials: true,
    optionsSuccessStatus: 204,
  })
);

app.use(express.json());

app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url} body:`, req.body);
  next();
});

// ---------- Routers ----------
app.use("/refData", refDataRouter);
app.use("/member", memberRouter);
app.use("/event", eventRouter);
app.use("/officer", officerRouter);
app.use("/committee", committeeRouter);
app.use("/api/images", imagesRouter);

// ---------- Routes ----------
app.post(
  "/send-email",
  async (req: Request<{}, {}, ContactFormBody>, res: Response) => {
    const { firstName, lastName, email, phone, message } = req.body;

    const toList = process.env.NM_EMAIL_TO?.split(",").map(e => e.trim()) || [];
    const ccList = process.env.NM_EMAIL_CC?.split(",").map(e => e.trim()) || [];

    const mailOptions = {
      from: `"${firstName} ${lastName}" <${email}>`,
      to: toList,
      cc: ccList.length > 0 ? ccList : undefined,
      subject: `[WEBMSG] Contact Form: ${firstName} ${lastName}`,
      text: `Name: ${firstName} ${lastName}\nEmail: ${email}\nPhone: ${phone}\nMessage:\n${message}`,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${firstName} ${lastName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Message:</strong><br/>${message}</p>
      `,
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log("Nodemailer result:", info.response);
      res.status(200).json({ message: "Email sent successfully!" });
    } catch (error) {
      console.error("Nodemailer error:", error);
      res.status(500).json({ message: "Failed to send email." });
    }
  }
);
/**
app.post(
  "/send-email",
  async (req: Request<{}, {}, ContactFormBody>, res: Response) => {
    const { firstName, lastName, email, phone, message } = req.body;
    console.log("Index.ts /send-email");

    const msg: MailjetMessage = {
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
    };

    try {
      const result = await mailjetClient
        .post("send", { version: "v3.1" })
        .request({ Messages: [msg] });

      console.log("Mailjet result:", result.body);
      res.status(200).json({ message: "Email sent successfully!" });
    } catch (error) {
      console.error("Mailjet error:", error);
      res.status(500).json({ message: "Failed to send email." });
    }
  }
);
*/

app.get("/health", (req, res) => res.send("OK"));

app.get("/test", (req, res) => {
  console.log("Got /test", { headers: req.headers, body: req.body });
  res.set(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate"
  );
  res.status(200).json({ message: "OK" });
});

// ---------- Error handler ----------
app.use(
  (error: Error & { status?: number }, req: Request, res: Response, next: NextFunction) => {
    res.status(error.status || 500).json({
      message: error.message || "Something went wrong",
      status: error.status,
      stack: error.stack,
    });
  }
);

// ---------- Start server ----------
app.listen(PORT, () => {
  connectDB();
  console.log(`Listening for client_url ${process.env.CLIENT_URL}`);
  console.log(`🚀 Server running on port: ${PORT}`);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});
