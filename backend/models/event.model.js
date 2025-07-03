import { Schema } from "mongoose";
import mongoose from "mongoose";

const eventSchema = new Schema(
    {
        eventId: {
            type: String,
            required: true,
            unique: true,
        },
        subject: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            required: true,
        },
        reqYear: {
            type: Number,
            required: true,
        },
        reqMonth: {
            type: Number,
            required: true,
        },
        reqDate: {
            type: Number,
            required: true,
        },
        reqJDate: {
            type: Number,
            required: true,
        },
        startTime: {
            type: String,
            required: true,
        },
        severity: {
            type: String,
            required: true,
        },
        homeAway: {
            type: String,
            required: true,
        },
        dress: {
            type: String,
            required: true,
        },
        mix: {
            type: String,
            required: true,
        },
        duration: {
            type: Number,
            required: true,
        },
        rinks: {
            type: Number,
            required: true,
        },
        eventType: {
            type: String,
            required: true,
        },
        useType: {
            type: String,
            required: true,
        },
        gameType: {
            type: String,
            required: true,
        },
        league: {
            type: String,
            required: true,
        },
        division: {
            type: String,
            required: true,
        },
        team: {
            type: String,
            required: true,
        },
        calKey: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

export default mongoose.model("Event", eventSchema);
