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

  // key to force remount of folder input
  const [folderInputKey, setFolderInputKey] = useState(0);

  // upload modals
  const [modalVisible, setModalVisible] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  // folder confirmation modal
  const [folderModalVisible, setFolderModalVisible] = useState(false);
  const [pendingFolderFiles, setPendingFolderFiles] = useState<File[]>([]);
  const [pendingFolderName, setPendingFolderName] = useState("");

  useEffect(() => {
    if (folderInputRef.current) {
      folderInputRef.current.setAttribute("webkitdirectory", "");
      folderInputRef.current.setAttribute("directory", "");
    }
  }, [folderInputKey]); // ensure attributes are set after remount

  const buttonsDisabled = uploadProgress > 0;

  const Btn = ({
    disabled,
    label,
    onClick,
  }: {
    disabled?: boolean;
    label: string;
    onClick: () => void;
  }) => (
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

  const startUpload = async (
    file: File,
    handler: (file: File) => Promise<void>
  ) => {
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

  /** Folder change handler shows confirmation modal instead of immediate upload */
  const handleFolderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!onUploadFolder || !e.target.files?.length) return;

    const topLevelFiles = Array.from(e.target.files).filter((f) => {
      const parts = f.webkitRelativePath.split("/");
      return parts.length === 2; // only top-level files
    });

    if (topLevelFiles.length) {
      const firstPath = topLevelFiles[0].webkitRelativePath;
      const folder = firstPath.split("/")[0];
      setPendingFolderName(folder);
      setPendingFolderFiles(topLevelFiles);
      setFolderModalVisible(true);
    }
    // no need to reset here; we re-mount input on modal close
  };

  /** Reset input by remounting */
  const resetFolderInput = () => {
    setFolderInputKey((k) => k + 1);
  };

  const startFolderUpload = () => {
    setFolderModalVisible(false);
    const files = pendingFolderFiles; // capture
    setPendingFolderFiles([]);
    resetFolderInput();

    // Kick off upload AFTER closing modal
    if (onUploadFolder) {
      // not awaited so UI closes instantly
      void onUploadFolder(files);
    }
  };


  const cancelFolderUpload = () => {
    setFolderModalVisible(false);
    setPendingFolderFiles([]);
    resetFolderInput();
  };

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

  const FolderConfirmModal = () =>
    folderModalVisible && (
      <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-6 w-96 text-center">
          <h2 className="text-lg font-bold mb-3">Confirm Folder Upload</h2>
          <p className="mb-2">
            📂 <strong>{pendingFolderName}</strong>
          </p>
          <p className="mb-4">Files to upload: {pendingFolderFiles.length}</p>

          <div className="flex justify-center gap-4">
            <button
              onClick={cancelFolderUpload}
              className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={startFolderUpload}
              className="px-4 py-2 rounded bg-yellow-500 hover:bg-yellow-600 text-white"
            >
              Start
            </button>
          </div>
        </div>
      </div>
    );

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
            key={folderInputKey}               // 👈 re-mount to guarantee onChange
            ref={folderInputRef}
            type="file"
            onClick={(e) => {
              (e.target as HTMLInputElement).value = "";
            }}
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
      <FolderConfirmModal />
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
