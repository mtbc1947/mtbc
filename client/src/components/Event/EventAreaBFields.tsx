// AreaBFields.tsx
import React from "react";
import { EventRecord } from "../../utilities/eventUtils";

interface AreaBFieldsProps {
  editedEvent: EventRecord;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  isVisible: boolean;
}

const AreaBFields: React.FC<AreaBFieldsProps> = ({ editedEvent, onChange, isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="grid grid-cols-2 gap-4 mt-4">
      <label className="flex flex-col">
        Use Type:
        <input
          type="text"
          name="useType"
          value={editedEvent.useType}
          onChange={onChange}
          className="border border-gray-300 rounded px-2 py-1"
        />
      </label>
      <label className="flex flex-col">
        Rinks:
        <input
          type="number"
          name="rinks"
          value={editedEvent.rinks}
          onChange={onChange}
          className="border border-gray-300 rounded px-2 py-1"
        />
      </label>
      <label className="flex flex-col">
        Duration:
        <input
          type="text"
          name="duration"
          value={editedEvent.duration}
          onChange={onChange}
          className="border border-gray-300 rounded px-2 py-1"
        />
      </label>
      <label className="flex flex-col">
        Mix:
        <input
          type="text"
          name="mix"
          value={editedEvent.mix}
          onChange={onChange}
          className="border border-gray-300 rounded px-2 py-1"
        />
      </label>
      <label className="flex flex-col">
        Dress:
        <input
          type="text"
          name="dress"
          value={editedEvent.dress}
          onChange={onChange}
          className="border border-gray-300 rounded px-2 py-1"
        />
      </label>
      <label className="flex flex-col">
        Home/Away:
        <input
          type="text"
          name="homeAway"
          value={editedEvent.homeAway}
          onChange={onChange}
          className="border border-gray-300 rounded px-2 py-1"
        />
      </label>
      <label className="flex flex-col">
        Severity:
        <input
          type="text"
          name="severity"
          value={editedEvent.severity}
          onChange={onChange}
          className="border border-gray-300 rounded px-2 py-1"
        />
      </label>
      <label className="flex flex-col">
        Status:
        <input
          type="text"
          name="status"
          value={editedEvent.status}
          onChange={onChange}
          className="border border-gray-300 rounded px-2 py-1"
        />
      </label>
      <label className="flex flex-col col-span-2">
        Calendar Key:
        <input
          type="text"
          name="calKey"
          value={editedEvent.calKey}
          onChange={onChange}
          className="border border-gray-300 rounded px-2 py-1"
        />
      </label>
    </div>
  );
};

export default AreaBFields;
