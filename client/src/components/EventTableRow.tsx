import React from "react";
import { EventRecord } from "../utilities/eventDataUtils";

interface Props {
  item: EventRecord;
  formattedDate: string;
  isSelected: boolean;
  onSelect: () => void;
}

const EventTableRow: React.FC<Props> = ({ item, formattedDate, isSelected, onSelect }) => (
  <>
    <td className="p-2 text-left border">{formattedDate}</td>
    <td className="p-2 text-left border">{item.startTime}</td>
    <td className="p-2 text-left border">{item.subject}</td>
    <td className="p-2 text-center border">{item.homeAway}</td>
    <td className="p-2 text-center border">{item.dress}</td>
    <td className="p-2 text-center border">{item.league}</td>
    <td className="p-2 text-center border">{item.team}</td>
  </>
);

export default EventTableRow;
