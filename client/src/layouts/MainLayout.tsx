import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

import mainBackground from '../assets/green1.jpg';

const MainLayout: React.FC = () => {

  return (
    <div className="relative min-h-screen flex flex-col text-black">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${mainBackground})`,
          backgroundSize: '170%', // smaller zoom than bg-cover
          opacity: 0.6, 
        }}
      />

      {/* Main Content: flex column with Navbar, Outlet fills space, Footer at bottom */}
      <div className="relative z-10 flex flex-col flex-1 min-h-screen">
        <Navbar />

        {/* Main content area fills the remaining space */}
        <main className="flex-grow">
          <Outlet />
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default MainLayout;
