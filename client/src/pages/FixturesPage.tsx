import React, { useState, useMemo, useEffect } from "react";
import { getAllEventData, EventRecord } from "utilities";

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

// Define event severity type
type Severity = "R" | "A" | "G";

// Define filter option type
interface FilterOption {
  key: string;
  label: string;
  color: Array<string>;
}

const filterOptions: FilterOption[] = [
  { key: "FG", label: "Friendly Games", color: ["133","66","234"] },
  { key: "HG", label: "Loan", color: ["63","243","216"] },
  { key: "KL", label: "Kennet League", color: ["224","38","38"] },
  { key: "KV", label: "KLV League", color: ["240","194","105"] },
  { key: "MTBC", label: "Club Events", color: ["27","136","44"] },
  { key: "RSL", label: "Royal Shield", color: ["245","241","80"] },
  { key: "TVL", label: "Thames Valley", color: ["46","201","40"] },
];

// Custom hook for media query
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

  const filteredEvents = useMemo(() => events.filter((e) => filters[e.calKey]), [events, filters]);

  const eventsByMonth = useMemo(() => {
    const grouped: Record<number, EventRecord[]> = {};
    filteredEvents.forEach((e) => {
      const month = e.reqMonth;
      if (!grouped[month]) grouped[month] = [];
      grouped[month].push(e);
    });
    Object.values(grouped).forEach((arr) => arr.sort((a, b) => a.reqJDate - b.reqJDate));
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

  const severityColors: Record<Severity, string> = {
    R: "text-red-600",
    A: "text-yellow-600",
    G: "text-gray-900",
  };

  function toggleFilter(key: string) {
    setFilters((f) => ({ ...f, [key]: !f[key] }));
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Filter panel */}
      <div
        className={`fixed md:relative z-30 bg-white border-r border-gray-300 top-0 left-0 h-full w-64 transition-transform duration-300 ease-in-out
          ${isFiltersOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="p-4 h-full flex flex-col">
          <h2 className="font-bold mb-4 text-xl">Filters</h2>
          {filterOptions.map(({ key, label }) => (
            <label key={key} className="block mb-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={filters[key]}
                onChange={() => toggleFilter(key)}
                className="mr-2"
              />
              {label}
            </label>
          ))}

          {/* Close button inside panel */}
          <button
            onClick={() => setIsFiltersOpen(false)}
            className="mt-auto px-3 py-1 bg-gray-300 rounded self-start"
          >
            Close Filters
          </button>
        </div>
      </div>

      {/* Toggle button vertical strip when filter panel is closed */}
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
      <div className={`flex-1 p-4 ${isFiltersOpen ? "md:ml-64" : ""}`}>
        {/* Month header */}
        <div className="flex items-center justify-start mb-4 pl-4 space-x-2 max-w-md">
          <button
            onClick={prevMonth}
            aria-label="Previous month"
            className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 text-lg font-bold select-none"
          >
            &lt;
          </button>

          <h1 className="text-2xl font-bold mx-2 whitespace-nowrap">
            {monthNames[currentMonthIndex]}
          </h1>

          <button
            onClick={nextMonth}
            aria-label="Next month"
            className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 text-lg font-bold select-none"
          >
            &gt;
          </button>
        </div>

        <ul>
          {(eventsByMonth[currentMonthIndex] || []).length === 0 && (
            <li className="text-gray-500 italic">No events this month.</li>
          )}
          {(eventsByMonth[currentMonthIndex] || []).map((e) => (
            <li
              key={e.eventId}
              onClick={() => setSelectedEvent(e)}
              className={`cursor-pointer mb-2 p-2 border rounded hover:bg-gray-100 ${
                severityColors[e.severity as Severity] || severityColors.G
              }`}
            >
              <div className="font-semibold">{e.subject}</div>
              <div className="text-sm text-gray-600">{e.reqJDate}</div>
            </li>
          ))}
        </ul>
      </div>

      {/* Popup modal */}
      {selectedEvent && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setSelectedEvent(null)}
        >
          <div
            className="bg-white rounded p-6 max-w-md w-full relative"
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
            <p>
              <strong>Date:</strong> {selectedEvent.reqJDate}
            </p>
            <p>
              <strong>Severity:</strong> {selectedEvent.severity}
            </p>
            <p className="mt-4 whitespace-pre-wrap">{selectedEvent.subject}</p>
          </div>
        </div>
      )}
    </div>
  );
}
