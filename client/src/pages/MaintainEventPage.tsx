import React, { useState, useEffect } from 'react';
import SEO from "../components/SEO";
import MaintainPageLayout from '../layouts/MaintainPageLayout';
import { MaintainEntityManager } from '../components/MaintainEntityManager';
import { Commands } from '../components/Commands';
import backgroundImage from '../assets/green1.jpg';
import { useAuth } from '../auth/AuthContext';

import { getAllEventData } from 'utilities';
import { EventRecord } from '../utilities/eventUtils';
import { getEventColumns } from '../components/Event/EventColumns';
import EditFormArea from '../components/Event/EventEditFormArea';
import { createEvent, updateEvent, importEvents } from 'utilities';
import ValidationErrorPanel from '../components/ValidationErrorPanel';

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

      if (!itemBeingEdited.eventId || itemBeingEdited.eventId.trim() === "") {
        savedItem = await createEvent(itemBeingEdited);
      } else {
        savedItem = await updateEvent(itemBeingEdited);
      }

      setEvents((prev) =>
        prev.some((e) => e.eventId === savedItem.eventId)
          ? prev.map((e) => (e.eventId === savedItem.eventId ? savedItem : e))
          : [...prev, savedItem]
      );

      setEditMode(false);
      setItemBeingEdited(null);
      setSelectedItems([]);
    } catch (error) {
      console.error("Save error:", error);
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
      editMode={editMode}
      filter={
        <div className="mb-6 space-y-2">
          <div className="flex gap-2">
            <select
              className="p-2 border rounded"
              value={filterKey}
              onChange={(e) => setFilterKey(e.target.value)}
            >
              {filterOptions.map((opt) => (
                <option key={opt.key} value={opt.key}>
                  {opt.label}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Enter filter text"
              className="flex-1 p-2 border rounded"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
            />
          </div>
        </div>
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
