// src/components/PageLayout.jsx
import React from 'react';

const PageLayout = ({ children }) => {
  return (
    <div
      className="min-h-screen bg-cover bg-center text-black"
      style={{ backgroundImage: "url('/backgrounds/grass.jpg')" }} // <-- Update path to your actual image
    >
      <div className="bg-white/90 max-w-5xl mx-auto px-4 py-8 shadow-lg">
        {children}
      </div>
    </div>
  );
};

export default PageLayout;
