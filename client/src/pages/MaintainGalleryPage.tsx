import React, { useEffect, useState } from "react";
import SEO from "../components/SEO";
import MaintainPageLayout from "../layouts/MaintainPageLayout";
import { MaintainEntityManager } from "../components/MaintainEntityManager";
import { Commands } from "../components/Commands";
import backgroundImage from "../assets/green1.jpg";
import { useAuth } from "../auth/AuthContext";
import { toast } from "react-toastify";

import { GalleryRecord } from "../utilities/galleryUtils";
import { getGalleryColumns } from "../components/Gallery/GalleryColumns";
import EditFormArea from "../components/Gallery/GalleryEditFormArea";
import {
  createGallery,
  updateGallery,
  deleteGallery,
  getAllGallery,
  importFile,
} from "utilities"; // adjust path as needed
import { useConfirmDialog } from "../hooks/useConfirmDialog";

const MaintainGalleryPage: React.FC = () => {
  const { confirm, dialog } = useConfirmDialog();
  const { isAuthenticated } = useAuth();

  const [gallery, setGallery] = useState<GalleryRecord[]>([]);
  const [selectedItems, setSelectedItems] = useState<GalleryRecord[]>([]);
  const [isNewEdit, setIsNewEdit] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [itemBeingEdited, setItemBeingEdited] = useState<GalleryRecord | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const [importSuccessMsg, setImportSuccessMsg] = useState<string | null>(null);
  const [folderUploadProgress, setFolderUploadProgress] = useState<number>(0);
  
  // Load gallery data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllGallery();
        setGallery(data);
      } catch (error) {
        console.error("Failed to load Gallery data:", error);
        toast.error("Failed to load Gallery data");
      }
    };
    fetchData();
  }, []);

  const isSelected = (item: GalleryRecord) =>
    selectedItems.some((i) => i._id === item._id);

  const onSelectItem = (item: GalleryRecord) => {
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

  function validateGallery(gallery: GalleryRecord | null | undefined): ValidationResult {
    if (!gallery) return { valid: false, error: "Gallery is missing." };
    if (!gallery.folderName || gallery.folderName.trim() === "")
      return { valid: false, error: "Gallery folder name is required." };
    if (!gallery.title || gallery.title.trim() === "")
      return { valid: false, error: "Gallery title is required." };
    return { valid: true };
  }

  const newGallery: GalleryRecord = {
    title: "",
    folderName: "",
    cover: "",
    photos: [],
  };

  const handleCreate = () => {
    if (!isAuthenticated) return;
    setItemBeingEdited(newGallery);
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
      await deleteGallery(itemToDelete);
      toast.success("Gallery deleted successfully");
      setGallery((prev) => prev.filter((e) => e._id !== itemToDelete._id));
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error(`Delete failed: ${(error as Error).message}`);
    }

    setEditMode(false);
    setItemBeingEdited(null);
    setSelectedItems([]);
  };

  const handleCancel = () => {
    setEditMode(false);
    setItemBeingEdited(null);
    setSelectedItems([]);
  };

  const handleSave = async () => {
    if (!itemBeingEdited) return;
    const result = validateGallery(itemBeingEdited);
    if (!result.valid) {
      toast.error(result.error);
      return;
    }

    try {
      let savedItem: GalleryRecord;
      if (isNewEdit) {
        savedItem = await createGallery(itemBeingEdited);
        toast.success("Gallery created successfully");
      } else {
        savedItem = await updateGallery(itemBeingEdited);
        toast.success("Gallery updated successfully");
      }

      setGallery((prev) => {
        const updated = prev.some((e) => e._id === savedItem._id)
          ? prev.map((e) => (e._id === savedItem._id ? savedItem : e))
          : [...prev, savedItem];
        return [...updated].sort((a, b) => a.folderName.localeCompare(b.folderName));
      });

      setEditMode(false);
      setItemBeingEdited(null);
      setSelectedItems([]);
    } catch (error) {
      console.error("Save error:", error);
      toast.error((error as Error).message || "Failed to save gallery");
    }
  };

  const handleUploadFile = async (file: File) => {

    try {
      const selectedfolderName = selectedItems[0]?.folderName || "Error";
      if (/\s/.test(selectedfolderName)) {
        setImportSuccessMsg("Foldername invalid");
        throw new Error("Folder name cannot contain spaces.");
      }
      setImportSuccessMsg(null);
      const result = await importFile(file, selectedfolderName);
      if (result.success) {
        setImportSuccessMsg(`CSV imported successfully.`);
      } else {
        throw new Error("Upload failed (no records inserted)");
      }
    } catch (err: any) {
      console.error("Upload file failed", err);
      setImportSuccessMsg("Upload failed");
      throw err;
    }
  };

  const handleUploadFolder = async (files: File[]) => {
    console.log("page handleUploadFolder");
    try {
      const selectedfolderName = selectedItems[0]?.folderName || "Error";
      if (/\s/.test(selectedfolderName)) {
        setImportSuccessMsg("Foldername invalid");
        throw new Error(
          "Folder name cannot contain spaces. Please replace spaces with underscores."
        );
      }
      setImportSuccessMsg(null);
      const uploadErrors: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const result = await importFile(file, selectedfolderName);
        if (!result.success) uploadErrors.push(file.name);
        setFolderUploadProgress(Math.round(((i + 1) / files.length) * 100));
      }

      setImportSuccessMsg(
        `Files imported successfully with ${uploadErrors.length} errors.`
      );
    } catch (err: any) {
      console.error("Upload folder failed", err);
      setImportSuccessMsg("Upload failed");
    } finally {
      // ✅ Always reset so the progress bar disappears for the next upload
      setFolderUploadProgress(0);
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
    <div className="min-h-screen bg-gray-100 p-4">
      <SEO
        title="Maintain Gallery and Photos – Maidenhead Town Bowls Club"
        description="Admin interface for editing Galleries and uploading photos"
      />
      <div>{dialog}</div>

      <MaintainPageLayout
        backgroundImage={backgroundImage as string}
        title="Maintain Gallery & Photos"
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
            onUploadFile={handleUploadFile}
            onUploadFolder={handleUploadFolder}
            folderUploadProgress={folderUploadProgress}
          />
        }
        listPanel={
          <MaintainEntityManager
            columns={getGalleryColumns()}
            entities={gallery}
            selectedItems={selectedItems}
            onSelectItem={onSelectItem}
            onSelectAll={(checked) =>
              setSelectedItems(checked ? [...gallery] : [])
            }
            itemsPerPage={itemsPerPage}
            onItemsPerPageChange={setItemsPerPage}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            isSelected={isSelected}
          />
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
    </div>
  );
};

export default MaintainGalleryPage;
