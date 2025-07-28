import React, { useEffect, useState } from "react";
import SEO from "../components/SEO";
import MaintainPageLayout from "../layouts/MaintainPageLayout";
import { MaintainEntityManager } from "../components/MaintainEntityManager";
import { Commands } from "../components/Commands";
import backgroundImage from '../assets/green1.jpg';
import { useAuth } from '../auth/AuthContext';  // Adjust path if needed

import { RefDataRecord } from "../utilities/refDataUtils";
import { getRefDataColumns } from '../components/RefData/RefDataColumns';
import EditFormArea from "../components/RefData/RefDataEditFormArea";
import { createRefData, updateRefData } from 'utilities'; // adjust path as needed

const MaintainRefDataPage: React.FC = () => {
  const { isAuthenticated, adminName } = useAuth();
  
  const [refData, setRefData] = useState<RefDataRecord[]>([]);
  const [websiteOptions, setWebsiteOptions] = useState<string[]>([]);

  const [selectedItems, setSelectedItems] = useState<RefDataRecord[]>([]);
  const [isNewEdit, setIsNewEdit] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [itemBeingEdited, setItemBeingEdited] = useState<RefDataRecord | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const [filterKey, setFilterKey] = useState('');
  const [filterText, setFilterText] = useState('');
    
  const [showToast, setShowToast] = useState(false);
  const [selectedPage, setSelectedPage] = useState<string>("");

  useEffect(() => {
    const storedData = localStorage.getItem("refData");
    const storedOptions = localStorage.getItem("websiteOptions");

    if (storedData) {
      const parsed: RefDataRecord[] = JSON.parse(storedData);
      setRefData(parsed);
    }

    if (storedOptions) {
      const parsed: string[] = JSON.parse(storedOptions);
      setWebsiteOptions(parsed);
      setSelectedPage(parsed[0] || "");
    }
  }, []);

  //const filteredData = refData.filter((item) => item.webPage === selectedPage);
    
  const pageOptions = websiteOptions.map ( (item) => {
    return {
      key: item.trim(),
      label: item.trim()
    }
  })

  const allOption = { key: '', label: 'All fields' };

  const filterOptions = [allOption, ...pageOptions];

  const RefDataFilterFunction = (e: RefDataRecord, filterText?: string, filterKey?: string): boolean => {
    const trimmed = filterText?.trim().toLowerCase() || '';
    const key = filterKey?.trim().toLowerCase() || '';

    const matchesCalKey = key === '' || e.webPage?.trim().toLowerCase() === key;

    // Case 1: No text, no filterKey — show everything
    if (trimmed === '' && key === '') {
      return true;
    }

    // Case 2: No text, but filterKey is set — match on calKey only
    if (trimmed === '') {
      return matchesCalKey;
    }

    // Case 3: filterText is present — match on text, restrict to filterKey if set
    const matchesText = Object.values(e).some(
      (val) => typeof val === 'string' && val.toLowerCase().includes(trimmed)
    );

    return matchesCalKey && matchesText;
  };

  const isSelected = (item: RefDataRecord) =>
    selectedItems.some((i) => i.refKey === item.refKey);
  
  const onSelectItem = (item: RefDataRecord) => {
    setSelectedItems((prev) =>
      prev.some((i) => i.refKey === item.refKey)
        ? prev.filter((i) => i.refKey !== item.refKey)
        : [...prev, item]
    );
  };
  
  const newRefData: RefDataRecord = {
    refKey: ``,
    webPage: 'Home',
    name: 'a new name',
    value: 'a new string',
  };
  
  const handleCreate = () => {
    if (!isAuthenticated) return;
    setItemBeingEdited(newRefData);
    setIsNewEdit(true); // <--- This is the fix
    setSelectedItems([]);
    setEditMode(true);
  };

  const handleEditSelected = () => {
    if (!isAuthenticated || selectedItems.length !== 1) return;
    setItemBeingEdited(selectedItems[0]);
    setIsNewEdit(false); // <--- This is an existing item
    setEditMode(true);  
  };
  
  const handleDeleteSelected = () => {
    if (!isAuthenticated || selectedItems.length === 0) return;
    setRefData((prev) => prev.filter((e) => !selectedItems.some((sel) => sel.refKey === e.refKey)));
    setSelectedItems([]);
  };

  const handleCancel = () => {
    setEditMode(false);
    setItemBeingEdited(null);
    setSelectedItems([]);
  };

  const handleSave = async () => {
    if (!itemBeingEdited) return;
    try {
      let savedItem: RefDataRecord;

      if (isNewEdit) {
        savedItem = await createRefData(itemBeingEdited);
      } else {
        savedItem = await updateRefData(itemBeingEdited);
      }

      setRefData((prev) =>
        prev.some((e) => e.refKey === savedItem.refKey)
          ? prev.map((e) => (e.refKey === savedItem.refKey ? savedItem : e))
          : [...prev, savedItem]
      );

      setEditMode(false);
      setItemBeingEdited(null);
      setSelectedItems([]);
    } catch (error) {
      console.error("Save error:", error);
    }
  };
  /** 
  const saveAllChanges = async () => {
    try {
      await updateRefData({filteredData});
      localStorage.setItem("refData", JSON.stringify(data));
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
      console.error("Error saving changes:", error);
      alert("Failed to save changes. Please try again.");
    }
  };

  const onSaveItem = (updated: RefDataRecord) => {
    setData((prev) =>
      prev.map((item) => (item.refKey === updated.refKey ? updated : item))
    );
    setEditMode(false);
    setSelectedItem(null);
  };

  const onDeleteSelected = () => {
    if (!selectedItem) return;
    if (window.confirm("Are you sure you want to delete this item?")) {
      setData((prev) => prev.filter((item) => item.refKey !== selectedItem.refKey));
      setSelectedItem(null);
    }
  };
  */

  if (!isAuthenticated) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold text-red-600">Access Denied</h2>
        <p>Please log in to access this page.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <SEO
        title="Maintain Reference Data – Maidenhead Town Bowls Club"
        description="Admin interface for editing reference data"
      />
      <MaintainPageLayout
        backgroundImage={backgroundImage as string}
        editMode= { editMode }
        filter={
          <div className="mb-6 space-y-2">
            <div className="flex gap-2">
              <select
                className="p-2 border rounded"
                value={filterKey}
                onChange={(e) => setFilterKey(e.target.value)}
              >
                {filterOptions.map((opt) => (
                  <option key={opt.label} value={opt.key}>
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
            onCreate={ handleCreate}
            onEdit={handleEditSelected}
            onDelete={handleDeleteSelected}
            onSave={handleSave}
            onCancel={ handleCancel }
          />
        }
        editPanel={
          editMode && itemBeingEdited && websiteOptions.length > 0 ? (
            <EditFormArea
              item={itemBeingEdited}
              setItem={setItemBeingEdited}
              webPageOptions={ pageOptions }
              isNew={isNewEdit} 
            />
          ) : null
        }

        listPanel={
          <MaintainEntityManager
            columns={getRefDataColumns()}
            entities={ refData}
            selectedItems={selectedItems}
            onSelectItem={onSelectItem}
            onSelectAll={(checked) => setSelectedItems(checked ? [...refData] : [])}
            itemsPerPage={itemsPerPage}
            onItemsPerPageChange={setItemsPerPage}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            isSelected={isSelected}
            filterText={filterText}
            filterKey={filterKey}
            filterFunction={RefDataFilterFunction}
          />
        }
      />
      {showToast && (
        <div className="fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow-lg">
          Changes saved!
        </div>
      )}
    </div>
  );
};

export default MaintainRefDataPage;