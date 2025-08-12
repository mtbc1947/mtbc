import React, { useState, useEffect } from 'react';
import SEO from "../components/SEO";
import MaintainPageLayout from '../layouts/MaintainPageLayout';
import { MaintainEntityManager } from '../components/MaintainEntityManager';
import { Commands } from '../components/Commands';
import backgroundImage from '../assets/green1.jpg';
import { useAuth } from '../auth/AuthContext';
import { toast } from 'react-toastify';

import { getAllMemberData } from 'utilities';
import { MemberRecord } from '../utilities/memberUtils';
import { getMemberColumns } from '../components/Member/MemberColumns';
import EditFormArea from '../components/Member/MemberEditFormArea';
import { createMember, updateMember, deleteMember} from 'utilities';
import ValidationErrorPanel from '../components/ValidationErrorPanel';
import { useConfirmDialog }  from "../hooks/useConfirmDialog";

const MaintainMemberPage: React.FC = () => {
  const { isAuthenticated, adminName } = useAuth();
  const { confirm, dialog } = useConfirmDialog();

  const [members, setMembers] = useState<MemberRecord[]>([]);
  const [selectedItems, setSelectedItems] = useState<MemberRecord[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [isNewEdit, setIsNewEdit] = useState(false);
  const [itemBeingEdited, setItemBeingEdited] = useState<MemberRecord | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [showToast, setShowToast] = useState(false);
  
  useEffect(() => {
    async function fetchMembers() {
      try {
        const data = await getAllMemberData();
        setMembers(data);
        if (data) {
          console.log(`Read ${data.length} members`);
        } else {
          console.log("No members found");
        }
      } catch (error) {
        console.error(error);
      }
    }
    fetchMembers();
  }, []);

  const isSelected = (item: MemberRecord) =>
    selectedItems.some((i) => i._id === item._id);

  const onSelectItem = (item: MemberRecord) => {
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

function validateMember(member: MemberRecord | null | undefined): ValidationResult {
    if (!member) {
      return { valid: false, error: "Member data is missing." };
    }
    if (!member.lastName || member.lastName.trim() === "") {
      return { valid: false, error: "Member lastName is required." };
    }
    if (!member.firstName || member.firstName.trim() === "") {
      return { valid: false, error: "Member fistName is required." };
    }
    return { valid: true };
  }

  const newMember: MemberRecord = {
    lastName: '',
    firstName: '',
    email: "",
    homePhone: "",
    handPhone: "",
  };

  const handleCreate = () => {
    if (!isAuthenticated) return;
    setItemBeingEdited(newMember);
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
    if (!isAuthenticated || selectedItems.length === 0) return;
    
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
      await deleteMember(itemToDelete);
      toast.success("Member deleted successfully");
      // Optionally refresh data here
      setMembers((prev) => prev.filter((e) => e._id !== itemToDelete._id));
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
      let savedItem: MemberRecord;
      
      const result = validateMember(itemBeingEdited);
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
        savedItem = await createMember(itemBeingEdited);
        toast.success("Officer created successfully");
      } else {
        savedItem = await updateMember(itemBeingEdited);
        toast.success("Officer updated successfully");
      }

      setMembers((prev) => {
        const updated = prev.some((e) => e._id === savedItem._id)
          ? prev.map((e) => (e._id === savedItem._id ? savedItem : e))
          : [...prev, savedItem];
        return [...updated].sort((a, b) =>
          a.lastName.localeCompare(b.lastName) || a.firstName.localeCompare(b.firstName)
        );
      });
      
      setEditMode(false);
      setItemBeingEdited(null);
      setSelectedItems([]);
    } catch (error) {
      console.error("Save error:", error);
      toast.error((error as Error).message || "Failed to save member");
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
        title="Maintain Member – Maidenhead Town Bowls Club"
        description="Facility to maintain Member records"
      />
      { dialog }
      <MaintainPageLayout
        backgroundImage={backgroundImage as string}
        title="Maintain Club Officers"
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
            <MaintainEntityManager<MemberRecord>
              columns={getMemberColumns()}
              entities={members}
              selectedItems={selectedItems}
              onSelectItem={onSelectItem}
              onSelectAll={(checked) => setSelectedItems(checked ? [...members] : [])}
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
      /> // PageLayout
    </>
  );
};

export default MaintainMemberPage;
