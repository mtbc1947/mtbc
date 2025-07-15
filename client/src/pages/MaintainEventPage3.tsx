import React, { useState } from "react";
import { Pencil, Trash } from "lucide-react"; // Using Lucide icons

type EventData = {
  date: string;
  league: string;
  subject: string;
  rinks: number;
  venue: string;
  start: string;
  duration: number;
};

const eventListInitial: EventData[] = [
  { date: "Sat, 3 May", league: "FGX", subject: "Henley v Town X", rinks: 4, venue: "Away", start: "14:30", duration: 3 },
  { date: "Sun, 4 May", league: "FGX", subject: "Burghfield v Town X (Cancelled)", rinks: 5, venue: "Away", start: "14:30", duration: 3 },
  { date: "Sun, 18 May", league: "FGX", subject: "Town X v Iver Heath", rinks: 5, venue: "Home", start: "14:00", duration: 3 },
  { date: "Sat, 24 May", league: "FGX", subject: "Windsor & Eton v Town X", rinks: 5, venue: "Away", start: "14:30", duration: 3 },
  { date: "Wed, 28 May", league: "FGX", subject: "Town X v Flackwell Heath", rinks: 4, venue: "Home", start: "18:00", duration: 3 },
];

const MaintainEventPage: React.FC = () => {
  const [events, setEvents] = useState<EventData[]>(eventListInitial);
  const [editingEvent, setEditingEvent] = useState<EventData | null>(null);

  const handleDelete = (index: number) => {
    const confirmed = window.confirm("Are you sure you want to delete this event?");
    if (confirmed) {
      const updatedEvents = [...events];
      updatedEvents.splice(index, 1);
      setEvents(updatedEvents);
    }
  };

  return (
    <div className="min-h-screen bg-[#c2c067] p-6 font-sans text-black">
      <div className="max-w-6xl mx-auto">
        <p className="mb-6 text-lg">
          An event is an entry that is published in the club's fixture list. You can filter the list by
          selecting an Event Type. You can then create a new event, or by selecting those shown, either update
          an event or delete a number of them.
        </p>

        <div className="mb-6">
          <label className="font-bold mr-4 text-lg">Event Type</label>
          <input
            type="text"
            className="border px-3 py-1"
            defaultValue="Maidenhead Town FGX"
          />
        </div>

        <div className="flex justify-between items-start">
          {/* Event Table */}
          {!editingEvent && (
            <div className="w-3/4">
              <div className="flex items-center mb-2 text-sm">
                <span className="mr-2">0</span>
                <span>/</span>
                <span className="mx-2">21</span>
                <input type="text" className="border w-12 text-center mx-2" defaultValue="5" />
              </div>

              <table className="w-full border border-collapse text-sm">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="border px-2 py-1">Start Date</th>
                    <th className="border px-2 py-1 text-center">League</th>
                    <th className="border px-2 py-1">Subject</th>
                    <th className="border px-2 py-1 text-center">Rinks</th>
                    <th className="border px-2 py-1 text-center">Venue</th>
                    <th className="border px-2 py-1 text-center">Start</th>
                    <th className="border px-2 py-1 text-center">Duration</th>
                    <th className="border px-2 py-1 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((event, idx) => (
                    <tr key={idx} className="bg-white hover:bg-gray-100">
                      <td className="border px-2 py-1">{event.date}</td>
                      <td className="border px-2 py-1 text-center">{event.league}</td>
                      <td className="border px-2 py-1">
                        <span className={event.subject.includes("Cancelled") ? "line-through" : ""}>
                          {event.subject}
                        </span>
                      </td>
                      <td className="border px-2 py-1 text-center">{event.rinks}</td>
                      <td className="border px-2 py-1 text-center">{event.venue}</td>
                      <td className="border px-2 py-1 text-center">{event.start}</td>
                      <td className="border px-2 py-1 text-center">{event.duration}</td>
                      <td className="border px-2 py-1 text-center flex justify-center gap-2">
                        <button onClick={() => setEditingEvent(event)} title="Edit">
                          <Pencil className="w-4 h-4 text-blue-600 hover:text-blue-800" />
                        </button>
                        <button onClick={() => handleDelete(idx)} title="Delete">
                          <Trash className="w-4 h-4 text-red-600 hover:text-red-800" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="flex justify-center mt-4 text-xl gap-4">
                <button>{'<<'}</button>
                <button>{'<'}</button>
                <span className="px-3 py-1 border rounded bg-white">1</span>
                <button>{'>'}</button>
                <button>{'>>'}</button>
              </div>
            </div>
          )}

          {/* Edit Panel */}
          {editingEvent && (
            <div className="w-3/4 bg-white border rounded p-6">
              <h2 className="text-xl font-semibold mb-4">Edit Event</h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <label className="block font-semibold">Start Date</label>
                  <input className="w-full border px-2 py-1" defaultValue={editingEvent.date} />
                </div>
                <div>
                  <label className="block font-semibold">League</label>
                  <input className="w-full border px-2 py-1" defaultValue={editingEvent.league} />
                </div>
                <div className="col-span-2">
                  <label className="block font-semibold">Subject</label>
                  <input className="w-full border px-2 py-1" defaultValue={editingEvent.subject} />
                </div>
                <div>
                  <label className="block font-semibold">Rinks</label>
                  <input className="w-full border px-2 py-1" defaultValue={editingEvent.rinks} />
                </div>
                <div>
                  <label className="block font-semibold">Venue</label>
                  <input className="w-full border px-2 py-1" defaultValue={editingEvent.venue} />
                </div>
                <div>
                  <label className="block font-semibold">Start Time</label>
                  <input className="w-full border px-2 py-1" defaultValue={editingEvent.start} />
                </div>
                <div>
                  <label className="block font-semibold">Duration</label>
                  <input className="w-full border px-2 py-1" defaultValue={editingEvent.duration} />
                </div>
              </div>
              <div className="mt-6 flex gap-4">
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                  onClick={() => alert("Save functionality to be implemented")}
                >
                  Save
                </button>
                <button
                  className="bg-gray-400 text-white px-4 py-2 rounded"
                  onClick={() => setEditingEvent(null)}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Side Panel */}
          <div className="w-1/4 pl-6">
            <div className="border rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-4">Live Event Maintenance</h2>
              <button className="bg-teal-200 rounded-full px-5 py-2 mb-6 hover:bg-teal-300">
                Create
              </button>
              <div className="mb-2">Go to:</div>
              <button className="bg-teal-200 rounded-full px-5 py-2 hover:bg-teal-300">
                Menu
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaintainEventPage;
