import { Document } from "mongoose";

export interface MemberDocument extends Document {
    firstName: string;
    lastName: string;
    email: string;
    homePhone?: string;
    handPhone?: string;
}
