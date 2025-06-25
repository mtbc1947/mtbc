import React from 'react';

import locationBackground from '../assets/green1.jpg';

const LocationPage = () => {
  return (
    <div 
      className="max-w-6xl mx-auto px-4 py-8 grid md:grid-cols-2 gap-8"
      style={{ backgroundImage: `url(${locationBackground})` }}
    >
      {/* Left Column */}
      <div className="space-y-8">
        {/* Club Info */}
        <div>
          <h2 className="text-2xl font-bold mb-2">Maidenhead Town Bowling Club</h2>
          <p className="text-base">
            Braywick Park<br />
            Braywick Road<br />
            Maidenhead<br />
            SL6 1BN
          </p>
          <p className="mt-4">
            <strong>Email:</strong> <a href="mailto:info@maidenheadtownbc.co.uk" className="text-blue-600 hover:underline">info@maidenheadtownbc.co.uk</a><br />
            <strong>Phone:</strong> <a href="tel:+441628123456" className="text-blue-600 hover:underline">01628 123456</a>
          </p>
        </div>

        {/* Getting There */}
        <div>
          <h2 className="text-xl font-bold mb-2">Getting There</h2>
          <p className="text-base">
            The club is located in Braywick Park, a short drive from Maidenhead town centre.
            Free parking is available on-site. The entrance is beside the Magnet Leisure Centre,
            and the bowling club is signposted. It’s also a 10–15 minute walk from Maidenhead train station.
          </p>
        </div>
      </div>

      {/* Right Column – Google Map */}
      <div className="w-full h-96 md:h-auto">
        <iframe
          title="Maidenhead Town Bowling Club"
          src="https://www.google.com/maps?q=Maidenhead+Town+Bowls+CLub+SL6+1BN&output=embed"
          className="w-full h-full rounded shadow-md"
          loading="lazy"
          allowFullScreen
        >
        </iframe>
      </div>
    </div>
  );
};

export default LocationPage;
