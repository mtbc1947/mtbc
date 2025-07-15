import Event from "../models/event.model.js";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import csvParser from "csv-parser";
import path from "path";

import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === "true", // false for 587
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export async function emailFile({ filePath, originalName, rowCount }) {
    const info = await transporter.sendMail({
        from: `"CSV Importer" <${process.env.SMTP_FROM}>`,
        to: process.env.SMTP_TO,
        subject: `CSV Imported (${rowCount} records)`,
        text: `The uploaded CSV (${originalName}) contained ${rowCount} records.`,
        attachments: [{ filename: originalName, path: filePath }],
    });

    console.log("Mailjet email sent:", info.messageId);
}

export const getEvents = async (req, res) => {
    console.log("event.controller, getEvents");
    const events = await Event.find();
    res.status(200).json(events);
};

export const createEvent = async (req, res) => {
    try {
        const eventId = `EVT-${uuidv4()}`;

        const newEvent = new Event({
            ...req.body,
            eventId,
        });

        await newEvent.save();

        console.log("event.controller, createEvent ", eventId);
        console.log(newEvent);

        res.status(201).json(newEvent);
    } catch (err) {
        console.error("Error creating event:", err);
        res.status(400).json({ message: err.message });
    }
};

export const updateEvent = async (req, res) => {
    try {
        const eventId = req.params.id; // this is actually the custom eventId
        const updateData = req.body;
        console.log("event.controller, updateEvent ", eventId);
        console.log(updateData);

        const updatedEvent = await Event.findOneAndUpdate(
            { eventId: eventId },
            updateData,
            { new: true }
        );

        if (!updatedEvent) {
            return res.status(404).json({ message: "Event not found" });
        }

        res.status(200).json(updatedEvent);
    } catch (error) {
        console.error("Error updating event:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const importEvents = async (req, res) => {
    console.log("event.controller, importEvents");

    console.log("req.file:", req.file); // <-- MUST be defined
    console.log("req.body:", req.body);

    const file = req.file;
    if (!file) return res.status(400).json({ error: "No file uploaded" });
    console.log("File rxd");
    const filePath = file.path;
    const validRows = [];
    const validationErrors = [];

    try {
        let rowIndex = 0;

        await new Promise((resolve, reject) => {
            fs.createReadStream(filePath)
                .on("error", (err) => {
                    console.error("Stream read error:", err);
                    reject(err); // make sure this triggers the catch block
                })
                .pipe(csvParser())
                .on("data", (row) => {
                    try {
                        console.log(row);
                        const error = validateEventRow(row, rowIndex);
                        if (error) {
                            validationErrors.push(error);
                        } else {
                            validRows.push(row);
                        }
                        rowIndex++;
                    } catch (err) {
                        console.error("Error in row processing:", err);
                        reject(err);
                    }
                })
                .on("end", () => {
                    console.log("CSV parsing complete");
                    resolve();
                })
                .on("error", (err) => {
                    console.error("CSV parser error:", err);
                    reject(err);
                });
        });
        console.log("finished validation");
        if (validationErrors.length > 0) {
            return res.status(422).json({
                message: "Validation failed",
                errors: validationErrors,
            });
        }
        console.log("Insert many rows");
        //await Event.insertMany(validRows);
        fs.unlink(filePath, () => {}); // safe now

        // Optional: email even when valid (not shown here)
        res.status(200).json({
            message: "Import successful",
            inserted: validRows.length,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Import failed", details: err.message });
    }
};

function validateEventRow(row, index) {
    const errors = [];
    console.log(index, row);

    //if (!row.eventType || row.eventTyoe.trim() === "") {
    //    errors.push("Missing eventType");
    //}

    if (!row.startDate) {
        errors.push("Invalid or missing start date");
    }

    if (!row.subject || row.subject.trim() === "") {
        errors.push("Missing subject");
    }
    if (!row.startTime || row.startTime.trim() === "") {
        errors.push("Missing startTime");
    }
    if (!row.venue || row.venue.trim() === "") {
        errors.push("Missing venue");
    }

    return errors.length
        ? { row: index + 1, errors } // +1 for human-friendly row numbers
        : null;
}
