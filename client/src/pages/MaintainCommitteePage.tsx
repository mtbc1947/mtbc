import React, { useState, useEffect } from 'react';
import SEO from "../components/SEO";
import MaintainPageLayout from '../layouts/MaintainPageLayout';
import { MaintainEntityManager } from '../components/MaintainEntityManager';
import { Commands } from '../components/Commands';
import backgroundImage from '../assets/green1.jpg';
import { useAuth } from '../auth/AuthContext';
import { toast } from 'react-toastify';

import { getAllCommitteeData } from 'utilities';
import { CommitteeRecord } from '../utilities/committeeUtils';
import { getCommitteeColumns } from '../components/Committee/CommitteeColumns';
import EditFormArea from '../components/Committee/CommitteeEditFormArea';
import { createCommittee, updateCommittee, deleteCommittee} from 'utilities';
import ValidationErrorPanel from '../components/ValidationErrorPanel';
import { useConfirmDialog }  from "../hooks/useConfirmDialog";

const MaintainCommitteePage: React.FC = () => {
  const { confirm, dialog } = useConfirmDialog();
  const { isAuthenticated, adminName } = useAuth();

  const [committees, setCommittees] = useState<CommitteeRecord[]>([]);

  const [selectedItems, setSelectedItems] = useState<CommitteeRecord[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [isNewEdit, setIsNewEdit] = useState(false);
  const [itemBeingEdited, setItemBeingEdited] = useState<CommitteeRecord | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [showToast, setShowToast] = useState(false);
  
  useEffect(() => {
    async function fetchCommittees() {
      try {
        const data = await getAllCommitteeData();
        setCommittees(data);
        if (data) {
          console.log(`Read ${data.length} committee`);
        } else {
          console.log("No Committees found");
        }
      } catch (error) {
        console.error(error);
      }
    }
    fetchCommittees();
  }, []);

  const isSelected = (item: CommitteeRecord) =>
    selectedItems.some((i) => i.commKey === item.commKey);

  const onSelectItem = (item: CommitteeRecord) => {
    setSelectedItems((prev) =>
      prev.some((i) => i.commKey === item.commKey)
        ? prev.filter((i) => i.commKey !== item.commKey)
        : [...prev, item]
    );
  };
  
  interface ValidationResult {
    valid: boolean;
    error?: string;
  }

  function validateCommittee(committee: CommitteeRecord | null | undefined): ValidationResult {
    if (!committee) {
      return { valid: false, error: "Committee data is missing." };
    }
    if (!committee.commKey || committee.commKey.trim() === "") {
      return { valid: false, error: "Committee key is required." };
    }
    if (!committee.order) {
      return { valid: false, error: "Committee order is required." };
    }
    if (!committee.name || committee.name.trim() === "") {
      return { valid: false, error: "Committee name is required." };
    }
    return { valid: true };
  }

  const newCommittee: CommitteeRecord = {
    commKey: '',
    name: '',
    order: 0,
  };

  const handleCreate = () => {
    if (!isAuthenticated) return;
    setItemBeingEdited(newCommittee);
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
  console.log("client handleDeleteSelected");
  if (!isAuthenticated || selectedItems.length === 0) return;
  console.log("Authenticated");
  
  const shouldDelete = await confirm({
    title: "Delete Item",
    message: "Are you sure you want to delete this item?",
    confirmLabel: "Delete",
    cancelLabel: "Cancel",
  });
  console.log("Test should delete");
  if (!shouldDelete) return;
  
  const commKey = selectedItems[0].commKey;
  if (!commKey) return;
  try {
    await deleteCommittee(commKey);
    toast.success("Reference data deleted successfully");
    // Optionally refresh data here
    setCommittees((prev) => prev.filter((e) => e.commKey !== commKey));

  } catch (error) {
    console.log(`Delete failed: ${(error as Error).message}`)
    toast.error(`Delete failed: ${(error as Error).message}`);
  }
  setEditMode(false);
  setItemBeingEdited(null);
  setSelectedItems([]);
};

  const handleSave = async () => {
    if (!itemBeingEdited) return;
    try {
      let savedItem: CommitteeRecord;
            const result = validateCommittee(itemBeingEdited);
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

      if (isNewEdit) {
        savedItem = await createCommittee(itemBeingEdited);
        toast.success("Committee created successfully");
      } else {
        savedItem = await updateCommittee(itemBeingEdited);
        toast.success("Committee updated successfully");
      }

      setCommittees((prev) => {
        const updated = prev.some((e) => e.commKey === savedItem.commKey)
          ? prev.map((e) => (e.commKey === savedItem.commKey ? savedItem : e))
          : [...prev, savedItem];

        return [...updated].sort((a, b) =>
         a.commKey.localeCompare(b.commKey) ||
          (Number(a.order) - Number(b.order))
        );
      })

      setEditMode(false);
      setItemBeingEdited(null);
      setSelectedItems([]);
    } catch (error) {
      console.error("Save error:", error);
      toast.error((error as Error).message || "Failed to save committee");
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
        title="Maintain Committee – Maidenhead Town Bowls Club"
        description="Facility to maintain Committee records"
      />
      { dialog }
      <MaintainPageLayout
          backgroundImage={backgroundImage as string}
          title="Maintain Committees"
          editMode={editMode}
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
            />
          }
          listPanel={
            <>
              <MaintainEntityManager<CommitteeRecord>
                columns={getCommitteeColumns()}
                entities={committees}
                selectedItems={selectedItems}
                onSelectItem={onSelectItem}
                onSelectAll={(checked) => setSelectedItems(checked ? [...committees] : [])}
                itemsPerPage={itemsPerPage}
                onItemsPerPageChange={setItemsPerPage}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
                isSelected={isSelected}
              />
            </>
          }
          editPanel={
            editMode && itemBeingEdited ? (
              <EditFormArea 
                item={itemBeingEdited}
                setItem={setItemBeingEdited}
                isNew={isNewEdit} 
              />
            ) : null
          }
      />
    </>
  );
};

export default MaintainCommitteePage;
