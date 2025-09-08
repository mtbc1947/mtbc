// src/components/booking/BookingCell.tsx
import React, { useMemo } from "react";
import { Booking, Selection } from "../../types/bookingTypes";
import { buildBookingsMap } from "../../utilities/bookingUtils";


interface BookingCellProps {
    rinkIndex: number;
    slotIndex: number;
    bookings: Booking[];
    selection: Selection;
    moveMode: any;
    onCellClick: (rinkIndex: number, slotIndex: number) => void;
    onStartMove: (booking: Booking) => void;
}


export function BookingCell({ rinkIndex, slotIndex, bookings, selection, onCellClick }: BookingCellProps) {
    const { map } = useMemo(() => buildBookingsMap(bookings), [bookings]);
    const key = `${rinkIndex}_${slotIndex}`;
    const booking = map[key];
    const isSelected = selection && ((selection.type === "cell" && selection.rinkIndex === rinkIndex && selection.slotIndex === slotIndex) || (selection.type === "booking" && booking && booking.id === selection.bookingId));
    const cellStyle = booking ? "bg-red-200" : "bg-green-100";
    const selectedStyle = isSelected ? "ring-2 ring-blue-500" : "";


    return (
        <td className={`border p-2 cursor-pointer text-xs ${cellStyle} ${selectedStyle}`} onClick={() => onCellClick(rinkIndex, slotIndex)}>
            {booking ? (
                <div>
                    {booking.eventType === "league" && <><div>{booking.leagueName}</div><div>{booking.home}</div><div>v</div><div>{booking.away}</div></>}
                    {booking.eventType === "competition" && <><div>{booking.competitionName}</div><div>{booking.home}</div><div>v</div><div>{booking.away}</div></>}
                    {booking.eventType === "club_event" && <div>{booking.subject}</div>}
                    {booking.eventType === "loan" && <><div>Loan</div><div>{booking.home}</div><div>v</div><div>{booking.away}</div></>}
                    {booking.eventType === "friendly" && <><div>Friendly</div><div>{booking.home}</div><div>v</div><div>{booking.away}</div></>}
                    {booking.eventType === "continuation" && <div>Continuation</div>}
                </div>
            ) : (<div className="text-gray-400">Available</div>)}
        </td>
    );
}