import React, { useState, useEffect } from 'react';
import SEO from "../components/SEO";
import MaintainPageLayout from '../layouts/MaintainPageLayout';
import { MaintainEntityManager } from '../components/MaintainEntityManager';
import { Commands } from '../components/Commands';
import backgroundImage from '../assets/green1.jpg';
import { useAuth } from '../auth/AuthContext';
import { toast } from 'react-toastify';

import { getAllOfficerData, createOfficer, updateOfficer, deleteOfficer } from 'utilities';
import { OfficerRecord } from '../utilities/officerUtils';
import { getOfficerColumns } from '../components/Officer/OfficerColumns';
import EditFormArea from '../components/Officer/OfficerEditFormArea';
import FilterBar from '../components/FilterBar';
import { useConfirmDialog } from "../hooks/useConfirmDialog";
import { getAllMemberData, MemberRecord } from '../utilities/memberUtils';

const MaintainOfficerPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { confirm, dialog } = useConfirmDialog();

  const [officers, setOfficers] = useState<OfficerRecord[]>([]);
  const [selectedItems, setSelectedItems] = useState<OfficerRecord[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [isNewEdit, setIsNewEdit] = useState(false);
  const [itemBeingEdited, setItemBeingEdited] = useState<OfficerRecord | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [filterKey, setFilterKey] = useState('');
  const [filterText, setFilterText] = useState('');
  const [members, setMembers] = useState<MemberRecord[]>([]);

  useEffect(() => {
    // fetch members once on mount
    async function fetchMembers() {
      try {
        const membersData = await getAllMemberData();
        console.log(`Read ${membersData.length} Members`);
        setMembers(membersData);
      } catch (error) {
        console.error("Failed to fetch members", error);
      }
    }
    fetchMembers();
  }, []);

  useEffect(() => {
    // fetch officers once members are loaded
    if (members.length === 0) return;

    async function fetchOfficers() {
      try {
        const data = await getAllOfficerData();

        // hydrate holderId for all officers
        const hydrated = data.map(officer => {
          if (typeof officer.holderId === "string" && officer.holderId !== "") {
            const memberObj = members.find(m => m._id === officer.holderId);
            if (memberObj) return { ...officer, holderId: memberObj };
          }
          return officer;
        });

        setOfficers(hydrated);
        if (data) {
          console.log(`Read ${data.length} Officers`);
        } else {
          console.log("No Officers found");
        }
      } catch (error) {
        console.error(error);
      }
    }

    fetchOfficers();
  }, [members]);

  const isSelected = (item: OfficerRecord) =>
    selectedItems.some((i) => i._id === item._id);

  const onSelectItem = (item: OfficerRecord) => {
    setSelectedItems((prev) =>
      prev.some((i) => i._id === item._id)
        ? prev.filter((i) => i._id !== item._id)
        : [...prev, item]
    );
  };

  interface ValidationResult {
    valid: boolean;
    error?: string;
  }

  function validateOfficer(officer: OfficerRecord | null | undefined): ValidationResult {
    if (!officer) {
      return { valid: false, error: "Officer data is missing." };
    }
    if (!officer.refKey || officer.refKey.trim() === "") {
      return { valid: false, error: "Officer refKey is required." };
    }
    if (!officer.commKey || officer.commKey.trim() === "") {
      return { valid: false, error: "Officer commKey is required." };
    }
    if (officer.order === undefined || officer.order === null) {
      return { valid: false, error: "Officer order is required." };
    }
    if (!officer.position || officer.position.trim() === "") {
      return { valid: false, error: "Officer position is required." };
    }
    return { valid: true };
  }

  const newOfficer: OfficerRecord = {
    refKey: '',
    commKey: '',
    order: 0,
    holderId: '',
    position: '',
  };

  const filterOptions = [
    { key: "", label: "All" },
    { key: "MB", label: "Management" },
    { key: "LC", label: "Ladies'" },
    { key: "MC", label: "Men's" },
    { key: "ST", label: "Social Team" },
    { key: "AC", label: "Other Officers" },
  ];

  const officerFilterFunction = (e: OfficerRecord, filterText?: string, filterKey?: string): boolean => {
    const trimmed = filterText?.trim().toLowerCase() || '';

    const matchesCommKey = filterKey ? e.commKey === filterKey : true;

    if (trimmed === '') {
      return matchesCommKey;
    }

    if (filterKey && trimmed) {
      return matchesCommKey && Object.values(e).some(
        (val) => typeof val === 'string' && val.toLowerCase().includes(trimmed)
      );
    }

    return Object.values(e).some(
      (val) => typeof val === 'string' && val.toLowerCase().includes(trimmed)
    );
  };

  const handleCreate = () => {
    if (!isAuthenticated) return;
    setItemBeingEdited(newOfficer);
    setIsNewEdit(true);
    setSelectedItems([]);
    setEditMode(true);
  };

  const handleEditSelected = () => {
    if (!isAuthenticated || selectedItems.length !== 1) return;
    setItemBeingEdited(selectedItems[0]);
    setIsNewEdit(false);
    setEditMode(true);
  };

  const handleDeleteSelected = async (): Promise<void> => {
    if (!isAuthenticated || selectedItems.length !== 1) return;

    const shouldDelete = await confirm({
      title: "Delete Item",
      message: "Are you sure you want to delete this item?",
      confirmLabel: "Delete",
      cancelLabel: "Cancel",
    });
    if (!shouldDelete) return;

    const itemToDelete = selectedItems[0];
    if (!itemToDelete) return;

    try {
      await deleteOfficer(itemToDelete);
      toast.success("Officer deleted successfully");
      setOfficers((prev) => prev.filter((e) => !selectedItems.some((sel) => sel._id === e._id)));
    } catch (error) {
      toast.error(`Delete failed: ${(error as Error).message}`);
    }
    setEditMode(false);
    setItemBeingEdited(null);
    setSelectedItems([]);
  };

  const handleSave = async () => {
    if (!itemBeingEdited) return;

    let officerToSave = { ...itemBeingEdited };

    // Replace holderId string with member object before saving
    if (typeof officerToSave.holderId === 'string' && officerToSave.holderId !== '') {
      const memberObj = members.find(m => m._id === officerToSave.holderId);
      if (memberObj) {
        officerToSave.holderId = memberObj;
      }
    }

    try {
      const result = validateOfficer(officerToSave);
      if (!result.valid) {
        toast.error(result.error);
        return;
      }

      let savedItem: OfficerRecord;

      if (isNewEdit) {
        savedItem = await createOfficer(officerToSave);
        toast.success("Officer created successfully");
      } else {
        savedItem = await updateOfficer(officerToSave);
        toast.success("Officer updated successfully");
      }

      // **Hydrate savedItem's holderId to member object here**
      if (typeof savedItem.holderId === 'string' && savedItem.holderId !== '') {
        const memberObj = members.find(m => m._id === savedItem.holderId);
        if (memberObj) {
          savedItem.holderId = memberObj;
        }
      }

      setOfficers((prev) => {
        const updated = prev.some((e) => e._id === savedItem._id)
          ? prev.map((e) => (e._id === savedItem._id ? savedItem : e))
          : [...prev, savedItem];

        return [...updated].sort((a, b) =>
          a.commKey.localeCompare(b.commKey) ||
          (Number(a.order) - Number(b.order))
        )
      });

      setEditMode(false);
      setItemBeingEdited(null);
      setSelectedItems([]);
    } catch (error) {
      toast.error((error as Error).message || "Failed to save officer");
    }
  };

  const handleCancel = () => {
    setEditMode(false);
    setItemBeingEdited(null);
    setSelectedItems([]);
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
    <>
      <SEO
        title="Maintain Officer Page – Maidenhead Town Bowls Club"
        description="Facility to maintain Officer records"
      />
      {dialog}
      <MaintainPageLayout
        backgroundImage={backgroundImage as string}
        title="Maintain Officers"
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
            canDelete={selectedItems.length === 1 && isAuthenticated}
            onCreate={handleCreate}
            onEdit={handleEditSelected}
            onDelete={handleDeleteSelected}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        }
        listPanel={
          <>
            <MaintainEntityManager<OfficerRecord>
              columns={getOfficerColumns()}
              entities={officers}
              selectedItems={selectedItems}
              onSelectItem={onSelectItem}
              onSelectAll={(checked) => setSelectedItems(checked ? [...officers] : [])}
              itemsPerPage={itemsPerPage}
              onItemsPerPageChange={setItemsPerPage}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              isSelected={isSelected}
              filterText={filterText}
              filterKey={filterKey}
              filterFunction={officerFilterFunction}
            />
          </>
        }
        editPanel={
          editMode && itemBeingEdited ? (
            <EditFormArea
              item={itemBeingEdited}
              setItem={setItemBeingEdited}
              isNew={isNewEdit}
              members={members}
            />
          ) : null
        }
      />
    </>
  );
};

export default MaintainOfficerPage;
