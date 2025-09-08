// utilities/eventUtils.ts

import { formatEventDate } from "./formatUtils";

export interface ValidationError {
    row: number;
    errors: string[];
}

export interface EventRecord {
    eventId: string;
    subject: string;
    status: string;
    startDate: string;
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
    league: string;
    division: string;
    team: string;
    calKey: string;
}

function pad(n: number): string {
    return n.toString().padStart(2, "0");
}

function buildStartDate(year: number, month: number, day: number): string {
    return `${year}-${pad(month + 1)}-${pad(day)}`; // JS months are 0-based
}

export const getAllEventData = async (): Promise<EventRecord[]> => {
    const baseUrl = `${import.meta.env.VITE_BACKEND_URL}/event/`;
    let allEvents: EventRecord[] = [];
    let page = 1;
    let hasMore = true;

    try {
        while (hasMore) {
            const res = await fetch(`${baseUrl}?page=${page}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });

            if (!res.ok) break;

            const data = (await res.json()) as EventRecord[];

            if (data.length === 0) break;

            allEvents = [...allEvents, ...data];
            page++;

            hasMore = data.length === 100;
        }
        // Enrich each record with a computed startDate field
        allEvents.forEach((item) => {
            item.startDate = buildStartDate(
                item.reqYear,
                item.reqMonth,
                item.reqDate
            );
        });
        // Sort by reqJDate ascending
        allEvents.sort((a, b) => a.reqJDate - b.reqJDate);
        return allEvents;
    } catch (err) {
        throw new Error(`getAllEventData error: ${err}`);
    }
};

export const createEvent = async (event: EventRecord): Promise<EventRecord> => {
    const url = `${import.meta.env.VITE_BACKEND_URL}/event`;
    console.log("util/createEvent");
    console.log(event);

    try {
        const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(event),
        });

        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`Failed to create event: ${errorText}`);
        }

        return await res.json();
    } catch (err) {
        throw new Error(`createEvent error: ${err}`);
    }
};

export const updateEvent = async (event: EventRecord): Promise<EventRecord> => {
    const url = `${import.meta.env.VITE_BACKEND_URL}/event/${event.eventId}`;
    console.log("util/updateEvent");
    console.log(event);

    try {
        const res = await fetch(url, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(event),
        });

        if (!res.ok) {
            const errorText = await res.text();
            console.log(`Failed to update event: ${errorText}`);
            throw new Error(`Failed to update event: ${errorText}`);
        }

        return await res.json();
    } catch (err) {
        throw new Error(`updateEvent error: ${err}`);
    }
};

export async function importEvents(file: File): Promise<{ inserted: number }> {
    console.log("util/importEvents");
    console.log(file);

    const url = `${import.meta.env.VITE_BACKEND_URL}/event/import`;

    const formData = new FormData();
    formData.append("file", file);

    let response: Response;
    let data: any;

    try {
        response = await fetch(url, {
            method: "POST",
            body: formData,
        });
        data = await response.json();
    } catch (err) {
        console.error("Network or JSON parsing error", err);
        throw new Error("Failed to communicate with server");
    }

    if (!response.ok) {
        const error = new Error(data?.message || "Import failed");
        (error as any).validationErrors = data?.errors ?? [];
        throw error;
    }

    return { inserted: data.inserted ?? 0 };
}
