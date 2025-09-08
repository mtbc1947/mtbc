// src/pages/BookingPage.tsx
import React, { useMemo, useState } from "react";
import { Booking, Selection } from "../types/bookingTypes";
import { BookingGrid } from "../components/Booking/BookingGrid";
import { BookingDetailModal } from "../components/Booking/BookingDetailModal";
import {
  buildBookingsMap,
  canFitBlock,
  MOCK_BOOKINGS_FOR_DAY,
  toDateStr,
  makeId,
  EVENT_TYPES,
  DEFAULT_RINKS
} from "../utilities/bookingUtils";

interface BookingPageProps {
  initialDate?: Date;
  maxRinks?: number;
}

const BookingPage: React.FC<BookingPageProps> = ({ initialDate = new Date(), maxRinks = DEFAULT_RINKS }) => {
  const [date, setDate] = useState<Date>(initialDate);
  const dateStr = useMemo(() => toDateStr(date), [date]);
  const [bookings, setBookings] = useState<Booking[]>(() => MOCK_BOOKINGS_FOR_DAY(dateStr));
  const { map: bookingsMap } = useMemo(() => buildBookingsMap(bookings), [bookings]);

  const [selection, setSelection] = useState<Selection>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailMode, setDetailMode] = useState<"new" | "edit" | null>(null);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [moveMode, setMoveMode] = useState<{ active: boolean; bookingToMove: Booking | null }>({ active: false, bookingToMove: null });

  function prevDay() {
    const d = new Date(date);
    d.setDate(d.getDate() - 1);
    setDate(d);
    setBookings(MOCK_BOOKINGS_FOR_DAY(toDateStr(d)));
    setSelection(null);
    setMoveMode({ active: false, bookingToMove: null });
  }

  function nextDay() {
    const d = new Date(date);
    d.setDate(d.getDate() + 1);
    setDate(d);
    setBookings(MOCK_BOOKINGS_FOR_DAY(toDateStr(d)));
    setSelection(null);
    setMoveMode({ active: false, bookingToMove: null });
  }

  function onCellClick(rinkIndex: number, slotIndex: number) {
    const key = `${rinkIndex}_${slotIndex}`;
    const cellBooking = bookingsMap[key];

    if (moveMode.active && moveMode.bookingToMove) {
      const bookingHead = moveMode.bookingToMove;
      const duration = bookingHead.durationSlots;
      const fits = canFitBlock(bookingsMap, rinkIndex, slotIndex, duration);
      if (!fits) {
        alert("Insufficient consecutive free slots for this move.");
        return;
      }
      setSelection({ type: "cell", rinkIndex, slotIndex, tentativeMove: true });
      return;
    }

    if (cellBooking) {
      const head = cellBooking.headId ? bookings.find(b => b.id === cellBooking.headId)! : cellBooking;
      setSelection({ type: "booking", bookingId: head.id });
      setDetailMode("edit");
      setEditingBooking(head);
      setDetailOpen(true);
      return;
    }

    const newHead: Booking = {
      id: makeId("b_"),
      groupId: makeId("g_"),
      date: dateStr,
      rinkIndex,
      slotIndex,
      durationSlots: 1,
      eventType: EVENT_TYPES.CLUB_EVENT as const,
      subject: "",
    };

    setSelection({ type: "cell", rinkIndex, slotIndex });
    setDetailMode("new");
    setEditingBooking(newHead);
    setDetailOpen(true);
  }

  function onStartMove(bookingHead: Booking) {
    setMoveMode({ active: true, bookingToMove: bookingHead });
    setSelection(null);
  }

  function confirmMove(targetRink: number, targetSlot: number) {
    if (!moveMode.bookingToMove) return;
    const bookingHead = moveMode.bookingToMove;
    const duration = bookingHead.durationSlots;
    const fits = canFitBlock(bookingsMap, targetRink, targetSlot, duration);
    if (!fits) {
      alert("Insufficient space for move");
      return;
    }
    const newGroupId = makeId("g_");
    const newHead: Booking = { ...bookingHead, id: makeId("b_"), groupId: newGroupId, rinkIndex: targetRink, slotIndex: targetSlot };
    const continuations: Booking[] = Array.from({ length: duration - 1 }).map((_, i) => ({
      id: makeId("b_"),
      groupId: newGroupId,
      headId: newHead.id,
      date: dateStr,
      rinkIndex: targetRink,
      slotIndex: targetSlot + 1 + i,
      durationSlots: 1,
      eventType: EVENT_TYPES.CONTINUATION as const,
      subject: "Continuation",
    }));
    const filtered = bookings.filter(b => b.groupId !== bookingHead.groupId);
    setBookings([...filtered, newHead, ...continuations]);
    setMoveMode({ active: false, bookingToMove: null });
    setSelection(null);
  }

  function cancelMove() {
    setMoveMode({ active: false, bookingToMove: null });
    setSelection(null);
  }

  function saveBooking(booking: Booking) {
    const fits = canFitBlock(bookingsMap, booking.rinkIndex, booking.slotIndex, booking.durationSlots);
    if (!fits) {
      alert("Insufficient consecutive slots.");
      return false;
    }
    const groupId = makeId("g_");
    const head: Booking = { ...booking, id: makeId("b_"), groupId };
    const continuations: Booking[] = Array.from({ length: Math.max(0, booking.durationSlots - 1) }).map((_, i) => ({
      id: makeId("b_"),
      groupId,
      headId: head.id,
      date: booking.date,
      rinkIndex: booking.rinkIndex,
      slotIndex: booking.slotIndex + 1 + i,
      durationSlots: 1,
      eventType: EVENT_TYPES.CONTINUATION as const,
      subject: "Continuation",
    }));
    setBookings(prev => [...prev, head, ...continuations]);
    setDetailOpen(false);
    setEditingBooking(null);
    setSelection(null);
    return true;
  }

  function updateBooking(edited: Booking) {
    const groupId = edited.groupId;
    const others = bookings.filter(b => b.groupId !== groupId);
    const continuations: Booking[] = Array.from({ length: Math.max(0, edited.durationSlots - 1) }).map((_, i) => ({
      id: makeId("b_"),
      groupId,
      headId: edited.id,
      date: edited.date,
      rinkIndex: edited.rinkIndex,
      slotIndex: edited.slotIndex + 1 + i,
      durationSlots: 1,
      eventType: EVENT_TYPES.CONTINUATION as const,
      subject: "Continuation",
    }));
    const tentativeMap = buildBookingsMap(others).map;
    if (!canFitBlock(tentativeMap, edited.rinkIndex, edited.slotIndex, edited.durationSlots)) {
      alert("Insufficient space to apply changes.");
      return false;
    }
    setBookings([...others, edited, ...continuations]);
    setDetailOpen(false);
    setEditingBooking(null);
    setSelection(null);
    return true;
  }

  function deleteBooking(bookingHead: Booking) {
    setBookings(prev => prev.filter(b => b.groupId !== bookingHead.groupId));
    setDetailOpen(false);
    setSelection(null);
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2">
          <button className="btn" onClick={prevDay}>Previous</button>
          <div className="px-3 py-2 rounded bg-gray-100">{dateStr}</div>
          <button className="btn" onClick={nextDay}>Next</button>
        </div>
        {moveMode.active && (
          <div className="flex gap-2 items-center">
            <div className="text-sm">Move mode: select target cell</div>
            <button className="btn-ghost" onClick={cancelMove}>Cancel Move</button>
          </div>
        )}
      </div>

      <BookingGrid
        dateStr={dateStr}
        maxRinks={maxRinks}
        bookings={bookings}
        selection={selection}
        moveMode={moveMode}
        onCellClick={onCellClick}
        onStartMove={onStartMove}
      />

      {detailOpen && editingBooking && detailMode && (
        <BookingDetailModal
          mode={detailMode}
          booking={editingBooking}
          onClose={() => setDetailOpen(false)}
          onSave={booking => (detailMode === "new" ? saveBooking(booking) : updateBooking(booking))}
          onDelete={() => deleteBooking(editingBooking)}
          onStartMove={() => onStartMove(editingBooking)}
        />
      )}

      {selection && selection.type === "cell" && selection.tentativeMove && (
        <div className="fixed bottom-6 right-6 bg-white p-4 rounded shadow">
          <div className="mb-2">Confirm move to rink {selection.rinkIndex + 1} slot {selection.slotIndex + 1}?</div>
          <div className="flex gap-2">
            <button className="btn" onClick={() => confirmMove(selection.rinkIndex, selection.slotIndex)}>Confirm</button>
            <button className="btn-ghost" onClick={cancelMove}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingPage;
