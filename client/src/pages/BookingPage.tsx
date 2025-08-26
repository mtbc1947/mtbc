import React from 'react';
import SEO from '../components/SEO';

const BookingPage: React.FC = () => {
  return (
    // Outer container: now takes up full height and centers content
    <div className="flex items-center justify-center min-h-full w-full py-4 px-25 text-black">
      <SEO
        title="BookingPage – Maidenhead Town Bowls Club"
        description="Provides a link to the Booking facility provided by BowlR"
      />
      {/* Inner container: the rectangle that holds the content */}
      <div className="bg-white/70 rounded-2xl shadow-md p-10 text-center flex flex-col items-center w-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Link to BowlR</h1>
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full inline-block"
        >
          Home
        </a>
      </div>
    </div>
  );
};

export default BookingPage;