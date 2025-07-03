// utilities/eventDataUtils.ts

export interface EventRecord {
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
    league: string;
    division: string;
    team: string;
    calKey: string;
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

            // Stop if fewer than 100 records returned (last page)
            hasMore = data.length === 100;
        }

        return allEvents;
    } catch (err) {
        throw new Error(`getAllEventData error: ${err}`);
    }
};

export const updateEventData = async (
    updatedRecords: EventRecord[]
): Promise<void> => {
    const url = `${import.meta.env.VITE_BACKEND_URL}/event/updateMany`;

    try {
        const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedRecords),
        });

        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`Failed to update event data: ${errorText}`);
        }
    } catch (err) {
        throw new Error(`updateEventData error: ${err}`);
    }
};
