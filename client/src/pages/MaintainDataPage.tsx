import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import SEO from '../components/SEO';
import { getReferenceData } from "../utilities/getReferenceData.js";

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

  // Type location.state as possibly undefined or with adminName string
  const state = location.state as LocationState | null;
  const adminName = state?.adminName;

  // Redirect unauthorized users
  useEffect(() => {
    if (!adminName) {
      navigate('/admin', {
        state: { error: 'Access denied. Please log in.' }
      });
    }
  }, [adminName, navigate]);

  if (!adminName) return null;

  const webPages = ['Home', 'AboutUs', 'ContactUs'];

  const [data, setData] = useState<ReferenceDataItem[]>([
    { webPage: 'Home', refKey: '1', name: 'WelcomeText1', value: 'Welcome to our site!' },
    { webPage: 'Home', refKey: '2', name: 'BannerTitle2', value: 'Spring Open Day' },
    { webPage: 'Home', refKey: '3', name: 'WelcomeText3', value: 'Welcome to our site!' },
    { webPage: 'Home', refKey: '4', name: 'BannerTitle4', value: 'Spring Open Day' },
    { webPage: 'Home', refKey: '5', name: 'WelcomeText5', value: 'Welcome to our site!' },
    { webPage: 'Home', refKey: '6', name: 'BannerTitle6', value: 'Spring Open Day' },
    { webPage: 'Home', refKey: '7', name: 'WelcomeText7', value: 'Welcome to our site!' },
    { webPage: 'Home', refKey: '8', name: 'BannerTitle8', value: 'Spring Open Day' },
    { webPage: 'AboutUs', refKey: '9', name: 'ClubHistory', value: 'Founded in 1901.' },
    { webPage: 'ContactUs', refKey: '10', name: 'Email', value: 'info@club.org' },
  ]);

  const [selectedPage, setSelectedPage] = useState<string>(webPages[0]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editedValue, setEditedValue] = useState<string>('');
  const [showToast, setShowToast] = useState<boolean>(false);

  // Fetch updated data from backend, if desired
  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedData = await getReferenceData();
        if (fetchedData && Array.isArray(fetchedData)) {
          setData(fetchedData);
        }
      } catch (err) {
        console.error('Error fetching reference data:', err);
      }
    };
    fetchData();
  }, []);

  // Filter data for the selected page, limit to 10 items max
  const filteredData = data.filter(item => item.webPage === selectedPage).slice(0, 10);

  const startEditing = (index: number) => {
    setEditingIndex(index);
    setEditedValue(filteredData[index].value);
  };

  const saveValue = (refKey: string) => {
    if (!editedValue.trim()) {
      alert('Value cannot be empty.');
      return;
    }

    setData(prev =>
      prev.map(item => (item.refKey === refKey ? { ...item, value: editedValue } : item))
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
      setData(prev => prev.filter(item => item.refKey !== refKey));
      if (editingIndex !== null && filteredData[editingIndex]?.refKey === refKey) {
        cancelEditing();
      }
    }
  };

  const saveAllChanges = () => {
    // Replace this with your API call to save data
    console.log('Saving to backend:', data);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
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
            onChange={e => {
              setSelectedPage(e.target.value);
              cancelEditing();
            }}
          >
            {webPages.map(page => (
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
                      onChange={e => setEditedValue(e.target.value)}
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
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Save All Changes
          </button>
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
