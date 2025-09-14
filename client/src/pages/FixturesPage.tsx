import React, { useState, useMemo, useEffect } from "react";
import { getAllEventData, EventRecord } from "utilities";
import { SEO } from "components";

const monthNames = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

interface FilterOption {
  key: string;
  label: string;
  color: Array<string>;
}

const filterOptions: FilterOption[] = [
  { key: "FG", label: "Friendly Games", color: ["133", "66", "234"] },
  { key: "HG", label: "Loan", color: ["63", "243", "216"] },
  { key: "KL", label: "Kennet League", color: ["224", "38", "38"] },
  { key: "KV", label: "KLV League", color: ["255", "165", "0"] },
  { key: "MTBC", label: "Club Events", color: ["27", "136", "44"] },
  { key: "RSL", label: "Royal Shield", color: ["139", "69", "19"] },
  { key: "TVL", label: "Thames Valley", color: ["30", "144", "255"] },
];

function calculateEndTime(startTime: string, duration: number): string {
  const [startHour, startMin] = startTime.split(":").map(Number);
  const endHour = startHour + Math.floor(duration);
  const endMin = startMin + Math.round((duration % 1) * 60);
  const adjustedHour = endHour + Math.floor(endMin / 60);
  const adjustedMin = endMin % 60;
  return `${adjustedHour.toString().padStart(2, "0")}:${adjustedMin
    .toString()
    .padStart(2, "0")}`;
}

function calculateDayOfWeek(day: number, month: number, year: number): string {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const date = new Date(year, month, day);
  return days[date.getDay()];
}

function parseDress(dress: string): string {
  if (dress === null) return "";
  return dress === "W" ? "White" : "Grey";
}

function parseRinks(rinks: string, gender: string, gameType: string | null): string {
  if (rinks === "null" || rinks === "") return "";
  let gameMarker = gameType || null;
  let genderMarker = "";
  switch (gender) {
    case "X":
      genderMarker = "M";
      break;
    default:
      genderMarker = "";
      break;
  }
  if (genderMarker === "" && !gameMarker) gameMarker = "R";
  return rinks + genderMarker + gameMarker;
}

function formDetailLine(selectedEvent: EventRecord): string[] {
  const typeMap: Record<string, string> = {
    KL: "Kennet League",
    KLV: "KLV League",
    RSL: "Royal Shield League",
    TVL: "Thames Valley League",
    FG: "Friendly",
    HG: "Loan Match",
    CE: "Club Event",
    CG: "Club Game",
  };

  const descriptionMap: Record<string, string> = {
    KL: "League Game",
    KLV: "League Game",
    RSL: "League Game",
    TVL: "League Game",
    FG: "Friendly",
    HG: "Loan Match",
    CE: "Club Event",
    CG: "Club Game",
  };

  const venue = selectedEvent.homeAway === "H" ? "Home" : "Away";
  let eventType = "";
  let eventDescription = "";

  if (selectedEvent.calKey === "MTBC") {
    eventType = typeMap[selectedEvent.eventType] ?? selectedEvent.eventType;
    eventDescription = descriptionMap[selectedEvent.eventType] ?? "Event";
  } else {
    eventType = typeMap[selectedEvent.calKey] ?? selectedEvent.calKey;
    eventDescription = descriptionMap[selectedEvent.calKey] ?? "Event";
  }

  const line1 =
    selectedEvent.eventType === "CE" || selectedEvent.eventType === "CG"
      ? `${eventType}`
      : `${eventType} (${venue})`;

  const dayOfWeek = calculateDayOfWeek(
    selectedEvent.reqDate,
    selectedEvent.reqMonth,
    selectedEvent.reqYear
  );
  const line2 = `${dayOfWeek}, ${selectedEvent.reqDate} ${monthNames[selectedEvent.reqMonth]} ${new Date().getFullYear()}`;

  const endTime = calculateEndTime(selectedEvent.startTime, selectedEvent.duration || 2);
  const line3 = `${selectedEvent.startTime} – ${endTime}`;

  const line4 = selectedEvent.subject ?? "";

  let gender = "";
  switch (selectedEvent.mix) {
    case "M":
      gender = "Men's";
      break;
    case "L":
      gender = "Ladies'";
      break;
    case "X":
      gender = "Mixed";
      break;
    default:
      gender = "Men's";
      break;
  }
  const line5 = `${gender} ${venue}, ${eventDescription}`;

  const line6 = parseRinks(String(selectedEvent.rinks), selectedEvent.mix, selectedEvent.gameType);

  let dress = "";
  if (selectedEvent.dress === "W") dress = "Whites";
  else if (selectedEvent.dress === "G") dress = "Greys";
  const line7 = dress;

  return [line1, line2, line3, line4, line5, line6, line7];
}

