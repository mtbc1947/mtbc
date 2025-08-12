import { ColumnDescriptor } from "../../components/MaintainEntityManager";
import { MemberRecord } from "../../utilities/memberUtils";

export function getMemberColumns(): ColumnDescriptor<MemberRecord>[] {
    return [
        {
            key: "lastName",
            label: "Surname",
            align: "center",
            optional: false,
        },
        {
            key: "firstName",
            label: "First Name",
            align: "center",
            optional: false,
        },
        {
            key: "email",
            label: "Email",
            align: "center",
            optional: true,
        },
        { key: "homePhone", label: "Home", align: "left", optional: true },
        {
            key: "handPhone",
            label: "Mobile",
            align: "center",
            optional: true,
        },
    ];
}
