import mongoose, { Schema } from "mongoose";
import { EventDocument } from "../types/event.js";

const eventSchema = new Schema<EventDocument>(
    {
        eventId: { type: String, required: true, unique: true },
        subject: { type: String, required: true },
        status: { type: String, required: true },
        reqYear: { type: Number, required: true },
        reqMonth: { type: Number, required: true },
        reqDate: { type: Number, required: true },
        reqJDate: { type: Number, required: true },
        startTime: { type: String, required: true },
        severity: { type: String, required: true },
        homeAway: { type: String, required: true },
        dress: { type: String, required: true },
        mix: { type: String, required: true },
        duration: { type: Number, required: true },
        rinks: { type: Number, required: true },
        eventType: { type: String, required: true },
        useType: { type: String, required: true },
        gameType: { type: String, required: true },
        league: { type: String, required: false },
        division: { type: String, required: false },
        team: { type: String, required: false },
        calKey: { type: String, required: true },
    },
    { timestamps: true }
);

const Event = mongoose.model<EventDocument>("Event", eventSchema);

export default Event;
