import React, { useState, useEffect } from 'react';
import SEO from "../components/SEO";
import MaintainPageLayout from '../layouts/MaintainPageLayout';
import { MaintainEntityManager } from '../components/MaintainEntityManager';
import { Commands } from '../components/Commands';
import backgroundImage from '../assets/green1.jpg';
import { useAuth } from '../auth/AuthContext';
import { toast } from 'react-toastify';

import { getAllEventData } from 'utilities';
import { EventRecord } from '../utilities/eventUtils';
import { getEventColumns } from '../components/Event/EventColumns';
import EditFormArea from '../components/Event/EventEditFormArea';
import { createEvent, updateEvent, importEvents } from 'utilities';
import ValidationErrorPanel from '../components/ValidationErrorPanel';
import FilterBar from '../components/FilterBar';

const MaintainEventPage: React.FC = () => {
  const { isAuthenticated, adminName } = useAuth();

  const [events, setEvents] = useState<EventRecord[]>([]);

  const [selectedItems, setSelectedItems] = useState<EventRecord[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [itemBeingEdited, setItemBeingEdited] = useState<EventRecord | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  
  const [filterKey, setFilterKey] = useState('');
  const [filterText, setFilterText] = useState('');
  
  const [validationErrors, setValidationErrors] = useState<{ row: number | string; errors: string[] }[]>([]);
  const [importSuccessMsg, setImportSuccessMsg] = useState<string | null>(null);
  
  useEffect(() => {
    async function fetchEvents() {
      try {
        const data = await getAllEventData();
        setEvents(data);
        if (data) {
          console.log(`Read ${data.length} events`);
        } else {
          console.log("No events found");
        }
      } catch (error) {
        console.error(error);
      }
    }
    fetchEvents();
  }, []);

  const isSelected = (item: EventRecord) =>
    selectedItems.some((i) => i.eventId === item.eventId);

  const onSelectItem = (item: EventRecord) => {
    setSelectedItems((prev) =>
      prev.some((i) => i.eventId === item.eventId)
        ? prev.filter((i) => i.eventId !== item.eventId)
        : [...prev, item]
    );
  };

  const filterOptions = [
    { key: '', label: 'All fields' },
    { key: "FG", label: "Friendly Games" },
    { key: "HG", label: "Loan" },
    { key: "KL", label: "Kennet League" },
    { key: "KV", label: "KLV League" },
    { key: "MTBC", label: "Club Events" },
    { key: "RSL", label: "Royal Shield" },
    { key: "TVL", label: "Thames Valley" },
  ];

  const eventFilterFunction = (e: EventRecord, filterText?: string, filterKey?: string): boolean => {
    const trimmed = filterText?.trim().toLowerCase() || '';

    const matchesCalKey = filterKey ? e.calKey === filterKey : true;

    if (trimmed === '') {
      return matchesCalKey;
    }

    if (filterKey && trimmed) {
      return matchesCalKey && Object.values(e).some(
        (val) => typeof val === 'string' && val.toLowerCase().includes(trimmed)
      );
    }

    return Object.values(e).some(
      (val) => typeof val === 'string' && val.toLowerCase().includes(trimmed)
    );
  };

interface ValidationResult {
  valid: boolean;
  error?: string;
}

function validateEvent(event: EventRecord | null | undefined): ValidationResult {
    if (!event) {
      return { valid: false, error: "Event data is missing." };
    }
    if (!event.subject || event.subject.trim() === "") {
      return { valid: false, error: "Event subject is required." };
    }
    if (!event.startDate || event.startDate.trim() === "") {
      return { valid: false, error: "Event start date is required." };
    }
    const date = new Date(event.startDate);
    if (isNaN(date.getTime())) {
      return { valid: false, error: "Event start date is invalid." };
    }
    return { valid: true };
  }

  const newEvent: EventRecord = {
    eventId: ``,
    subject: 'New Event',
    status: 'A',
    startDate: "2025-July-01",
    reqYear: 2025,
    reqMonth: 7,
    reqDate: 1,
    reqJDate: 0,
    startTime: '10:00',
    severity: 'G`',
    homeAway: 'H`',
    dress: 'None',
    mix: 'X`',
    duration: 3,
    rinks: 1,
    eventType: 'CG`',
    useType: 'L`',
    gameType: 'F',
    league: 'KL',
    division: 'A',
    team: 'A',
    calKey: `MTBC`,
  };

  const handleCreate = () => {
    if (!isAuthenticated) return;
    setItemBeingEdited(newEvent);
    setSelectedItems([]);
    setEditMode(true);
  };

  const handleEditSelected = () => {
    if (!isAuthenticated || selectedItems.length !== 1) return;
    setItemBeingEdited(selectedItems[0]);
    setEditMode(true);
  };

  const handleDeleteSelected = () => {
    if (!isAuthenticated || selectedItems.length === 0) return;
    setEvents((prev) => prev.filter((e) => !selectedItems.some((sel) => sel.eventId === e.eventId)));
    setSelectedItems([]);
  };

  const handleSave = async () => {
    if (!itemBeingEdited) return;
    try {
      let savedItem: EventRecord;
      const result = validateEvent(itemBeingEdited);
      if (!result.valid) {
        toast.error(result.error, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        return; // Prevent update
      }

      if (!itemBeingEdited.eventId || itemBeingEdited.eventId.trim() === "") {
        savedItem = await createEvent(itemBeingEdited);
        toast.success("Event created successfully");
      } else {
        savedItem = await updateEvent(itemBeingEdited);
        toast.success("Event updated successfully");
      }

      setEvents((prev) => {
        const updated = prev.some((e) => e.eventId === savedItem.eventId)
          ? prev.map((e) => (e.eventId === savedItem.eventId ? savedItem : e))
          : [...prev, savedItem];

        return [...updated].sort((a, b) => {
          const dateDiff = a.reqJDate - b.reqJDate; // numeric compare
          if (dateDiff !== 0) return dateDiff;
          return a.startTime.localeCompare(b.startTime); // string compare
        });
      });

      setEditMode(false);
      setItemBeingEdited(null);
      setSelectedItems([]);
    } catch (error) {
      console.error("Save error:", error);
      toast.error((error as Error).message || "Failed to save event");
    }
  };

  const handleCancel = () => {
    setEditMode(false);
    setItemBeingEdited(null);
    setSelectedItems([]);
  };

  const handleUpload = async (file: File) => {
    try {
      setValidationErrors([]);
      setImportSuccessMsg(null);

      const result = await importEvents(file);
      setImportSuccessMsg(`CSV imported successfully. Inserted ${result.inserted} records.`);

      const data = await getAllEventData();
      setEvents(data);
    } catch (err: any) {
      console.error("Upload failed", err);

      if (err.validationErrors) {
        setValidationErrors(err.validationErrors);
      } else {
        setValidationErrors([
          { row: "N/A", errors: [err.message || "Unexpected error occurred."] },
        ]);
      }

      setImportSuccessMsg(null);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold text-red-600">Access Denied</h2>
        <p>Please log in to access this page.</p>
      </div>
    );
  }

  return (
    <MaintainPageLayout
      backgroundImage={backgroundImage as string}
      title="Maintain Events"
      editMode={editMode}
      filter={
        <FilterBar
          filterText={filterText}
          setFilterText={setFilterText}
          filterKey={filterKey}
          setFilterKey={setFilterKey}
          filterOptions={filterOptions}
        />
      }
      commands={
        <Commands
          editMode={editMode}
          canEdit={selectedItems.length === 1 && isAuthenticated}
          canDelete={selectedItems.length > 0 && isAuthenticated}
          onCreate={handleCreate}
          onEdit={handleEditSelected}
          onDelete={handleDeleteSelected}
          onSave={handleSave}
          onCancel={handleCancel}
          onUpload={handleUpload}
        />
      }
      listPanel={
        <>
          {validationErrors.length > 0 && <ValidationErrorPanel errors={validationErrors} />}
          {importSuccessMsg && (
            <div className="mb-4 max-w-7xl mx-auto border border-green-300 bg-green-50 p-4 rounded text-green-700 font-medium">
              {importSuccessMsg}
            </div>
          )}
          <MaintainEntityManager<EventRecord>
            columns={getEventColumns()}
            entities={events}
            selectedItems={selectedItems}
            onSelectItem={onSelectItem}
            onSelectAll={(checked) => setSelectedItems(checked ? [...events] : [])}
            itemsPerPage={itemsPerPage}
            onItemsPerPageChange={setItemsPerPage}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            isSelected={isSelected}
            filterText={filterText}
            filterKey={filterKey}
            filterFunction={eventFilterFunction}
          />
        </>
      }
      editPanel={
        editMode && itemBeingEdited ? (
          <EditFormArea item={itemBeingEdited} setItem={setItemBeingEdited} />
        ) : null
      }
    />
  );
};

export default MaintainEventPage;
