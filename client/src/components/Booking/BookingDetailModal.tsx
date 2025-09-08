// src/components/booking/BookingDetailModal.tsx
import React, { useState } from "react";
import { Booking } from "../../types/bookingTypes";


interface BookingDetailModalProps {
    mode: "new" | "edit";
    booking: Booking;
    onClose: () => void;
    onSave: (booking: Booking) => boolean;
    onDelete: () => void;
    onStartMove: () => void;
}


export function BookingDetailModal({ mode, booking, onClose, onSave, onDelete, onStartMove }: BookingDetailModalProps) {
    const [localBooking, setLocalBooking] = useState<Booking>(booking);


    function handleChange(field: keyof Booking, value: any) { setLocalBooking(prev => ({ ...prev, [field]: value })); }


    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
            <div className="bg-white p-4 rounded shadow w-96">
                <h2 className="text-lg font-semibold mb-2">{mode === "new" ? "New Booking" : "Edit Booking"}</h2>
                <div className="mb-2"><label className="block text-sm">Event Type</label>
                    <select className="border p-1 w-full" value={localBooking.eventType} onChange={e => handleChange("eventType", e.target.value)}>
                        <option value="league">League</option>
                        <option value="competition">Competition</option>
                        <option value="club_event">Club Event</option>
                        <option value="loan">Loan</option>
                        <option value="friendly">Friendly</option>
                    </select>
                </div>
                {"subject" in localBooking && <div className="mb-2"><label className="block text-sm">Subject</label><input className="border p-1 w-full" value={(localBooking as any).subject || ""} onChange={e => handleChange("subject", e.target.value)} /></div>}
                {"home" in localBooking && <div className="mb-2"><label className="block text-sm">Home</label><input className="border p-1 w-full" value={(localBooking as any).home || ""} onChange={e => handleChange("home", e.target.value)} /></div>}
                {"away" in localBooking && <div className="mb-2"><label className="block text-sm">Away</label><input className="border p-1 w-full" value={(localBooking as any).away || ""} onChange={e => handleChange("away", e.target.value)} /></div>}
                <div className="mb-2"><label className="block text-sm">Duration (slots)</label><input type="number" className="border p-1 w-full" value={localBooking.durationSlots} min={1} onChange={e => handleChange("durationSlots", parseInt(e.target.value, 10))} /></div>
                <div className="flex justify-end gap-2 mt-4">
                    <button className="btn-ghost" onClick={onClose}>Cancel</button>
                    {mode === "edit" && <button className="btn-ghost" onClick={onDelete}>Delete</button>}
                    {mode === "edit" && <button className="btn-ghost" onClick={onStartMove}>Move</button>}
                    <button className="btn" onClick={() => onSave(localBooking)}>Save</button>
                </div>
            </div>
        </div>
    );
}