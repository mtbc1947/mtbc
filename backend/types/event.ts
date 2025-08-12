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
    dress: string;
    mix: string;
    duration: number;
    rinks: number;
    eventType: string;
    useType: string;
    gameType: string;
    league?: string;
    division?: string;
    team?: string;
    calKey: string;
}
