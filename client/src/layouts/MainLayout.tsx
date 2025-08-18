// MainLayout.tsx
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

interface MainLayoutProps {
  backgroundImage?: string;
  centerContent?: boolean;
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ backgroundImage, centerContent = false, children }) => {
  return (
    <div className="relative text-black min-h-screen flex flex-col">
      {/* Background Image */}
      {backgroundImage && (
        <div
          className="absolute inset-0 bg-center bg-no-repeat -z-10"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            opacity: 0.6,
          }}
        />
      )}

      {/* Main Content Wrapper */}
      <Navbar />
      
      <main
        className={`
          relative z-10
          ${centerContent
            ? 'flex items-center justify-center min-h-[calc(100vh-64px-64px)]'
            : 'px-4 py-6 sm:px-6 sm:py-8'}
        `}
      >
        {children}
      </main>

      <Footer />
    </div>
  );
};

export default MainLayout;
