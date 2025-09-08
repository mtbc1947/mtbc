import { Document } from "mongoose";

export interface EventDocument extends Document {
    eventId: string;
    subject: string;
    status: string;
    reqYear: number;
    reqMonth: number;
    reqDate: number;
    reqJDate: number;
    startTime: string;
    severity: string;
    homeAway: string;
    dress?: string | null;
    mix?: string | null;
    duration: number;
    rinks?: string | null;
    eventType: string;
    useType?: string | null;
    gameType?: string | null;
    league?: string | null;
    division?: string | null;
    team?: string | null;
    calKey: string;
}
