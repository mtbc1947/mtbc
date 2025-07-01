// utilities/referenceDataUtils.ts

export interface ReferenceRecord {
    webPage: string;
    refKey: string;
    name: string;
    value: string;
}

/**
 * Fetches all reference records from the backend.
 */
export const getAllReferenceData = async (): Promise<ReferenceRecord[]> => {
    const url = `${import.meta.env.VITE_BACKEND_URL}/reference/`;

    try {
        const res = await fetch(url, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });

        const data = await res.json();
        return res.ok ? (data as ReferenceRecord[]) : [];
    } catch (err) {
        throw new Error(`getAllReferenceData error: ${err}`);
    }
};

/**
 * Fetches only the `value` fields from reference records for a given web page.
 */
export const getReferenceValuesByPage = async (
    webPage: string
): Promise<string[]> => {
    if (!webPage) throw new Error("webPage parameter is required.");

    const url = `${
        import.meta.env.VITE_BACKEND_URL
    }/reference/webPage/${webPage}`;

    try {
        const res = await fetch(url, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });

        const data = await res.json();
        return res.ok
            ? (data as ReferenceRecord[]).map((item) => item.value)
            : [];
    } catch (err) {
        throw new Error(`getReferenceValuesByPage error: ${err}`);
    }
};

export const updateReferenceData = async (
    updatedRecords: ReferenceRecord[]
): Promise<void> => {
    const url = `${import.meta.env.VITE_BACKEND_URL}/reference/updateMany`;

    try {
        const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedRecords),
        });

        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`Failed to update reference data: ${errorText}`);
        }
    } catch (err) {
        throw new Error(`updateReferenceData error: ${err}`);
    }
};
