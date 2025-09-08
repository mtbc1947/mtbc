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
        homeAway: { type: String, required: true },
        dress: { type: String, required: false },
        mix: { type: String, required: false },
        duration: { type: Number, required: true },
        rinks: { type: String, required: false },
        eventType: { type: String, required: true },
        calKey: { type: String, required: true },
    },
    { timestamps: true }
);

const Event = mongoose.model<EventDocument>("Event", eventSchema);

export default Event;
