import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface CommandsProps {
  editMode: boolean;
  photoMode: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canSetCover?: boolean;
  canDeletePhotos?: boolean;
  onCreate: () => void;
  onEdit: () => void;
  onDelete?: () => void;
  onSave: () => void;
  onCancel: () => void;
  onSetCover?: () => void;
  onUploadCSV?: (file: File) => Promise<void>;
  onUploadFile?: (file: File) => Promise<void>;
  onUploadFolder?: (files: File[]) => Promise<void>;
  onOpenPhotos?: () => void;
  uploadProgress?: number;
  uploadTarget?: number;
}

export function Commands({
  editMode,
  photoMode,
  canEdit,
  canDelete,
  canSetCover,
  canDeletePhotos,
  onCreate,
  onEdit,
  onDelete,
  onSave,
  onCancel,
  onSetCover,
  onUploadCSV,
  onUploadFile,
  onUploadFolder,
  onOpenPhotos,
  uploadProgress = 0,
  uploadTarget = 0,
}: CommandsProps) {
  const navigate = useNavigate();

  // refs for hidden inputs
  const csvInputRef = useRef<HTMLInputElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const folderInputRef = useRef<HTMLInputElement | null>(null);

  // upload modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  // allow folder upload
  useEffect(() => {
    if (folderInputRef.current) {
      folderInputRef.current.setAttribute("webkitdirectory", "");
      folderInputRef.current.setAttribute("directory", "");
    }
  }, []);

  const buttonsDisabled = uploadProgress > 0;

  /** Helper to render a styled button */
  const Btn = (
    {
      disabled,
      label,
      onClick,
    }: { disabled?: boolean; label: string; onClick: () => void }
  ) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded w-full ${
        disabled
          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
          : "bg-yellow-500 text-white hover:bg-yellow-600"
      }`}
    >
      {label}
    </button>
  );

  /** Upload helpers */
  const startUpload = async (file: File, handler: (file: File) => Promise<void>) => {
    setSelectedFileName(file.name);
    setModalVisible(true);
    setUploading(true);
    setUploadMessage(null);
    try {
      await handler(file);
      setUploadMessage("Upload successful!");
    } catch {
      setUploadMessage("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleCSVChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onUploadCSV) await startUpload(file, onUploadCSV);
    e.target.value = "";
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onUploadFile) await startUpload(file, onUploadFile);
    e.target.value = "";
  };

  const handleFolderChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onUploadFolder && e.target.files?.length) {
      // Only top-level files (avoid nested subfolders)
      const topLevelFiles = Array.from(e.target.files).filter((f) => {
        const parts = f.webkitRelativePath.split("/");
        return parts.length === 2;
      });
      await onUploadFolder(topLevelFiles);
    }
    e.target.value = "";
  };

  /** Modal for upload progress */
  const UploadModal = () =>
    modalVisible && (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-6 w-96">
          <h2 className="text-lg font-bold mb-2">Uploading</h2>
          <p className="mb-4">{selectedFileName}</p>

          {uploading ? (
            <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
              <div className="bg-yellow-500 h-4 rounded-full animate-pulse w-full" />
            </div>
          ) : (
            <div className="mb-4 text-sm text-gray-700">{uploadMessage}</div>
          )}

          {!uploading && Btn({ label: "Close", onClick: () => setModalVisible(false) })}
        </div>
      </div>
    );

  /** Rendered action sets */
  const EditActions = () => (
    <>
      {Btn({ disabled: buttonsDisabled, label: "Save", onClick: onSave })}
      {Btn({ disabled: buttonsDisabled, label: "Cancel", onClick: onCancel })}
    </>
  );

  const PhotoActions = () => (
    <>
      {Btn({
        disabled: !(canSetCover ?? false) || buttonsDisabled,
        label: "Set Cover",
        onClick: () => onSetCover?.(),
      })}
      {Btn({
        disabled: !(canDeletePhotos ?? false) || buttonsDisabled,
        label: "Delete",
        onClick: () => onDelete?.(),
      })}
      {Btn({ label: "Cancel", onClick: onCancel })}
    </>
  );

  const DefaultActions = () => (
    <>
      {Btn({ disabled: buttonsDisabled, label: "New", onClick: onCreate })}
      {Btn({
        disabled: !canEdit || buttonsDisabled,
        label: "Edit",
        onClick: onEdit,
      })}
      {Btn({
        disabled: !canDelete || buttonsDisabled,
        label: "Delete",
        onClick: () => onDelete?.(),
      })}
      {onOpenPhotos &&
        Btn({
          disabled: !canEdit || buttonsDisabled,
          label: "Photos",
          onClick: onOpenPhotos,
        })}

      {onUploadCSV && (
        <>
          {Btn({
            disabled: buttonsDisabled,
            label: "Upload CSV",
            onClick: () => csvInputRef.current?.click(),
          })}
          <input
            ref={csvInputRef}
            type="file"
            accept=".csv"
            onChange={handleCSVChange}
            style={{ display: "none" }}
          />
        </>
      )}

      {onUploadFile && (
        <>
          {Btn({
            disabled: !canEdit || buttonsDisabled,
            label: "Upload File",
            onClick: () => fileInputRef.current?.click(),
          })}
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </>
      )}

      {onUploadFolder && (
        <>
          {Btn({
            disabled: !canEdit || buttonsDisabled,
            label: "Upload Folder",
            onClick: () => folderInputRef.current?.click(),
          })}
          <input
            ref={folderInputRef}
            type="file"
            onChange={handleFolderChange}
            style={{ display: "none" }}
          />
          {uploadProgress > 0 && uploadTarget > 0 && (
            <div className="w-full mb-2 flex items-center justify-between gap-2">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-yellow-500 h-2 rounded-full transition-all"
                  style={{
                    width: `${Math.round(
                      (uploadProgress / uploadTarget) * 100
                    )}%`,
                  }}
                />
              </div>
              <p className="text-xs text-gray-700 min-w-[50px] text-right">
                {uploadProgress}/{uploadTarget}
              </p>
            </div>
          )}
        </>
      )}
    </>
  );

  return (
    <>
      <UploadModal />
      <div className="bg-white bg-opacity-80 rounded-2xl shadow-lg p-4 w-full md:w-64 flex flex-col items-stretch">
        <h2 className="text-lg font-bold text-center text-gray-800 mb-4">Actions</h2>

        <div className="flex flex-row md:flex-col gap-2 mb-4">
          {editMode
            ? <EditActions />
            : photoMode
            ? <PhotoActions />
            : <DefaultActions />}
        </div>

        <div className="border-t border-gray-300 pt-3">
          <p className="text-sm font-medium text-gray-700 mb-1">Go To:</p>
          {Btn({
            disabled: buttonsDisabled,
            label: "Menu",
            onClick: () => navigate("/admin"),
          })}
        </div>
      </div>
    </>
  );
}
