// utilities/memberUtils.ts

export interface CommitteeRecord {
    _id?: string;
    commKey: string;
    name: string;
    order: number;
}

function pad(n: number): string {
    return n.toString().padStart(2, "0");
}

export const getAllCommitteeData = async (): Promise<CommitteeRecord[]> => {
    const baseUrl = `${import.meta.env.VITE_BACKEND_URL}/committee/`;
    let allCommittees: CommitteeRecord[] = [];
    let page = 1;
    let hasMore = true;

    try {
        while (hasMore) {
            const res = await fetch(`${baseUrl}?page=${page}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });

            if (!res.ok) break;

            const data = (await res.json()) as CommitteeRecord[];

            if (data.length === 0) break;

            allCommittees = [...allCommittees, ...data];
            page++;

            hasMore = data.length === 100;
        }

        return allCommittees;
    } catch (err) {
        throw new Error(`getAllCommitteesData error: ${err}`);
    }
};

export const createCommittee = async (
    committee: CommitteeRecord
): Promise<CommitteeRecord> => {
    const url = `${import.meta.env.VITE_BACKEND_URL}/committee`;
    console.log("util/createCommittee");
    console.log(committee);

    try {
        const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(committee),
        });

        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`Failed to create Committee: ${errorText}`);
        }

        return await res.json();
    } catch (err) {
        throw new Error(`createv error: ${err}`);
    }
};

export const updateCommittee = async (
    committee: CommitteeRecord
): Promise<CommitteeRecord> => {
    const url = `${import.meta.env.VITE_BACKEND_URL}/committee/${
        committee.commKey
    }`;
    console.log("util/updateCommittee");
    console.log(committee);

    try {
        const res = await fetch(url, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(committee),
        });

        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`Failed to update Committee: ${errorText}`);
        }

        return await res.json();
    } catch (err) {
        throw new Error(`updateCommittee error: ${err}`);
    }
};

/**
 * Deletes a committee record by its commKey.
 */
export const deleteCommittee = async (commKey: string): Promise<void> => {
    console.log(commKey);
    if (!commKey) throw new Error("CommKey is required for deletion.");

    const url = `${import.meta.env.VITE_BACKEND_URL}/committee/${commKey}`;

    try {
        const res = await fetch(url, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`Failed to delete Committee: ${errorText}`);
        }
    } catch (err) {
        throw new Error(`deleteCommittee error: ${err}`);
    }
};
