import React, { useState, useEffect } from 'react';
import { EventRecord } from '../utilities/eventDataUtils';
import { MaintainEntityManager } from '../components/MaintainEntityManager';
import MaintainPageLayout from '../layouts/MaintainPageLayout';
import EditFormArea from '../components/EditFormArea';
import { Commands } from '../components/Commands';
import backgroundImage from '../assets/green1.jpg';
import { getAllEventData } from 'utilities';
import { createEvent, updateEvent, importEvents } from 'utilities'; // adjust path as needed

import {
  renderEventTableRow,
  renderEventListRow,
} from '../components/EventRenderers';
import { useAuth } from '../auth/AuthContext';  // Adjust path if needed
import ValidationErrorPanel from '../components/ValidationErrorPanel';

const MaintainEventPage: React.FC = () => {
  const { isAuthenticated, adminName } = useAuth();

  const [events, setEvents] = useState<EventRecord[]>([]);
  const [selectedItems, setSelectedItems] = useState<EventRecord[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [itemBeingEdited, setItemBeingEdited] = useState<EventRecord | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const [validationErrors, setValidationErrors] = useState<{ row: number | string; errors: string[] }[]>([]);
  const [importSuccessMsg, setImportSuccessMsg] = useState<string | null>(null);

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

  const isSelected = (item: EventRecord) =>
    selectedItems.some((i) => i.eventId === item.eventId);

  const onSelectItem = (item: EventRecord) => {
    setSelectedItems((prev) =>
      prev.some((i) => i.eventId === item.eventId)
        ? prev.filter((i) => i.eventId !== item.eventId)
        : [...prev, item]
    );
  };

  const newEvent: EventRecord = {
    eventId: ``,
    subject: 'New Event',
    status: 'A',
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
    setSelectedItems([]); // Optional: clear selection
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

    // Optionally refresh event list after import
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

    setImportSuccessMsg(null); // Clear any previous success
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
        <div className="mb-6">
          <input
            type="text"
            placeholder="Filter events (not implemented)"
            className="w-full p-2 border rounded"
            disabled
          />
        </div>
      }
      commands={
        <Commands
          editMode={editMode}
          canCreate={isAuthenticated}
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
          entities={events}
          selectedItems={selectedItems}
          onSelectItem={onSelectItem}
          onSelectAll={(checked) => setSelectedItems(checked ? [...events] : [])}
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={setItemsPerPage}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          renderItem={(item, index) =>
            renderEventTableRow(item, index, isSelected, onSelectItem)
          }
          renderMobileItem={(item, index) =>
            renderEventListRow(item, index, isSelected, onSelectItem)
          }
        />
        </>
      }
      editPanel={
        editMode && itemBeingEdited ? (
          <EditFormArea
            item={itemBeingEdited}
            setItem={setItemBeingEdited}
          />
        ) : null
      }
    />
  );
};

export default MaintainEventPage;
