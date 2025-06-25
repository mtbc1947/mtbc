// src/components/PageLayout.jsx
import React from 'react';

import pageBackground from '../assets/green1.jpg';

const PageLayout = ({ children }) => {
  return (
    <div
      className="min-h-screen bg-cover bg-center text-black"
        style={{ backgroundImage: `url(${pageBackground})` }}
    >
      <div className="bg-white/90 max-w-5xl mx-auto px-4 py-8 shadow-lg">
        {children}
      </div>
    </div>
  );
};

export default PageLayout;
