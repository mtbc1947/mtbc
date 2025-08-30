import { OfficerRecord } from "../../utilities/officerUtils";
import type { ColumnDescriptor } from "../MaintainEntityManager";

export function getOfficerColumns(): ColumnDescriptor<OfficerRecord>[] {
    return [
        {
            key: "refKey",
            label: "Ref Key",
            align: "center",
        },
        {
            key: "commKey",
            label: "Committee",
            align: "center",
        },
        {
            key: "order",
            label: "Order",
            align: "center",
        },
        {
            key: "position",
            label: "Position",
            align: "left",
        },
        {
            key: "fullName",
            label: "Member",
            align: "center",
            render: (value: any, officer: OfficerRecord) => {
                const h = officer?.holderId;
                if (typeof h === "object" && h !== null) {
                    return `${h.firstName} ${h.lastName}`;
                } else if (typeof h === "string" && h.length > 0) {
                    return h;
                } else {
                    return "vacant";
                }
            },
            optional: true,
        },
    ];
}
