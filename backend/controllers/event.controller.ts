import { Request, Response } from "express";
import mongoose from "mongoose";

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
        Game_Event: `CSV Imported (${rowCount} records)`,
        text: `The uploaded CSV (${originalName}) contained ${rowCount} records.`,
        attachments: [{ filename: originalName, path: filePath }],
    });

    console.log("Mailjet email sent:", info.messageId);
}

// Utility: normalize optional fields "" → null
function convertToNull<T extends Record<string, any>>(data: T): T {
  const optionalFields: (keyof T)[] = [
    "mix",
    "dress",
    "rinks",
    "gameType",
    "league",
    "division",
    "team",
    "useType",
  ] as (keyof T)[];

  for (const field of optionalFields) {
    if (data[field] !== undefined && (data[field] === "" || data[field] === null)) {
      data[field] = null as any; 
    }
  }

  return data;
}

export const getEvents = async (req: Request, res: Response): Promise<void> => {
    console.log("event.controller, getEvents");
    try {
        const events: EventDocument[] = await Event.find().sort({
            reqJDate: 1,
            Time: 1,
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

        const normalized = convertToNull({ ...req.body, eventId });

        const newEvent = new Event(normalized);

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
        const updateData = convertToNull({ ...req.body });

        console.log("event.controller, updateData ", eventId);
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

//------------------------------- Import file -----------------------------------------------------------------------
//

const MONTHS: Record<string, number> = {
    Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6,
    Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12,
};

function mapCalKey(Type: string): string {
    switch (Type) {
        case "KL": return "KL";
        case "KLV": return "KV";
        case "RS": return "RSL";
        case "TV": return "TVL";
        case "F": return "FG";
        case "L": return "HG";
        default: return "MTBC";
    }
}

function getJulianDate(date: Date): number {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
}

/**
 * Validate a single row (after a Month line).
 * Returns null if valid, or { row, errors } if invalid.
 */
function validateImportRow(
    cols: string[],
    month: number,
    year: number,
    rowIndex: number
): { row: number; errors: string[] } | null {
    const errors: string[] = [];

    const [
        DiM,
        Game_Event,
        Rinks,
        Type,
        H_A,
        Time,
        Dress,
    ] = cols.map((c) => (c ? c.trim() : ""));

    const allowedTypes = ["KL", "KLV", "RS", "TV", "L", "F", ""];

    // Day validation
    const day = parseInt(DiM, 10);
    if (isNaN(day) || day < 1 || day > 31) {
        errors.push(`Invalid day in month: ${DiM}`);
    }

    // Full date check
    let eventDate: Date | null = null;
    if (errors.length === 0) {
        eventDate = new Date(year, month - 1, day);
        if (eventDate.getMonth() + 1 !== month || eventDate.getDate() !== day) {
            errors.push(`Invalid date: ${day}/${month}/${year}`);
        }
    }

    // Time check
    if (!/^(09|1[0-9]|20|21):[0-5][0-9]$/.test(Time.trim())) {
        errors.push(`Invalid start time: ${Time}`);
    }

    // H_A check
    if (!["Home", "Away"].includes(H_A)) {
        errors.push(`Invalid H_A: ${H_A}`);
    }

    // Type check
    const type = (Type || "").trim().toUpperCase();
    if (!allowedTypes.includes(type)) {
        errors.push(`Invalid Type: ${Type}`);
    }

    // Dress check
    if (Dress && !["W", "G"].includes(Dress)) {
        errors.push(`Invalid Dress: ${Dress}`);
    }

    // Rinks marker check
    if (Rinks) {
        if (!/^[1-6](?:[LM][SDTF]?)?$/.test(Rinks)) {
            errors.push(`Invalid rinks marker: ${Rinks}`);
        }
    }

    if (!Game_Event) {
        errors.push("Missing Game_Event");
    }

    return errors.length > 0 ? { row: rowIndex, errors } : null;
}

/**
 * Build a validated Event record
 */
function buildEvent(
    cols: string[],
    month: number,
    year: number
): any {
    const [
        DiM,
        Game_Event,
        Rinks,
        Type,
        H_A,
        Time,
        Dress,
    ] = cols.map((c) => (c ? c.trim() : ""));

    const day = parseInt(DiM, 10);
    const eventDate = new Date(year, month - 1, day);

    let mix: string | null = null;
    let rinks: string | null = null;
    let duration = 3;
    let eventType = "";
    let dress: string | null = null;
    let homeAway = (H_A === "Home") ? "H" : "A";
    let gameType: string | null = null;

    if (Rinks) {
        const match = Rinks.match(/^(\d)(?:([LM])([SDTF]?))?$/);
        if (match) {
            rinks = String(parseInt(match[1], 10));
            mix = match[2] === "M" ? "X" : match[2];
            gameType = match[3] || null;
        }
    }
    switch (Type) {
        case "KLV":
        case "KL":
            duration = 3;
            eventType = "LG";
            rinks = "3";
            mix = "M";
            dress = "W";    
            break;
        case "RS":
            duration = 3;
            eventType = "LG";
            rinks = "4";    
            mix = "L";    
            dress = "W";    
            break;
        case "TV":
            duration = 3;
            eventType = "LG";
            rinks = "3";
            mix = "L";    
            dress = "W";    
            break;
        case "L":
            duration = 3;
            eventType = "HG";
            rinks = "6";
            mix = null;    
            dress = null;    
            break;
        case "F":
            duration = 3;
            eventType = "FG";    
            dress = Dress || null;    
            break;
        default:
            eventType = (rinks === null) ? "CE" : "CG";
            duration = 3;
            homeAway="H";
            mix = null;    
            dress = (rinks !== null) ? "W" : null;    
            break;
    }
    const event =  {
        eventId: uuidv4(),
        subject: Game_Event,
        status: "N",
        reqYear: year,
        reqMonth: month - 1,
        reqDate: day,
        reqJDate: getJulianDate(eventDate),
        startTime: Time,
        homeAway: homeAway,
        dress: dress || "",
        mix: mix,
        duration: duration,
        rinks: rinks,
        eventType: eventType,
        gameType: gameType,
        calKey: mapCalKey(Type),
    };
    return convertToNull(event);
}

export const importEvents = async (req: Request, res: Response): Promise<void> => {
    console.log("event.controller, importEvents");

    const file = req.file;
    if (!file) {
        res.status(400).json({ error: "No file uploaded" });
        return;
    }
    console.log("Read file");

    const filePath = file.path;
    const validationErrors: Array<{ row: number; errors: string[] }> = [];
    const rows: string[][] = [];

    try {
        // Read CSV into rows
        await new Promise<void>((resolve, reject) => {
            fs.createReadStream(filePath)
                .on("error", reject)
                .pipe(csvParser({ headers: false }))
                .on("data", (row) => rows.push(Object.values(row)))
                .on("end", resolve)
                .on("error", reject);
        });

        let currentMonth: number | null = null;
        const thisYear = new Date().getFullYear();

        // Validate all rows
        rows.forEach((cols, idx) => {
            const rowIndex = idx + 1;

            if (!cols[0]?.startsWith('DiM')) {
                if (cols[0]?.startsWith("month=")) {
                    const monthAbbr = cols[0].split("=")[1].trim();
                    currentMonth = MONTHS[monthAbbr] || null;
                    if (!currentMonth) {
                        validationErrors.push({
                            row: rowIndex,
                            errors: [`Invalid month: ${monthAbbr}`],
                        });
                    }
                } else {
                    if (!currentMonth) {
                        validationErrors.push({
                            row: rowIndex,
                            errors: ["Event row without preceding Month line"],
                        });
                    } else {
                        const error = validateImportRow(cols, currentMonth, thisYear, rowIndex);
                        if (error) validationErrors.push(error);
                    }
                }
            }
        });
        console.log("Validation erros = ", validationErrors.length);
        if (validationErrors.length > 0) {
            res.status(422).json({
                message: "Validation failed",
                errors: validationErrors,
            });
            return;
        }

        // Build events (safe since all validated)
        rows.shift();
        currentMonth = null;
        const validEvents = rows
            .map((cols) => {
                if (cols[0]?.startsWith("month=")) {
                    const monthAbbr = cols[0].split("=")[1].trim();
                    currentMonth = MONTHS[monthAbbr] || null;
                    return null;
                }
                if (currentMonth) {
                    const event = buildEvent(cols, currentMonth, thisYear);
                    return convertToNull(event);
                }
                return null;
            })
            .filter((e): e is any => e !== null);

        
        // Transaction to delete + insert atomically
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            await Event.deleteMany({}, { session });
            await Event.insertMany(validEvents, { session });
            await session.commitTransaction();
        } catch (dbErr) {
            await session.abortTransaction();
            throw dbErr;
        } finally {
            session.endSession();
        }
        fs.unlink(filePath, () => {}); // cleanup

        res.status(200).json({
            message: "Import successful",
            inserted: validEvents.length,
        });
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ error: "Import failed", details: err.message });
    }
};