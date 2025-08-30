// src/utilities/formatUtils.ts
import { EventRecord } from "./eventUtils";

export function formatEventDate(event: EventRecord): string {
    const year = String(event.reqYear);
    const month = String(event.reqMonth);
    const date = String(event.reqDate);

    if (!year || !month || !date) return "Invalid Date";

    const paddedMonth = month.padStart(2, "0");
    const paddedDate = date.padStart(2, "0");

    const isoString = `${year}/${paddedMonth}/${paddedDate}`;
    const parsedDate = new Date(isoString);

    if (isNaN(parsedDate.getTime())) return "Invalid Date";

    return parsedDate.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
    });
}
