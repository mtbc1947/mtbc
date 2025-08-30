// Converts number to zero-padded 2-digit string
export function pad(n: number): string {
    return n.toString().padStart(2, "0");
}

// Build ISO date string from parts: e.g., 2025, 0, 5 => "2025-01-05"
export function buildStartDate(
    year: number,
    month: number,
    day: number
): string {
    return `${year}-${pad(month + 1)}-${pad(day)}`;
}

// Parse ISO date string (yyyy-mm-dd) to parts
export function parseStartDate(startDate: string): {
    year: number;
    month: number;
    day: number;
} {
    const [year, month, day] = startDate.split("-").map(Number);
    return { year, month: month - 1, day }; // month is 0-based
}

// Convert to Julian day-in-year (1 to 366)
export function convertDateToJulian(
    day: number,
    month: number,
    year: number
): number {
    const date = new Date(year, month - 1, day); // JS month is 0-based
    const startOfYear = new Date(year, 0, 1);
    const diff = date.getTime() - startOfYear.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;
}

// Format ISO to UK date: "dd-mm-yyyy"
export function formatDateUK(iso: string): string {
    const [y, m, d] = iso.split("-");
    return `${d}-${m}-${y}`;
}

// Format ISO to UK long date: "dd-MMM-yyyy"
export function formatDateUKLong(iso: string): string {
    const [y, m, d] = iso.split("-");
    const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ];
    return `${d}-${monthNames[parseInt(m, 10) - 1]}-${y}`;
}
