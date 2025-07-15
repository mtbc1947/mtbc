// src/components/EventRenderers.tsx
import React from "react";
import { EventRecord } from "../utilities/eventDataUtils";
import EventTableRow from "./EventTableRow";
import EventListRow from "./EventListRow";
import { formatEventDate } from "../utilities/formatUtils";

type IsSelectedFn = (item: EventRecord) => boolean;
type OnSelectFn = (item: EventRecord) => void;

export const renderEventTableRow = (
  item: EventRecord,
  index: number,
  isSelected: IsSelectedFn,
  onSelect: OnSelectFn
) => {
  const formattedDate = formatEventDate(item);

  return (
    <EventTableRow
      key={index}
      item={item}
      formattedDate={formattedDate}
      isSelected={isSelected(item)}
      onSelect={() => onSelect(item)}
    />
  );
};

export const renderEventListRow = (
  item: EventRecord,
  index: number,
  isSelected: IsSelectedFn,
  onSelect: OnSelectFn
) => {
  const formattedDate = formatEventDate(item);

  return (
    <EventListRow
      key={index}
      item={item}
      formattedDate={formattedDate}
      isSelected={isSelected(item)}
      onSelect={() => onSelect(item)}
    />
  );
};
