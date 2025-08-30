import { ColumnDescriptor } from "../MaintainEntityManager";
import { CommitteeRecord } from "../../utilities/committeeUtils";

export function getCommitteeColumns(): ColumnDescriptor<CommitteeRecord>[] {
    return [
        {
            key: "commKey",
            label: "Key",
            align: "center",
            optional: false,
        },
        {
            key: "order",
            label: "Order",
            align: "center",
            optional: false,
        },
        {
            key: "name",
            label: "Name",
            align: "center",
            optional: true,
        },
    ];
}
