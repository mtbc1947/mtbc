import React, { useState, useMemo, useEffect } from "react";
import { getAllEventData, EventRecord } from "utilities";

const monthNames = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

type Severity = "R" | "A" | "G";

interface FilterOption {
  key: string;
  label: string;
  color: Array<string>;
}

const filterOptions: FilterOption[] = [
  { key: "FG", label: "Friendly Games", color: ["133", "66", "234"] },
  { key: "HG", label: "Loan", color: ["63", "243", "216"] },
  { key: "KL", label: "Kennet League", color: ["224", "38", "38"] },
  { key: "KV", label: "KLV League", color: ["240", "194", "105"] },
  { key: "MTBC", label: "Club Events", color: ["27", "136", "44"] },
  { key: "RSL", label: "Royal Shield", color: ["245", "241", "80"] },
  { key: "TVL", label: "Thames Valley", color: ["46", "201", "40"] },
];

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const mediaQueryList = window.matchMedia(query);
    const listener = (event: MediaQueryListEvent) => setMatches(event.matches);
    mediaQueryList.addEventListener("change", listener);
    return () => mediaQueryList.removeEventListener("change", listener);
  }, [query]);
  return matches;
}

function calculateEndTime(startTime: string, duration: number): string {
  const [startHour, startMin] = startTime.split(":" ).map(Number);
  const endHour = startHour + Math.floor(duration);
  const endMin = startMin + Math.round((duration % 1) * 60);
  const adjustedHour = endHour + Math.floor(endMin / 60);
  const adjustedMin = endMin % 60;
  return `${adjustedHour.toString().padStart(2, "0")}:${adjustedMin.toString().padStart(2, "0")}`;
}

