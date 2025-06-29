import React from 'react';
import SEO from '../components/SEO';

const NoticeBoardPage: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <SEO
        title="NoticeBoardPage – Maidenhead Town Bowls Club"
        description="A list of the notices published on the club's noticeboard"
      />
      <div className="bg-gray-200 rounded-2xl shadow-md p-10 text-center">
        <h1 className="text-2xl font-bold text-gray-800">Noticeboard Page</h1>
      </div>
    </div>
  );
};

export default NoticeBoardPage;
