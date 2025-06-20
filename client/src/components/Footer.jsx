import React from 'react';
import { FiSun, FiMoon } from 'react-icons/fi';
import { FaFacebookF } from 'react-icons/fa';

const Footer = ({ isDimmed, toggleBrightness }) => {
  const wYear = new Date().getFullYear();

  return (
    <footer className="p-4 text-white bg-amber-300 shadow-t">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Left */}
        <div className="text-left w-full sm:w-1/3">
          © Maidenhead Town Bowls Club {wYear}
        </div>

        {/* Center */}
        <div className="w-full sm:w-1/3 flex justify-center">
          <button
            onClick={toggleBrightness}
            className="p-2 rounded-full bg-black text-white hover:bg-gray-800 transition"
            aria-label="Toggle background brightness"
          >
            {isDimmed ? <FiSun size={20} /> : <FiMoon size={20} />}
          </button>
        </div>

        {/* Right */}
        <div className="text-right w-full sm:w-1/3 flex justify-end">
          <a
            href="https://www.facebook.com/maidenheadtownbowlsclub/?locale=en_GB"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook page"
            className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition inline-flex items-center justify-center"
          >
            <FaFacebookF size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
