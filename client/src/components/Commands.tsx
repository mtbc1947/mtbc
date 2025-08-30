import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface CommandsProps {
  editMode: boolean;
  canEdit: boolean;
  canDelete: boolean;
  onCreate: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onSave: () => void;
  onCancel: () => void;
  onUpload?: (file: File) => Promise<void>;  // optional
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
  onUpload,
}: CommandsProps) {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  const handleMenuClick = () => {
    navigate('/admin');
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && onUpload) {
      setSelectedFileName(file.name);
      setModalVisible(true);
      setUploading(true);
      setUploadMessage(null);

      try {
        await onUpload(file);
        setUploadMessage('Upload successful!');
      } catch (err) {
        console.error(err);
        setUploadMessage('Upload failed. Please try again.');
      } finally {
        setUploading(false);
        event.target.value = ''; // Clear file input so same file can be re-uploaded
      }
    }
  };

  return (
    <>
      {/* Modal */}
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
              <div className="mb-4 text-sm text-gray-700">
                {uploadMessage}
              </div>
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

      {/* Commands Panel */}
      <div className="bg-white bg-opacity-80 rounded-2xl shadow-lg p-4 w-full md:w-64 flex flex-col items-stretch">
        <h2 className="text-lg font-bold text-center text-gray-800 mb-4">Actions</h2>

        <div className="flex flex-row md:flex-col gap-2 mb-4">
          {!editMode ? (
            <>
              <button
                onClick={onCreate}
                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 w-full"
              >
                New
              </button>
              <button
                onClick={onEdit}
                disabled={!canEdit}
                className={`px-4 py-2 rounded w-full ${
                  canEdit ? 'bg-yellow-500 text-white hover:bg-yellow-600' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Edit
              </button>
              <button
                onClick={onDelete}
                disabled={!canDelete}
                className={`px-4 py-2 rounded w-full ${
                  canDelete ? 'bg-yellow-500 text-white hover:bg-yellow-600' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Delete
              </button>

              {/* Only show Upload CSV if onUpload prop exists */}
              {onUpload && (
                <>
                  <button
                    onClick={handleUploadClick}
                    className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 w-full"
                  >
                    Upload CSV
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                  />
                </>
              )}
            </>
          ) : (
            <>
              <button
                onClick={onSave}
                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 w-full"
              >
                Save
              </button>
              <button
                onClick={onCancel}
                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 w-full"
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
