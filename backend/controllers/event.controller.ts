import { Request, Response } from "express";

import Event from "../models/event.model.js";
import { EventDocument } from "../types/event.js";

import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import csvParser from "csv-parser";
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

export async function emailFile({
    filePath,
    originalName,
    rowCount,
}: {
    filePath: string;
    originalName: string;
    rowCount: number;
}) {
    const info = await transporter.sendMail({
        from: `"CSV Importer" <${process.env.SMTP_FROM}>`,
        to: process.env.SMTP_TO,
        subject: `CSV Imported (${rowCount} records)`,
        text: `The uploaded CSV (${originalName}) contained ${rowCount} records.`,
        attachments: [{ filename: originalName, path: filePath }],
    });

    console.log("Mailjet email sent:", info.messageId);
}

export const getEvents = async (req: Request, res: Response): Promise<void> => {
    console.log("event.controller, getEvents");
    try {
        const events: EventDocument[] = await Event.find().sort({
            reqJDate: 1,
            startTime: 1,
        });
        res.status(200).json(events);
    } catch (err) {
        console.error("Error fetching events:", err);
        res.status(500).json({ message: "Failed to fetch events" });
    }
};

export const createEvent = async (
    req: Request,
    res: Response
): Promise<void> => {
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
    } catch (err: any) {
        console.error("Error creating event:", err);
        res.status(400).json({ message: err.message });
    }
};

export const updateEvent = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const eventId = req.params.id; // custom eventId
        const updateData = req.body;
        console.log("event.controller, updateEvent ", eventId);
        console.log(updateData);

        const updatedEvent = await Event.findOneAndUpdate(
            { eventId: eventId },
            updateData,
            { new: true }
        );

        if (!updatedEvent) {
            res.status(404).json({ message: "Event not found" });
            return;
        }

        res.status(200).json(updatedEvent);
    } catch (error: any) {
        console.error("Error updating event:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const importEvents = async (
    req: Request,
    res: Response
): Promise<void> => {
    console.log("event.controller, importEvents");

    const file = req.file;
    if (!file) {
        res.status(400).json({ error: "No file uploaded" });
        return;
    }

    console.log("File received:", file.originalname);
    const filePath = file.path;
    const validRows: Record<string, any>[] = [];
    const validationErrors: Array<{ row: number; errors: string[] }> = [];

    try {
        let rowIndex = 0;

        await new Promise<void>((resolve, reject) => {
            fs.createReadStream(filePath)
                .on("error", (err) => {
                    console.error("Stream read error:", err);
                    reject(err);
                })
                .pipe(csvParser())
                .on("data", (row) => {
                    try {
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

        if (validationErrors.length > 0) {
            res.status(422).json({
                message: "Validation failed",
                errors: validationErrors,
            });
            return;
        }

        // TODO: Uncomment when ready to insert
        // await Event.insertMany(validRows);
        fs.unlink(filePath, () => {}); // safe to delete now

        // Optionally send email notification here:
        // await emailFile({ filePath, originalName: file.originalname, rowCount: validRows.length });

        res.status(200).json({
            message: "Import successful",
            inserted: validRows.length,
        });
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ error: "Import failed", details: err.message });
    }
};

function validateEventRow(
    row: Record<string, string>,
    index: number
): { row: number; errors: string[] } | null {
    const errors: string[] = [];

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

    return errors.length > 0 ? { row: index + 1, errors } : null;
}
