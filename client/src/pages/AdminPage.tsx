import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SEO } from 'components';
import { getAllReferenceData, ReferenceRecord } from 'utilities';

interface LocationState {
  error?: string;
  skipAuth?: boolean;
  adminName?: string;
}

const AdminPage: React.FC = () => {
  const location = useLocation();
  const state = location.state as LocationState | undefined;

  const [name, setName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [referenceData, setReferenceData] = useState<ReferenceRecord[]>([]);
  const [websiteOptions, setWebsiteOptions] = useState<string[]>([]);

  // Load reference data
  useEffect(() => {
    const storedData = localStorage.getItem('referenceData');
    if (storedData) {
      const parsedData: ReferenceRecord[] = JSON.parse(storedData);
      setReferenceData(parsedData);
      const options = Array.from(new Set(parsedData.map(item => item.webPage))).sort();
      setWebsiteOptions(options);
    } else {
      const getData = async () => {
        const data = await getAllReferenceData();
        setReferenceData(data);
        localStorage.setItem('referenceData', JSON.stringify(data));
        const options = Array.from(new Set(data.map(item => item.webPage))).sort();
        setWebsiteOptions(options);
        localStorage.setItem('websiteOptions', JSON.stringify(options));
      };
      getData();
    }
  }, []);

  // Handle errors
  useEffect(() => {
    if (state?.error) {
      setError(state.error);
    }
  }, [state]);

  // Skip auth if flag is set
  useEffect(() => {
    if (state?.skipAuth && referenceData.length > 0) {
      const refItem = referenceData.find(item => item.refKey === "SD035");
      if (refItem) {
        setIsAuthenticated(true);
        setName(state.adminName || "Admin");
        setError('');
      }
    }
  }, [state, referenceData]);

  const checkPassword = () => {
    if (referenceData.length === 0) {
      setError("System not ready. Try again shortly.");
      return;
    }

    const refItem = referenceData.find(item => item.refKey === "SD035");
    const VALID_TOKEN = refItem?.value ?? "";

    if (password === VALID_TOKEN) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Incorrect password');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword('');
    setError('');
  };

  const handleClearStorage = () => {
    localStorage.removeItem('referenceData');
    localStorage.removeItem('websiteOptions');
    setReferenceData([]);
    setWebsiteOptions([]);
    setIsAuthenticated(false);
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
            disabled={referenceData.length === 0}
            className={`px-4 py-2 rounded text-white ${
              referenceData.length === 0
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            Login
          </button>
        </div>
      ) : (
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Welcome, {name}!</h2>

          <Link
            to="/maintainData"
            state={{ adminName: name }}
            className="block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Maintain Data
          </Link>

          <Link
            to="/maintainEvent"
            state={{ adminName: name }}
            className="block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Maintain Event
          </Link>

          <button
            onClick={handleLogout}
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
