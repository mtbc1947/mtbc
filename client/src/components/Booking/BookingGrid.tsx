// src/components/booking/BookingGrid.tsx
import React from "react";
import { Booking, Selection } from "../../types/bookingTypes";
import { BookingCell } from "./BookingCell";
import { SLOT_TIMES } from "../../utilities/bookingUtils";


interface BookingGridProps {
    dateStr: string;
    maxRinks: number;
    bookings: Booking[];
    selection: Selection;
    moveMode: any;
    onCellClick: (rinkIndex: number, slotIndex: number) => void;
    onStartMove: (booking: Booking) => void;
}


export function BookingGrid({ maxRinks, bookings, selection, moveMode, onCellClick, onStartMove }: BookingGridProps) {
    return (    
        <div className="overflow-auto border rounded">
            <table className="hidden md:table w-full border-collapse">
                <thead><tr><th className="border p-2">Time</th>{Array.from({ length: maxRinks }).map((_, i) => <th key={i} className="border p-2">Rink {i+1}</th>)}</tr></thead>
                <tbody>
                    {SLOT_TIMES.map((time, slotIndex) => (
                        <tr key={slotIndex}>
                            <td className="border p-2 text-sm bg-gray-50">{time}</td>
                            {Array.from({ length: maxRinks }).map((_, rinkIndex) => (
                                <BookingCell key={`${rinkIndex}_${slotIndex}`} rinkIndex={rinkIndex} slotIndex={slotIndex} bookings={bookings} selection={selection} moveMode={moveMode} onCellClick={onCellClick} onStartMove={onStartMove} />
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="md:hidden flex flex-col gap-4">
                {Array.from({ length: maxRinks }).map((_, rinkIndex) => (
                    <div key={rinkIndex} className="border rounded">
                    <div className="bg-gray-100 p-2 font-semibold">Rink {rinkIndex+1}</div>
                        {SLOT_TIMES.map((time, slotIndex) => (
                            <div key={slotIndex} className="flex items-center border-t">
                                <div className="w-20 p-2 text-sm bg-gray-50">{time}</div>
                                <div className="flex-1">
                                    <BookingCell rinkIndex={rinkIndex} slotIndex={slotIndex} bookings={bookings} selection={selection} moveMode={moveMode} onCellClick={onCellClick} onStartMove={onStartMove} />
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}