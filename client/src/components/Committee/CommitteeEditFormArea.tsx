import React from "react";
import { CommitteeRecord } from "../../utilities/committeeUtils";

interface CommitteeEditFormAreaProps {
    item: CommitteeRecord;
    setItem: (item: CommitteeRecord) => void;
    isNew: boolean;
}

const CommitteeEditFormArea: React.FC<CommitteeEditFormAreaProps> = ({
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
                {isNew ? "Create Committee" : "Edit Committee"}
            </h2>

            {/* CommKey*/}
            <div className="flex flex-col md:flex-row gap-4">
                <label className="flex flex-col flex-1">
                    Comm Key:
                    <input
                        type="text"
                        name="commKey"
                        value={item.commKey}
                        onChange={handleChange}
                        className="border border-gray-300 rounded px-2 py-1"
                    />
                </label>
            </div>

            {/* Name */}
            <label className="flex flex-col">
                Name:
                <input
                    type="text"
                    name="name"
                    value={item.name}
                    onChange={handleChange}
                    className="border border-gray-300 rounded px-2 py-1"
                />
            </label>

            {/* Order` */}
            <div className="flex flex-col md:flex-row gap-4">
                <label className="flex flex-col flex-1">
                    Order:
                    <input
                        type="number"
                        name="order"
                        value={item.order}
                        onChange={handleChange}
                        className="border border-gray-300 rounded px-2 py-1"
                    />
                </label>
            </div>
        </form>
    );
};

export default CommitteeEditFormArea;
