import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { updateReferenceData } from 'utilities';

import SEO from '../components/SEO';

interface ReferenceDataItem {
  webPage: string;
  refKey: string;
  name: string;
  value: string;
}

interface LocationState {
  adminName?: string;
}

const MaintainDataPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState | null;
  const adminName = state?.adminName;

  const [data, setData] = useState<ReferenceDataItem[]>([]);
  const [websiteOptions, setWebsiteOptions] = useState<string[]>([]);
  const [selectedPage, setSelectedPage] = useState<string>('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editedValue, setEditedValue] = useState<string>('');
  const [showToast, setShowToast] = useState<boolean>(false);

  // Redirect unauthorized users
  useEffect(() => {
    if (!adminName) {
      navigate('/admin', {
        state: { error: 'Access denied. Please log in.' },
      });
    }
  }, [adminName, navigate]);

  // Load data from localStorage
  useEffect(() => {
    const storedData = localStorage.getItem('referenceData');
    const storedOptions = localStorage.getItem('websiteOptions');

    if (storedData) {
      const parsedData: ReferenceDataItem[] = JSON.parse(storedData);
      setData(parsedData);
    }

    if (storedOptions) {
      const parsedOptions: string[] = JSON.parse(storedOptions);
      setWebsiteOptions(parsedOptions);
      setSelectedPage(parsedOptions[0] || '');
    }
  }, []);

  if (!adminName) return null;

  const filteredData = data
    .filter((item) => item.webPage === selectedPage)
    .slice(0, 10);

  const startEditing = (index: number) => {
    setEditingIndex(index);
    setEditedValue(filteredData[index].value);
  };

  const saveValue = (refKey: string) => {
    if (!editedValue.trim()) {
      alert('Value cannot be empty.');
      return;
    }

    setData((prev) =>
      prev.map((item) =>
        item.refKey === refKey ? { ...item, value: editedValue } : item
      )
    );
    setEditingIndex(null);
    setEditedValue('');
  };

  const cancelEditing = () => {
    setEditingIndex(null);
    setEditedValue('');
  };

  const deleteRow = (refKey: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setData((prev) => prev.filter((item) => item.refKey !== refKey));
      if (
        editingIndex !== null &&
        filteredData[editingIndex]?.refKey === refKey
      ) {
        cancelEditing();
      }
    }
  };

const saveAllChanges = async () => {
  try {
    await updateReferenceData(data);              // Update backend
    localStorage.setItem('referenceData', JSON.stringify(data)); // Persist locally
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  } catch (error) {
    console.error('Error saving changes:', error);
    alert('Failed to save changes. Please try again.');
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <SEO
        title="MaintainDataPage – Maidenhead Town Bowls Club"
        description="Provides a gateway to the site's maintenance pages"
      />
      <div className="bg-gray-200 p-6 rounded-xl shadow-md w-full max-w-3xl relative">
        <h1 className="text-2xl font-bold mb-4 text-center">Maintain Web Page Data</h1>
        <p className="text-center text-sm text-gray-600 mb-6">
          Logged in as: <strong>{adminName}</strong>
        </p>

        <div className="mb-6">
          <label className="block mb-1 font-medium">Select Web Page:</label>
          <select
            className="w-full p-2 border rounded"
            value={selectedPage}
            onChange={(e) => {
              setSelectedPage(e.target.value);
              cancelEditing();
            }}
          >
            {websiteOptions.map((page) => (
              <option key={page} value={page}>
                {page}
              </option>
            ))}
          </select>
        </div>

        {filteredData.length === 0 ? (
          <p className="text-center text-gray-500">No data found for this page.</p>
        ) : (
          <ul className="space-y-3">
            {filteredData.map((item, idx) => (
              <li
                key={item.refKey}
                className="bg-white p-3 rounded shadow flex items-center justify-between"
              >
                <div className="flex flex-1 items-center gap-4">
                  <p className="font-semibold w-1/3">{item.name}</p>
                  {editingIndex === idx ? (
                    <input
                      type="text"
                      value={editedValue}
                      onChange={(e) => setEditedValue(e.target.value)}
                      className="w-2/3 p-1 border rounded"
                      autoFocus
                    />
                  ) : (
                    <p className="text-gray-700 w-2/3">{item.value}</p>
                  )}
                </div>

                <div className="flex gap-2 items-center ml-4">
                  {editingIndex === idx ? (
                    <>
                      <button
                        onClick={() => saveValue(item.refKey)}
                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => startEditing(idx)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Edit"
                      >
                        <span className="text-xl">✏️</span>
                      </button>
                      <button
                        onClick={() => deleteRow(item.refKey)}
                        className="text-red-600 hover:text-red-800 text-xl"
                        title="Delete"
                      >
                        ✖
                      </button>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-8 text-center">
          <button
            onClick={saveAllChanges}
            disabled={editingIndex !== null}
            className={`px-6 py-2 rounded text-white transition ${
              editingIndex !== null
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            Save All Changes
          </button>
          
          {editingIndex !== null && (
            <p className="text-sm text-red-600 mt-2">
              Finish editing a row before saving all changes.
            </p>
          )}
        </div>

        {showToast && (
          <div className="absolute top-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow-lg">
            Changes saved!
          </div>
        )}
      </div>
    </div>
  );
};

export default MaintainDataPage;
