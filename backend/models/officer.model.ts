import mongoose, { Schema, Document, Types } from "mongoose";
import { OfficerDocument } from "../types/officer";

const officerSchema = new Schema<OfficerDocument>(
    {
        refKey: { type: String, required: true },
        commKey: { type: String, required: true },
        order: { type: Number, required: true },
        holderId: {
            type: Schema.Types.ObjectId,
            ref: "Member",
            required: false,
        },
        position: { type: String, required: true },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Virtual to get fullName from populated holderId
officerSchema.virtual("fullName").get(function (this: OfficerDocument) {
    if (
        this.holderId &&
        typeof this.holderId === "object" &&
        "firstName" in this.holderId &&
        "lastName" in this.holderId
    ) {
        return `${this.holderId.firstName} ${this.holderId.lastName}`;
    }
    return undefined;
});

const Officer = mongoose.model<OfficerDocument>("Officer", officerSchema);

export default Officer;
