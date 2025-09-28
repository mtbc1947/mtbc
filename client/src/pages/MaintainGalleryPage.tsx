import React, { useEffect, useState } from "react";
import SEO from "../components/SEO";
import MaintainPageLayout from "../layouts/MaintainPageLayout";
import { MaintainEntityManager } from "../components/MaintainEntityManager";
import { Commands } from "../components/Commands";
import backgroundImage from "../assets/green1.jpg";
import { useAuth } from "../auth/AuthContext";
import { toast } from "react-toastify";

import { GalleryRecord, mapGalleryImageToPhoto } from "../utilities/galleryUtils";
import { getGalleryColumns } from "../components/Gallery/GalleryColumns";
import EditFormArea from "../components/Gallery/GalleryEditFormArea";
import { ThumbnailPanel } from "../components/Gallery/Thumbnail";
import { GalleryImage, Photo } from "../types/galleryTypes";
import {
  createGallery,
  updateGallery,
  deleteGallery,
  getAllGallery,
  getGalleryImages,
  importFile,
  deletePhotoFromImageKit,
} from "../utilities";
import { useConfirmDialog } from "../hooks/useConfirmDialog";

const MaintainGalleryPage: React.FC = () => {
  const { confirm, dialog } = useConfirmDialog();
  const { isAuthenticated } = useAuth();

  /** ==================== State ==================== */
  const [gallery, setGallery] = useState<GalleryRecord[]>([]);
  const [selectedItems, setSelectedItems] = useState<GalleryRecord[]>([]);
  const [itemBeingEdited, setItemBeingEdited] = useState<GalleryRecord | null>(null);
  const [isNewEdit, setIsNewEdit] = useState(false);

  const [editMode, setEditMode] = useState(false);
  const [photosMode, setPhotosMode] = useState(false);

  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedThumbnails, setSelectedThumbnails] = useState<Photo[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadTarget, setUploadTarget] = useState(0);

  /** ==================== Load Data ==================== */
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

  /** ==================== Helpers ==================== */
  const isSelected = (item: GalleryRecord) =>
    selectedItems.some((i) => i._id === item._id);

  const onSelectItem = (item: GalleryRecord) => {
    setSelectedItems((prev) =>
      prev.some((i) => i._id === item._id)
        ? prev.filter((i) => i._id !== item._id)
        : [...prev, item]
    );
  };

  const newGallery: GalleryRecord = {
    title: "",
    folderName: "",
    cover: "",
    photos: [],
  };

  const validateGallery = (g: GalleryRecord | null) => {
    if (!g) return { valid: false, error: "Gallery is missing." };
    if (!g.folderName?.trim()) return { valid: false, error: "Folder name is required." };
    if (!g.title?.trim()) return { valid: false, error: "Gallery title is required." };
    return { valid: true };
  };

  const resetState = () => {
    setEditMode(false);
    setPhotosMode(false);
    setItemBeingEdited(null);
    setSelectedItems([]);
    setPhotos([]);
    setSelectedThumbnails([]);
  };

  /** ==================== Gallery Handlers ==================== */
  const handleCreate = () => {
    if (!isAuthenticated) return;
    setItemBeingEdited(newGallery);
    setIsNewEdit(true);
    setSelectedItems([]);
    setEditMode(true);
    setPhotosMode(false);
  };

  const handleEditSelected = () => {
    if (!isAuthenticated || selectedItems.length !== 1) return;
    setItemBeingEdited(selectedItems[0]);
    setIsNewEdit(false);
    setEditMode(true);
    setPhotosMode(false);
  };

  const handleDeleteSelected = async () => {
    if (!isAuthenticated || selectedItems.length === 0) return;

    const shouldDelete = await confirm({
      title: "Delete Gallery",
      message: "Are you sure you want to delete this gallery?",
      confirmLabel: "Delete",
      cancelLabel: "Cancel",
    });
    if (!shouldDelete) return;

    try {
      const itemToDelete = selectedItems[0];
      await deleteGallery(itemToDelete);
      setGallery((prev) => prev.filter((g) => g._id !== itemToDelete._id));
      toast.success("Gallery deleted successfully");
      resetState();
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error(`Delete failed: ${(err as Error).message}`);
    }
  };

  const handleSave = async () => {
    if (!itemBeingEdited) return;

    const result = validateGallery(itemBeingEdited);
    if (!result.valid) {
      toast.error(result.error);
      return;
    }

    try {
      const saved = isNewEdit
        ? await createGallery(itemBeingEdited)
        : await updateGallery(itemBeingEdited);

      setGallery((prev) => {
        const exists = prev.some((g) => g._id === saved._id);
        const updated = exists
          ? prev.map((g) => (g._id === saved._id ? saved : g))
          : [...prev, saved];
        return [...updated].sort((a, b) => a.folderName.localeCompare(b.folderName));
      });

      toast.success(isNewEdit ? "Gallery created successfully" : "Gallery updated successfully");
      resetState();
    } catch (err) {
      console.error("Save error:", err);
      toast.error((err as Error).message || "Failed to save gallery");
    }
  };

  /** ==================== Photo Handlers ==================== */
  const handleOpenPhotos = async () => {
    if (!selectedItems[0]) return;
    setPhotosMode(true);
    setEditMode(false);
    setItemBeingEdited(null);

    try {
      const folder = selectedItems[0].folderName;
      const result: GalleryImage[] = await getGalleryImages(folder);
      const mappedPhotos: Photo[] = result.map((img) => mapGalleryImageToPhoto(img, folder));

      setPhotos(mappedPhotos);
      setSelectedThumbnails([]);
    } catch (err) {
      console.error("Failed to load photos:", err);
      toast.error("Failed to load photos");
    }
  };

  const handleUploadFile = async (file: File) => {
    if (!selectedItems[0]) return;
    await importFile(file, selectedItems[0].folderName);
  };

  const handleUploadFolder = async (files: File[]) => {
    if (!selectedItems[0]) return;
    setUploadTarget(files.length);
    for (let i = 0; i < files.length; i++) {
      await importFile(files[i], selectedItems[0].folderName);
      setUploadProgress(i + 1);
    }
    setUploadProgress(0);
    setUploadTarget(0);
  };

  const handleDeletePhotos = async () => {
    if (selectedThumbnails.length === 0) return;

    const shouldDelete = await confirm({
      title: "Delete Photos",
      message: `Delete ${selectedThumbnails.length} photo(s)?`,
      confirmLabel: "Delete",
      cancelLabel: "Cancel",
    });
    if (!shouldDelete) return;

    try {
      for (const photo of selectedThumbnails) {
        await deletePhotoFromImageKit(photo);
      }
      setPhotos((prev) => prev.filter((p) => !selectedThumbnails.includes(p)));
      setSelectedThumbnails([]);
      toast.success("Selected photos deleted successfully");
    } catch (err) {
      console.error("Photo delete error:", err);
      toast.error((err as Error).message || "Failed to delete photos");
    }
  };
