import { ColumnDescriptor } from "../../components/MaintainEntityManager";
import { EventRecord } from "../../utilities/eventUtils";

import { formatDateUKLong } from "utilities/dateHelpers";

export function getEventColumns(): ColumnDescriptor<EventRecord>[] {
    return [
        {
            key: "startDate",
            label: "Date",
            align: "center",
            optional: false,
            render: (val) => formatDateUKLong(val),
        },
        {
            key: "startTime",
            label: "Time",
            align: "center",
            optional: false,
        },
        { key: "subject", label: "Subject", align: "left", optional: false },
        {
            key: "homeAway",
            label: "Venue",
            align: "center",
            render: (_, item) => (item.homeAway === "H`" ? "Home" : "Away"),
            optional: false,
        },
        {
            key: "dress",
            label: "Dress",
            align: "center",
            optional: true,
        },
        {
            key: "league",
            label: "League",
            align: "center",
            optional: true,
        },
        {
            key: "team",
            label: "Team",
            align: "center",
            optional: true,
        },
    ];
}
