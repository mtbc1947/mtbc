// models/member.model.ts
import mongoose, { Schema, Document } from "mongoose";
import { MemberDocument } from "../types/member.js";

const memberSchema = new Schema<MemberDocument>(
    {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true },
        homePhone: { type: String },
        handPhone: { type: String },
    },
    { timestamps: true }
);

const Member = mongoose.model<MemberDocument>("Member", memberSchema);

export default Member;
