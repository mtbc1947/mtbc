import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SEO } from 'components';
import { getAllRefData, RefDataRecord } from 'utilities';
import { useAuth } from '../auth/AuthContext';

interface LocationState {
  error?: string;
  skipAuth?: boolean;
  adminName?: string;
}

const AdminPage: React.FC = () => {
  const location = useLocation();
  const state = location.state as LocationState | undefined;

  const { isAuthenticated, adminName, login, logout, skipAuth } = useAuth();

  const [name, setName] = useState<string>(state?.adminName || '');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [refData, setRefData] = useState<RefDataRecord[]>([]);
  const [websiteOptions, setWebsiteOptions] = useState<string[]>([]);

  // Load refData from localStorage or API
  useEffect(() => {
    const storedData = localStorage.getItem('refData');
    if (storedData) {
      const parsedData: RefDataRecord[] = JSON.parse(storedData);
      setRefData(parsedData);
      const options = Array.from(new Set(parsedData.map(item => item.webPage))).sort();
      setWebsiteOptions(options);
    } else {
      const getData = async () => {
        const data = await getAllRefData();
        setRefData(data);
        localStorage.setItem('refData', JSON.stringify(data));
        const options = Array.from(new Set(data.map(item => item.webPage))).sort();
        setWebsiteOptions(options);
        localStorage.setItem('websiteOptions', JSON.stringify(options));
      };
      getData();
    }
  }, []);

  // Show error from navigation state, if any
  useEffect(() => {
    if (state?.error) {
      setError(state.error);
    }
  }, [state]);

  // Handle skipAuth ONLY on internal navigation (NOT on refresh)
  useEffect(() => {
    if (state?.skipAuth) {
      skipAuth(state.adminName || 'Admin');
      setError('');
    }
    // We deliberately do NOT depend on refData here to avoid repeated calls
  }, [state, skipAuth]);

  // Clear error on successful authentication
  useEffect(() => {
    if (isAuthenticated) {
      setError('');
    }
  }, [isAuthenticated]);

  // Check password against the refData value
  const checkPassword = () => {
    if (refData.length === 0) {
      setError('System not ready. Try again shortly.');
      return;
    }

    const refItem = refData.find(item => item.refKey === 'SD035');
    const VALID_TOKEN = refItem?.value ?? '';

    if (password === VALID_TOKEN) {
      const success = login(name || 'Admin', password);
      if (success) {
        setError('');
      } else {
        setError('Login failed');
      }
    } else {
      setError('Incorrect password');
    }
  };

  // Clear localStorage and logout
  const handleClearStorage = () => {
    localStorage.removeItem('refData');
    localStorage.removeItem('websiteOptions');
    setRefData([]);
    setWebsiteOptions([]);
    logout();
    setPassword('');
    setError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <SEO
        title="AdminPage – Maidenhead Town Bowls Club"
        description="Provides access to the Administration features"
      />

      {!isAuthenticated ? (
        <div className="bg-gray-200 p-6 rounded-xl shadow-md w-full max-w-md">
          <h2 className="text-xl font-semibold mb-4">Admin Login</h2>

          {error && <p className="text-red-500 mb-3">{error}</p>}

          <div className="mb-4">
            <label className="block mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>

          <button
            onClick={checkPassword}
            disabled={refData.length === 0}
            className={`px-4 py-2 rounded text-white ${
              refData.length === 0
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            Login
          </button>
        </div>
      ) : (
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Welcome, {adminName || 'Admin'}!</h2>

          <Link
            to="/maintainRefData"
            state={{ skipAuth: true, adminName }}
            className="block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Maintain Data
          </Link>

          <Link
            to="/maintainEvent"
            state={{ skipAuth: true, adminName }}
            className="block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Maintain Event
          </Link>

          <button
            onClick={logout}
            className="block bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
          >
            Logout
          </button>

          <button
            onClick={handleClearStorage}
            className="block bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Clear Stored Data
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
