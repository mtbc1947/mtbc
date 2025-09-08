// src/utilities/bookingUtils.ts
import { Booking, EventType } from "../types/bookingTypes";


export const SLOT_TIMES = ["10:00","11:30","14:00","15:30","18:00"];
export const DEFAULT_RINKS = 6;
export const EVENT_TYPES: Record<string, EventType> = {
    LEAGUE: "league",
    COMPETITION: "competition",
    CLUB_EVENT: "club_event",
    LOAN: "loan",
    FRIENDLY: "friendly",
    CONTINUATION: "continuation",
};


export function toDateStr(date: Date): string { return date.toISOString().split("T")[0]; }
export function makeId(prefix: string): string { return prefix + Math.random().toString(36).substring(2, 9); }


export function buildBookingsMap(bookings: Booking[]): { map: Record<string, Booking | undefined> } {
    const map: Record<string, Booking | undefined> = {};
    bookings.forEach(b => { map[`${b.rinkIndex}_${b.slotIndex}`] = b; });
    return { map };
}


export function canFitBlock(map: Record<string, Booking | undefined>, rinkIndex: number, slotIndex: number, duration: number): boolean {
    for (let i=0; i<duration; i++) { if(map[`${rinkIndex}_${slotIndex+i}`]) return false; }
    return true;
}


export function MOCK_BOOKINGS_FOR_DAY(date: string): Booking[] { return []; }