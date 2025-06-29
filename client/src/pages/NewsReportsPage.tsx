import React from 'react';
import SEO from '../components/SEO';

const NewsReportsPage: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <SEO
        title="NewsReportsPage – Maidenhead Town Bowls Club"
        description="List of the news reports submitted to the local press"
      />
      <div className="bg-gray-200 rounded-2xl shadow-md p-10 text-center">
        <h1 className="text-2xl font-bold text-gray-800">News Reports</h1>
      </div>
    </div>
  );
};

export default NewsReportsPage;
