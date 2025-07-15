import React from "react";
import { EventRecord } from "../utilities/eventDataUtils";

interface Props {
  item: EventRecord;
  formattedDate: string;
  isSelected: boolean;
  onSelect: () => void;
}
const EventListRow: React.FC<Props> = ({ item, formattedDate, isSelected, onSelect }) => (
  <div className="border rounded p-3 my-2 bg-white shadow">
    <div className="flex justify-between">
        <div className="font-semibold">{item.subject}</div>
        <input type="checkbox" checked={isSelected} onChange={onSelect} />
    </div>
    <div className="text-sm text-gray-600">
        <div>{formattedDate} at {item.startTime}</div>
        <div>Venue: {item.homeAway}</div>
        <div>Dress: {item.dress}</div>
        <div>League: {item.league}</div>
        <div>Team: {item.team}</div>
    </div>
  </div>
);

export default EventListRow;
