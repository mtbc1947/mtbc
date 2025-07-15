import React, { useState, useEffect } from "react";
import { EventRecord } from "../utilities/eventDataUtils";
import AreaAFields from "./AreaAFields";
import AreaBFields from "./AreaBFields";

interface EditFormAreaProps {
  item: EventRecord;
  setItem: (item: EventRecord) => void;
}

const EditFormArea: React.FC<EditFormAreaProps> = ({ item, setItem }) => {
  const [showAreaB, setShowAreaB] = useState<boolean>(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "date") {
      // Convert "YYYY-MM-DD" to reqYear, reqMonth, reqDate
      const [year, month, day] = value.split("-").map(Number);
      setItem({
        ...item,
        reqYear: year,
        reqMonth: month - 1, // 0-based month
        reqDate: day,
      });
    } else {
      setItem({
        ...item,
        [name]: value,
      });
    }
  };

  return (
    <form id="edit-form" className="bg-white shadow-md rounded p-4 my-4 space-y-4">
      <h2 className="text-xl font-semibold">Edit Event</h2>

      <AreaAFields editedEvent={item} onChange={handleChange} />

      <button
        type="button"
        onClick={() => setShowAreaB((prev) => !prev)}
        className="text-blue-600 underline"
      >
        {showAreaB ? "Hide More Fields" : "Show More Fields"}
      </button>

      <AreaBFields
        editedEvent={item}
        onChange={handleChange}
        isVisible={showAreaB}
      />
    </form>
  );
};

export default EditFormArea;
