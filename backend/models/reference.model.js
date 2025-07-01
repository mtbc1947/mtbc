import { Schema } from "mongoose";
import mongoose from "mongoose";

const referenceSchema = new Schema(
    {
        refKey: {
            type: String,
            required: true,
            unique: true,
        },
        webPage: {
            type: String,
            required: true,
        },
        name: {
            type: String,
        },
        value: {
            type: String,
        },
    },
    { timestamps: true }
);

export default mongoose.model("Reference", referenceSchema);
