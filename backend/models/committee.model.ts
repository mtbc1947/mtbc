import mongoose, { Schema } from "mongoose";
import { CommitteeDocument } from "../types/committee.js";

const committeeSchema = new Schema<CommitteeDocument>(
    {
        commKey: { type: String, required: true, unique: true },
        name: { type: String, required: true },
        order: { type: Number, required: true },
        description: { type: String },
        // other fields if any
    },
    { timestamps: true }
);

const Committee = mongoose.model<CommitteeDocument>(
    "Committee",
    committeeSchema
);

export default Committee;
