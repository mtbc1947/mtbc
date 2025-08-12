import React from "react";
import { MemberRecord } from "../../utilities/memberUtils";

interface MemberEditFormAreaProps {
    item: MemberRecord;
    setItem: (item: MemberRecord) => void;
    isNew: boolean;
}

const MemberEditFormArea: React.FC<MemberEditFormAreaProps> = ({
    item,
    setItem,
    isNew,
}) => {
    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
    ) => {
        const { name, value } = e.target;
        setItem({
            ...item,
            [name]: value,
        });
    };

    return (
        <form
            id="edit-form"
            className="bg-white shadow-md rounded p-4 my-4 space-y-4"
            onSubmit={(e) => e.preventDefault()}
        >
            <h2 className="text-xl font-semibold">
                {isNew ? "Create Member" : "Edit Member"}
            </h2>

            {/* Last Name and First Name */}
            <div className="flex flex-col md:flex-row gap-4">
                <label className="flex flex-col flex-1">
                    Last Name:
                    <input
                        type="text"
                        name="lastName"
                        value={item.lastName}
                        onChange={handleChange}
                        className="border border-gray-300 rounded px-2 py-1"
                    />
                </label>

                <label className="flex flex-col flex-1">
                    First Name:
                    <input
                        type="text"
                        name="firstName"
                        value={item.firstName}
                        onChange={handleChange}
                        className="border border-gray-300 rounded px-2 py-1"
                    />
                </label>
            </div>

            {/* Email */}
            <label className="flex flex-col">
                Email:
                <input
                    type="text"
                    name="email"
                    value={item.email}
                    onChange={handleChange}
                    className="border border-gray-300 rounded px-2 py-1"
                />
            </label>

            {/* Home Phone and Hand Phone */}
            <div className="flex flex-col md:flex-row gap-4">
                <label className="flex flex-col flex-1">
                    Home Phone:
                    <input
                        type="text"
                        name="homePhone"
                        value={item.homePhone}
                        onChange={handleChange}
                        className="border border-gray-300 rounded px-2 py-1"
                    />
                </label>

                <label className="flex flex-col flex-1">
                    Hand Phone:
                    <input
                        type="text"
                        name="handPhone"
                        value={item.handPhone}
                        onChange={handleChange}
                        className="border border-gray-300 rounded px-2 py-1"
                    />
                </label>
            </div>
        </form>
    );
};

export default MemberEditFormArea;
