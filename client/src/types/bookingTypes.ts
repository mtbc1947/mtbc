// src/types/bookingTypes.ts
export type EventType = "league" | "competition" | "club_event" | "loan" | "friendly" | "continuation";


export interface BaseBooking {
    id: string;
    groupId: string;
    headId?: string;
    date: string; // yyyy-mm-dd
    rinkIndex: number;
    slotIndex: number;
    durationSlots: number;
    eventType: EventType;
}


export interface LeagueBooking extends BaseBooking {
    eventType: "league";
    leagueName: string;
    home: string;
    away: string;
}


export interface CompetitionBooking extends BaseBooking {
    eventType: "competition";
    competitionName: string;
    home: string;
    away: string;
}


export interface ClubEventBooking extends BaseBooking {
    eventType: "club_event";
    subject: string;
}


export interface LoanBooking extends BaseBooking {
    eventType: "loan";
    home: string;
    away: string;
}


export interface FriendlyBooking extends BaseBooking {
    eventType: "friendly";
    home: string;
    away: string;
}


export interface ContinuationBooking extends BaseBooking {
    eventType: "continuation";
    subject: "Continuation";
}


export type Booking =
| LeagueBooking
| CompetitionBooking
| ClubEventBooking
| LoanBooking
| FriendlyBooking
| ContinuationBooking;


export type CellSelection = {
    type: "cell";
    rinkIndex: number;
    slotIndex: number;
    tentativeMove?: boolean;
};


export type BookingSelection = {
    type: "booking";
    bookingId: string;
};


export type Selection = CellSelection | BookingSelection | null;