export default function FixturesPage() {
  const [events, setEvents] = useState<EventRecord[]>([]);
  const [filters, setFilters] = useState<Record<string, boolean>>(() =>
    filterOptions.reduce((acc, f) => ({ ...acc, [f.key]: true }), {})
  );
  const [selectedEvent, setSelectedEvent] = useState<EventRecord | null>(null);
  const [currentMonthIndex, setCurrentMonthIndex] = useState<number>(new Date().getMonth());
  const [currentPage, setCurrentPage] = useState(1);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const eventsPerPage = 12;

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

  const currentMonthEvents = eventsByMonth[currentMonthIndex] || [];
  const totalPages = Math.ceil(currentMonthEvents.length / eventsPerPage);
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = currentMonthEvents.slice(indexOfFirstEvent, indexOfLastEvent);
  const isAllSelected = useMemo(() => Object.values(filters).every(Boolean), [filters]);

  const prevMonth = () => {
    setCurrentMonthIndex((i) => (i === 0 ? 11 : i - 1));
    setCurrentPage(1);
    setSelectedEvent(null);
  };

  const nextMonth = () => {
    setCurrentMonthIndex((i) => (i === 11 ? 0 : i + 1));
    setCurrentPage(1);
    setSelectedEvent(null);
  };

  const toggleFilter = (key: string) => {
    setFilters((f) => ({ ...f, [key]: !f[key] }));
    setCurrentPage(1);
  };

  const toggleAllFilters = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setFilters(filterOptions.reduce((acc, f) => ({ ...acc, [f.key]: isChecked }), {}));
    setCurrentPage(1);
  };

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="flex w-full items-stretch relative">
      <SEO title="Fixtures – Maidenhead Town Bowls Club" description="Displays this season's fixture list" />

      {/* Filter panel */}
      <div
        className={`fixed z-30 top-0 left-0 h-full w-64 py-16 bg-white border-r border-gray-300 transition-transform duration-300 ease-in-out
        ${isFiltersOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="p-4 md:pt-16 h-full flex flex-col">
          <h2 className="font-bold mb-4 text-xl">Filters</h2>

          <label className="block mb-2 cursor-pointer select-none text-base font-bold">
            <input type="checkbox" checked={isAllSelected} onChange={toggleAllFilters} className="mr-2" />
            All
          </label>

          {filterOptions.map(({ key, label, color }) => {
            const rgb = `rgb(${color.join(",")})`;
            return (
              <label key={key} className="flex items-center gap-2 mb-2 cursor-pointer select-none text-base">
                <input type="checkbox" checked={filters[key]} onChange={() => toggleFilter(key)} className="hidden" />
                <span
                  className={`w-5 h-5 flex items-center justify-center rounded-sm border-2`}
                  style={{ backgroundColor: filters[key] ? rgb : "transparent", borderColor: rgb }}
                >
                  {filters[key] && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414L8.414 15l-4.121-4.121a1 1 0 011.414-1.414L8.414 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </span>
                {label}
              </label>
            );
          })}

          <button onClick={() => setIsFiltersOpen(false)} className="mt-auto px-3 py-1 bg-gray-300 rounded self-start">
            Close Filters
          </button>
        </div>
      </div>

      {/* Closed filter toggle button (stretched) */}
      {!isFiltersOpen && (
        <div className="w-12 flex-shrink-0">
          <button
            onClick={() => setIsFiltersOpen(true)}
            className="w-full h-full bg-blue-500 text-white flex items-center justify-center cursor-pointer select-none"
            style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
          >
            Filter
          </button>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 ml-0 md:ml-0 p-4 md:p-8 bg-white/70 rounded-md shadow-lg mx-4 md:mx-8">
        {/* Month nav */}
        <div className="w-full max-w-lg mx-auto">
          <div className="grid grid-cols-[auto_1fr_auto] gap-1 items-center h-10 mb-4">
            <button
              onClick={prevMonth}
              className="h-10 px-3 bg-gray-200 rounded hover:bg-gray-300 text-lg font-bold select-none"
            >
              &lt;
            </button>

            <h1 className="text-2xl font-bold text-center">{monthNames[currentMonthIndex]}</h1>

            <button
              onClick={nextMonth}
              className="h-10 px-3 bg-gray-200 rounded hover:bg-gray-300 text-lg font-bold select-none"
            >
              &gt;
            </button>
          </div>
        </div>

        {/* Fixture list */}
        <div className="bg-gray-100 rounded-2xl p-4 shadow-md w-full">
          <ul className="space-y-1">
            {currentEvents.length > 0 ? (
              currentEvents.map((e) => {
                const color = filterOptions.find((f) => f.key === e.calKey)?.color || ["128", "128", "128"];
                const rgb = `rgb(${color.join(",")})`;
                const endTime = calculateEndTime(e.startTime, e.duration || 2);
                const DoW = calculateDayOfWeek(e.reqDate, e.reqMonth, e.reqYear);
                const dress = parseDress(e.dress);
                const rinkMarker = parseRinks(String(e.rinks), e.mix, e.gameType);

                return (
                  <li
                    key={e.eventId}
                    onClick={() => setSelectedEvent(e)}
                    className="cursor-pointer py-1 rounded-md hover:bg-gray-200
                      grid gap-2 items-center px-2
                      grid-cols-[1rem_2rem_1rem_auto_1rem_1fr]
                      md:px-4
                      md:grid-cols-[2rem_3rem_1rem_minmax(6rem,8rem)_minmax(5rem,6rem)_minmax(3rem,4rem)_minmax(3rem,4rem)_1fr]"
                  >
                    <div className="text-xl text-gray-800">{e.reqDate}</div>
                    <div className="text-base text-gray-700">{DoW}</div>
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: rgb }} />
                    <div className="text-base text-gray-800 truncate">
                      <span className="md:hidden">{e.startTime}</span>
                      <span className="hidden md:inline">{e.startTime} – {endTime}</span>
                    </div>
                    <div className="text-base text-gray-700 text-center">
                      <span className="md:hidden">{e.homeAway}</span>
                      <span className="hidden md:inline">{e.homeAway === "H" ? "Home" : "Away"}</span>
                    </div>
                    <div className="hidden md:block text-base text-gray-700">{dress}</div>
                    <div className="hidden md:block text-base text-gray-700">{rinkMarker}</div>
                    <div className="text-base text-gray-700 truncate">{e.subject}</div>
                  </li>
                );
              })
            ) : (
              <p className="text-center text-gray-500">No events found for this month.</p>
            )}
          </ul>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-4">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => paginate(page)}
                className={`px-3 py-1 rounded ${currentPage === page ? "bg-blue-500 text-white" : "bg-gray-200"}`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Event details modal */}
      {selectedEvent && (
        <div
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-green-300 rounded-lg p-6 max-w-md w-full shadow-xl transition-transform duration-300 ease-in-out pointer-events-auto"
          style={{
            marginRight: "1rem",
            maxHeight: "90vh",
            overflowY: "auto",
            animation: "slideInRight 0.3s ease forwards",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => setSelectedEvent(null)}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
            aria-label="Close event details"a
          >
            ✕
          </button>

          {(() => {
            const lines = formDetailLine(selectedEvent);
            return (
              <>
                {lines.map((line, i) => line && <p key={i} className="text-lg mb-1">{line}</p>)}
              </>
            );
          })()}
        </div>
      )}

    </div>
  );
}