export default function FixturesPage() {
  const [events, setEvents] = useState<EventRecord[]>([]);
  useEffect(() => {
    async function fetchEvents() {
      try {
        const data = await getAllEventData();
        setEvents(data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchEvents();
  }, []);

  const [filters, setFilters] = useState<Record<string, boolean>>(() =>
    filterOptions.reduce((acc, f) => ({ ...acc, [f.key]: true }), {})
  );
  const [selectedEvent, setSelectedEvent] = useState<EventRecord | null>(null);
  const [currentMonthIndex, setCurrentMonthIndex] = useState<number>(() => new Date().getMonth());
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const filteredEvents = useMemo(
    () => events.filter((e) => filters[e.calKey]),
    [events, filters]
  );

  const eventsByMonth = useMemo(() => {
    const grouped: Record<number, EventRecord[]> = {};
    filteredEvents.forEach((e) => {
      const month = e.reqMonth;
      if (!grouped[month]) grouped[month] = [];
      grouped[month].push(e);
    });
    Object.values(grouped).forEach((arr) =>
      arr.sort((a, b) => a.reqJDate - b.reqJDate)
    );
    return grouped;
  }, [filteredEvents]);

  function prevMonth() {
    setCurrentMonthIndex((i) => (i === 0 ? 11 : i - 1));
    setSelectedEvent(null);
  }

  function nextMonth() {
    setCurrentMonthIndex((i) => (i === 11 ? 0 : i + 1));
    setSelectedEvent(null);
  }

  function toggleFilter(key: string) {
    setFilters((f) => ({ ...f, [key]: !f[key] }));
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Filter panel */}
      <div
        className={`fixed z-30 top-0 left-0 h-full w-64 bg-white border-r border-gray-300 transition-transform duration-300 ease-in-out
          ${isFiltersOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="p-4 h-full flex flex-col">
          <h2 className="font-bold mb-4 text-xl">Filters</h2>
          {filterOptions.map(({ key, label }) => (
            <label key={key} className="block mb-2 cursor-pointer select-none text-base">
              <input
                type="checkbox"
                checked={filters[key]}
                onChange={() => toggleFilter(key)}
                className="mr-2"
              />
              {label}
            </label>
          ))}
          <button
            onClick={() => setIsFiltersOpen(false)}
            className="mt-auto px-3 py-1 bg-gray-300 rounded self-start"
          >
            Close Filters
          </button>
        </div>
      </div>

      {/* Filter toggle button */}
      {!isFiltersOpen && (
        <button
          onClick={() => setIsFiltersOpen(true)}
          className="fixed top-0 left-0 z-40 h-full w-12 bg-blue-500 text-white flex items-center justify-center cursor-pointer select-none"
          aria-label="Open Filters"
          title="Open Filters"
          style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
        >
          Filter
        </button>
      )}

      {/* Main content */}
      <div className="flex-1 relative overflow-hidden p-2 ml-14">
        {/* Month selector container fixed at 50% of list width */}
        <div className="w-1/3 ml-4 relative h-10 mb-4">
          <button
            onClick={prevMonth}
            className="absolute left-0 top-0 h-10 px-3 bg-gray-200 rounded hover:bg-gray-300 text-lg font-bold select-none"
          >
            &lt;
          </button>

          <div className="absolute left-0 right-0 top-0 h-10 flex items-center justify-center">
            <h1 className="text-2xl font-bold text-center">
              {monthNames[currentMonthIndex]}
            </h1>
          </div>

          <button
            onClick={nextMonth}
            className="absolute right-0 top-0 h-10 px-3 bg-gray-200 rounded hover:bg-gray-300 text-lg font-bold select-none"
          >
            &gt;
          </button>
        </div>

        {/* Fixture list in 2/3 width grey rectangle closer to left edge */}
        <div className="flex justify-start">
          <div className="bg-gray-100 rounded-2xl p-4 shadow-md w-2/3 ml-4">
            <ul className="space-y-1">
              {(eventsByMonth[currentMonthIndex] || []).map((e) => {
                const date = new Date(e.reqJDate);
                const day = date.getDate();
                const month = monthNames[e.reqMonth];
                const weekday = date.toLocaleDateString("en-GB", { weekday: "short" });
                const color = filterOptions.find(f => f.key === e.calKey)?.color || ["128", "128", "128"];
                const rgb = `rgb(${color.join(",")})`;
                const endTime = calculateEndTime(e.startTime, e.duration || 2);

                return (
                  <li
                    key={e.eventId}
                    onClick={() => setSelectedEvent(e)}
                    className="cursor-pointer px-4 py-1 rounded-md hover:bg-gray-200 flex items-center gap-4"
                  >
                    <div className="w-10 text-xl text-gray-800">{e.reqDate}</div>
                    <div className="w-20 text-base text-gray-700">{month}</div>
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: rgb }} />
                    <div className="text-base text-gray-800">
                      {e.startTime} – {endTime} 
                    </div>
                    <div className="w-20 text-base text-gray-700">
                      {e.homeAway === "H" ? "Home" : "Away"} 
                    </div>
                    <div className="text-base text-gray-700">{e.subject}</div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>

      {/* Event details modal - animated sliding in from right */}
      {selectedEvent && (
        <div
          className="fixed inset-0 z-50"
          onClick={() => setSelectedEvent(null)}
        >
          <div
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-green-300 rounded-lg p-6 max-w-md w-full shadow-xl transition-transform duration-300 ease-in-out pointer-events-auto"
            style={{ marginRight: "1rem", maxHeight: "90vh", overflowY: "auto", animation: "slideInRight 0.3s ease forwards" }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedEvent(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
              aria-label="Close event details"
            >
              ✕
            </button>
            <h2 className="text-xl font-bold mb-2">{selectedEvent.subject}</h2>
            <p><strong>Date:</strong> {selectedEvent.reqJDate}</p>
            <p><strong>Severity:</strong> {selectedEvent.severity}</p>
            <p className="mt-4 whitespace-pre-wrap">{selectedEvent.subject}</p>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%) translateY(-50%);
          }
          to {
            transform: translateX(0) translateY(-50%);
          }
        }
      `}</style>
    </div>
  );
}
