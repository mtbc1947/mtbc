import React, { useState, useEffect } from 'react';
import { Link, useLocation, Location } from 'react-router-dom';
import { SEO } from 'components';

import { getAllReferenceData } from 'utilities';

interface LocationState {
  error?: string;
}

const AdminPage: React.FC = () => {
  const location = useLocation();
  const state = location.state as LocationState | undefined;

  const [name, setName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (state?.error) {
      setError(state.error);
    }
  }, [state]);

  const checkPassword = () => {
    const VALID_PASSWORD = 'kathy'; // TODO: Replace with your real backend check
    if (password === VALID_PASSWORD) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Incorrect password');
    }
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
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Login
          </button>
        </div>
      ) : (
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-6">Welcome, {name}!</h2>
          <div className="space-y-4">
            <Link
              to="/maintainData"
              state={{ adminName: name }}
              className="block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Maintain Data
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
