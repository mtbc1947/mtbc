// utilities/memberUtils.ts

export interface MemberRecord {
    _id?: string;
    lastName: string;
    firstName: string;
    email?: string;
    homePhone?: string;
    handPhone?: string;
}

function pad(n: number): string {
    return n.toString().padStart(2, "0");
}

export const getAllMemberData = async (): Promise<MemberRecord[]> => {
    const baseUrl = `${import.meta.env.VITE_BACKEND_URL}/member/`;
    let allMembers: MemberRecord[] = [];
    let page = 1;
    let hasMore = true;

    try {
        while (hasMore) {
            const res = await fetch(`${baseUrl}?page=${page}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });

            if (!res.ok) break;

            const data = (await res.json()) as MemberRecord[];

            if (data.length === 0) break;

            allMembers = [...allMembers, ...data];
            page++;

            hasMore = data.length === 100;
        }

        return allMembers;
    } catch (err) {
        throw new Error(`getAllMembersData error: ${err}`);
    }
};

export const createMember = async (
    member: MemberRecord
): Promise<MemberRecord> => {
    const url = `${import.meta.env.VITE_BACKEND_URL}/member`;
    console.log("util/createMember");

    try {
        const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(member),
        });

        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`Failed to create member: ${errorText}`);
        }

        return await res.json();
    } catch (err) {
        throw new Error(`createMember error: ${err}`);
    }
};

export const updateMember = async (
    member: MemberRecord
): Promise<MemberRecord> => {
    const url = `${import.meta.env.VITE_BACKEND_URL}/member/${member._id}`;
    console.log("util/updateMember");

    try {
        const res = await fetch(url, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(member),
        });

        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`Failed to update member: ${errorText}`);
        }

        return await res.json();
    } catch (err) {
        throw new Error(`updateMember error: ${err}`);
    }
};

export const deleteMember = async (member: MemberRecord): Promise<void> => {
    console.log("utility deleteMember");
    if (!member._id) throw new Error("member._id is required for deletion.");

    const url = `${import.meta.env.VITE_BACKEND_URL}/member/${member._id}`;

    try {
        const res = await fetch(url, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`Failed to delete Member: ${errorText}`);
        }
    } catch (err) {
        throw new Error(`deleteMember error: ${err}`);
    }
};
