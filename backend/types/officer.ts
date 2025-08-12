import { Document, Types } from "mongoose";
import { MemberDocument } from "./member"; // import Member interface if you have it

export interface OfficerAttrs {
    refKey: string;
    commKey: string;
    order: number;
    holderId?: Types.ObjectId;
    position: string;
}

export interface OfficerDocument extends OfficerAttrs, Document {
    createdAt?: Date;
    updatedAt?: Date;

    // Populated member (optional)
    holder?: MemberDocument;

    // Virtual field
    fullName?: string;
}
