import React from 'react';
import SEO from '../components/SEO';

const BookingPage: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <SEO
        title="BookingPage – Maidenhead Town Bowls Club"
        description="Provides a link to the Booking facility provided by BowlR"
      />
      <div className="bg-gray-200 rounded-2xl shadow-md p-10 text-center">
        <h1 className="text-2xl font-bold text-gray-800">Link to BowlR</h1>
      </div>
    </div>
  );
};

export default BookingPage;
