// utilities/officerUtils.ts

import { MemberRecord } from "./memberUtils";

export interface OfficerRecord {
    _id?: string;
    refKey: string;
    commKey: string;
    order: number;
    holderId: string | MemberRecord;
    position: string;
    fullName?: string;
}

function pad(n: number): string {
    return n.toString().padStart(2, "0");
}

export const getAllOfficerData = async (): Promise<OfficerRecord[]> => {
    const baseUrl = `${import.meta.env.VITE_BACKEND_URL}/officer/`;
    let allOfficers: OfficerRecord[] = [];
    let page = 1;
    let hasMore = true;

    try {
        while (hasMore) {
            const res = await fetch(`${baseUrl}?page=${page}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });

            if (!res.ok) break;

            const data = (await res.json()) as OfficerRecord[];

            if (data.length === 0) break;

            allOfficers = [...allOfficers, ...data];
            page++;

            hasMore = data.length === 100;
        }

        return allOfficers;
    } catch (err) {
        throw new Error(`getAllOfficerData error: ${err}`);
    }
};

export const createOfficer = async (
    officer: OfficerRecord
): Promise<OfficerRecord> => {
    const url = `${import.meta.env.VITE_BACKEND_URL}/officer`;
    console.log("util/createOfficer");
    console.log(officer);

    try {
        const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(officer),
        });

        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`Failed to create Officer: ${errorText}`);
        }

        return await res.json();
    } catch (err) {
        throw new Error(`createv error: ${err}`);
    }
};

export const updateOfficer = async (
    officer: OfficerRecord
): Promise<OfficerRecord> => {
    const url = `${import.meta.env.VITE_BACKEND_URL}/officer/${officer._id}`;
    console.log("util/updateOfficer");

    try {
        const res = await fetch(url, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(officer),
        });

        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`Failed to update Officer: ${errorText}`);
        }

        return await res.json();
    } catch (err) {
        throw new Error(`updateOfficer error: ${err}`);
    }
};

export const deleteOfficer = async (officer: OfficerRecord): Promise<void> => {
    console.log("utility deleteOfficer");
    console.log(officer._id);
    if (!officer._id) throw new Error("officer._id is required for deletion.");

    const url = `${import.meta.env.VITE_BACKEND_URL}/officer/${officer._id}`;

    try {
        const res = await fetch(url, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`Failed to delete Officer: ${errorText}`);
        }
    } catch (err) {
        throw new Error(`deleteOfficer error: ${err}`);
    }
};
