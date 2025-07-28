import React from "react";
import { EventRecord } from "../../utilities/eventUtils";

interface AreaAFieldsProps {
  editedEvent: EventRecord;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}
//        value={getDateString("S", editedEvent.reqYear, editedEvent.reqMonth, editedEvent.reqDate)}

const getDateString = (style: string, year?: number, month?: number, day?: number): string => {
  const months = ["Jan","Feb", "Mar", "Apr","May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
  if (year && month != null && day) {
    let mm = String(month + 1).padStart(2, "0");
    if (style === "S`") {
      mm = months[month];
    }
    const dd = String(day).padStart(2, "0");
    return `${dd}/${mm}`;
  }
  return "";
};

const AreaAFields: React.FC<AreaAFieldsProps> = ({ editedEvent, onChange }) => (
  <div className="grid grid-cols-2 gap-4">
    <label className="flex flex-col">
      Date:
      <input
        type="date"
        name="date"
        value={editedEvent.startDate ?? ""}
        onChange={onChange}
        className="border border-gray-300 rounded px-2 py-1"
      />
    </label>
    <label className="flex flex-col">
      Time:
      <input
        type="text"
        name="startTime"
        value={editedEvent.startTime}
        onChange={onChange}
        className="border border-gray-300 rounded px-2 py-1"
      />
    </label>
    <label className="flex flex-col col-span-2">
      Subject:
      <input
        type="text"
        name="subject"
        value={editedEvent.subject}
        onChange={onChange}
        className="border border-gray-300 rounded px-2 py-1"
      />
    </label>

    <label className="flex flex-col">
      Team:
      <input
        type="text"
        name="team"
        value={editedEvent.team}
        onChange={onChange}
        className="border border-gray-300 rounded px-2 py-1"
      />
    </label>
    <label className="flex flex-col">
      Division:
      <input
        type="text"
        name="division"
        value={editedEvent.division}
        onChange={onChange}
        className="border border-gray-300 rounded px-2 py-1"
      />
    </label>
    <label className="flex flex-col">
      League:
      <input
        type="text"
        name="league"
        value={editedEvent.league}
        onChange={onChange}
        className="border border-gray-300 rounded px-2 py-1"
      />
    </label>
    <label className="flex flex-col">
      Event Type:
      <input
        type="text"
        name="eventType"
        value={editedEvent.eventType}
        onChange={onChange}
        className="border border-gray-300 rounded px-2 py-1"
      />
    </label>
    <label className="flex flex-col">
      Game Type:
      <input
        type="text"
        name="gameType"
        value={editedEvent.gameType}
        onChange={onChange}
        className="border border-gray-300 rounded px-2 py-1"
      />
    </label>
  </div>
);

export default AreaAFields;
