import { Document } from "mongoose";

export interface CommitteeDocument extends Document {
    commKey: string;
    name: string;
    order: number;
    description?: string;
    // add other fields here as needed
}
