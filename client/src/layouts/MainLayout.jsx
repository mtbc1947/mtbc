import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const MainLayout = () => {
  const [isDimmed, setIsDimmed] = useState(true);

  const toggleBrightness = () => {
    setIsDimmed((prev) => !prev);
  };

  return (
    <div className="relative min-h-screen flex flex-col text-black">
      {/* Background Image */}
      <div
        className={`absolute inset-0 bg-[url('/green1.jpg')] bg-cover bg-center z-0`}
      />

      {/* Optional Dark Overlay */}
      {isDimmed && (
        <div className="absolute inset-0 bg-black/25 z-0 transition-opacity duration-300" />
      )}

      {/* Main Content: flex column with Navbar, Outlet fills space, Footer at bottom */}
      <div className="relative z-10 flex flex-col flex-1 min-h-screen">
        <Navbar />

        {/* Main content area fills the remaining space */}
        <main className="flex-grow">
          <Outlet />
        </main>

        <Footer  isDimmed={isDimmed} toggleBrightness={toggleBrightness} />
      </div>
    </div>
  );
};

export default MainLayout;
