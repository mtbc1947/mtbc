import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface CommandsProps {
  editMode: boolean;
  canEdit: boolean;
  canDelete: boolean;
  onCreate: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onSave: () => void;
  onCancel: () => void;
  onUploadCSV?: (file: File) => Promise<void>;
  onUploadFile?: (file: File) => Promise<void>;
  onUploadFolder?: (files: File[]) => Promise<void>;
  folderUploadProgress?: number; // 0 or undefined means idle
}

export function Commands({
  editMode,
  canEdit,
  canDelete,
  onCreate,
  onEdit,
  onDelete,
  onSave,
  onCancel,
  onUploadCSV,
  onUploadFile,
  onUploadFolder,
  folderUploadProgress,
}: CommandsProps) {
  const navigate = useNavigate();

  const csvInputRef = useRef<HTMLInputElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const folderInputRef = useRef<HTMLInputElement | null>(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  useEffect(() => {
    if (folderInputRef.current) {
      folderInputRef.current.setAttribute("webkitdirectory", "");
      folderInputRef.current.setAttribute("directory", "");
    }
  }, []);

  const handleMenuClick = () => navigate("/admin");

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
    } catch (err) {
      console.error(err);
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
      const files = Array.from(e.target.files);

      // Filter out files in subfolders
      const topLevelFiles = files.filter(file => {
        // webkitRelativePath example: "finals_sun/image1.jpg"
        // we only want files with no subfolder, i.e., no slash after folder
        return !file.webkitRelativePath.includes('/') || 
              file.webkitRelativePath.split('/').length === 2; 
        // length === 2: ["folderName", "fileName"]
      });

      try {
        await onUploadFolder(topLevelFiles);
      } catch (err) {
        console.error(err);
      }
    }
    e.target.value = "";
  };

  // 🔑 Disable all command buttons while a folder upload is in progress
  const buttonsDisabled =
    folderUploadProgress !== undefined && folderUploadProgress > 0;

  return (
    <>
      {modalVisible && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-lg p-6 w-96">
            <h2 className="text-lg font-bold mb-2">Uploading CSV</h2>
            <p className="mb-4">{selectedFileName}</p>

            {uploading ? (
              <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                <div className="bg-yellow-500 h-4 rounded-full animate-pulse w-full" />
              </div>
            ) : (
              <div className="mb-4 text-sm text-gray-700">{uploadMessage}</div>
            )}

            {!uploading && (
              <button
                className="mt-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded w-full"
                onClick={() => {
                  setModalVisible(false);
                  setUploadMessage(null);
                  setSelectedFileName(null);
                }}
              >
                Close
              </button>
            )}
          </div>
        </div>
      )}

      <div className="bg-white bg-opacity-80 rounded-2xl shadow-lg p-4 w-full md:w-64 flex flex-col items-stretch">
        <h2 className="text-lg font-bold text-center text-gray-800 mb-4">
          Actions
        </h2>

        <div className="flex flex-row md:flex-col gap-2 mb-4">
          {!editMode ? (
            <>
              <button
                onClick={onCreate}
                disabled={buttonsDisabled}
                className={`px-4 py-2 rounded w-full ${
                  buttonsDisabled
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-yellow-500 text-white hover:bg-yellow-600"
                }`}
              >
                New
              </button>

              <button
                onClick={onEdit}
                disabled={!canEdit || buttonsDisabled}
                className={`px-4 py-2 rounded w-full ${
                  !canEdit || buttonsDisabled
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-yellow-500 text-white hover:bg-yellow-600"
                }`}
              >
                Edit
              </button>

              <button
                onClick={onDelete}
                disabled={!canDelete || buttonsDisabled}
                className={`px-4 py-2 rounded w-full ${
                  !canDelete || buttonsDisabled
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-yellow-500 text-white hover:bg-yellow-600"
                }`}
              >
                Delete
              </button>

              {onUploadCSV && (
                <>
                  <button
                    onClick={() => csvInputRef.current?.click()}
                    disabled={buttonsDisabled}
                    className={`px-4 py-2 rounded w-full ${
                      buttonsDisabled
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-yellow-500 text-white hover:bg-yellow-600"
                    }`}
                  >
                    Upload CSV
                  </button>
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
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={!canEdit || buttonsDisabled}
                    className={`px-4 py-2 rounded w-full ${
                      !canEdit || buttonsDisabled
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-yellow-500 text-white hover:bg-yellow-600"
                    }`}
                  >
                    Upload File
                  </button>
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
                  <button
                    onClick={() => folderInputRef.current?.click()}
                    disabled={!canEdit || buttonsDisabled}
                    className={`px-4 py-2 rounded w-full ${
                      !canEdit || buttonsDisabled
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-yellow-500 text-white hover:bg-yellow-600"
                    }`}
                  >
                    Upload Folder
                  </button>
                  <input
                    ref={folderInputRef}
                    type="file"
                    onChange={handleFolderChange}
                    style={{ display: "none" }}
                  />

                  {folderUploadProgress !== undefined && folderUploadProgress > 0 && (
                    <div className="w-full mb-2">
                      {/* Progress bar */}
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                        <div
                          className="bg-yellow-500 h-2 rounded transition-all"
                          style={{
                            width: `${folderUploadProgress}%`,
                          }}
                        />
                      </div>
                      {/* Percentage */}
                      <p className="text-xs text-center text-gray-700">
                        {folderUploadProgress}%
                      </p>
                    </div>
                  )}

                </>
              )}
            </>
          ) : (
            <>
              <button
                onClick={onSave}
                disabled={buttonsDisabled}
                className={`px-4 py-2 rounded w-full ${
                  buttonsDisabled
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-yellow-500 text-white hover:bg-yellow-600"
                }`}
              >
                Save
              </button>
              <button
                onClick={onCancel}
                disabled={buttonsDisabled}
                className={`px-4 py-2 rounded w-full ${
                  buttonsDisabled
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-yellow-500 text-white hover:bg-yellow-600"
                }`}
              >
                Cancel
              </button>
            </>
          )}
        </div>

        <div className="border-t border-gray-300 pt-3">
          <p className="text-sm font-medium text-gray-700 mb-1">Go To:</p>
          <button
            onClick={handleMenuClick}
            className="w-full bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600"
          >
            Menu
          </button>
        </div>
      </div>
    </>
  );
}