/** ==================== Set Cover Handler ==================== */
  const handleSetCover = async () => {
    // Ensure exactly one photo and a gallery are selected
    if (selectedThumbnails.length !== 1 || !selectedItems[0]) return;

    const photo = selectedThumbnails[0];
    const galleryToUpdate = selectedItems[0];

    try {
      // Copy gallery and set the cover to the selected photo URL
      const updatedGallery: GalleryRecord = {
        ...galleryToUpdate,
        cover: photo.url,
      };

      // Call your existing update function to persist to the backend
      const savedGallery = await updateGallery(updatedGallery);

      // Update local state
      setGallery((prev) =>
        prev.map((g) => (g._id === savedGallery._id ? savedGallery : g))
      );

      toast.success("Cover photo updated successfully!");
    } catch (error) {
      console.error("Set cover failed:", error);
      toast.error(`Failed to set cover: ${(error as Error).message}`);
    }
  };

  /** ==================== Render ==================== */
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
      {dialog}

      <MaintainPageLayout
        backgroundImage={backgroundImage as string}
        title="Maintain Gallery & Photos"
        editMode={editMode || photosMode}
        commands={
          <Commands
            editMode={editMode}
            photoMode={photosMode}
            canEdit={selectedItems.length === 1 && isAuthenticated}
            canDelete={selectedItems.length > 0 && isAuthenticated}
            canSetCover={selectedThumbnails.length === 1}
            canDeletePhotos={selectedThumbnails.length > 0}
            onCreate={handleCreate}
            onEdit={handleEditSelected}
            onDelete={editMode ? handleDeleteSelected : handleDeletePhotos}
            onSave={handleSave}
            onCancel={resetState}
            onSetCover={handleSetCover}
            onOpenPhotos={handleOpenPhotos}
            onUploadFile={handleUploadFile}
            onUploadFolder={handleUploadFolder}
            uploadProgress={uploadProgress}
            uploadTarget={uploadTarget}
          />
        }
        listPanel={
          <MaintainEntityManager
            columns={getGalleryColumns()}
            entities={gallery}
            selectedItems={selectedItems}
            onSelectItem={onSelectItem}
            onSelectAll={(checked) => setSelectedItems(checked ? [...gallery] : [])}
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
          ) : photosMode ? (
            <ThumbnailPanel
              photos={photos}
              selected={selectedThumbnails}
              setSelected={setSelectedThumbnails}
              currentCoverUrl={itemBeingEdited?.cover}   
            />
          ) : null
        }
      />
    </div>
  );
};

export default MaintainGalleryPage;
