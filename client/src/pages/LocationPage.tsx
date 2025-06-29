import React from 'react';
import SEO from '../components/SEO';

import locationBackground from '../assets/green1.jpg';

const LocationPage: React.FC = () => {
  return (
    <div
      className="max-w-6xl mx-auto px-4 py-12 grid md:grid-cols-2 gap-8 relative rounded-lg overflow-hidden"
      style={{ backgroundImage: `url(${locationBackground})` }}
    >
      {/* Background overlay for readability */}
      <div className="absolute inset-0 bg-black opacity-30 pointer-events-none"></div>

      <SEO
        title="LocationPage – Maidenhead Town Bowls Club"
        description="Map showing location of the club and directions on how to get there"
      />

      {/* Left Column */}
      <div className="relative space-y-8 text-white z-10">
        {/* Club Info */}
        <div>
          <h2 className="text-2xl font-bold mb-2">Maidenhead Town Bowling Club</h2>
          <address className="not-italic text-base">
            Braywick Park<br />
            Braywick Road<br />
            Maidenhead<br />
            SL6 1BN
          </address>
          <p className="mt-4">
            <strong>Email:</strong>{' '}
            <a
              href="mailto:info@maidenheadtownbc.co.uk"
              className="text-blue-300 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-300 rounded"
            >
              info@maidenheadtownbc.co.uk
            </a>
            <br />
            <strong>Phone:</strong>{' '}
            <a
              href="tel:+441628123456"
              className="text-blue-300 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-300 rounded"
            >
              01628 123456
            </a>
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
      <div className="relative w-full h-96 md:h-auto rounded shadow-lg overflow-hidden z-10">
        <iframe
          title="Maidenhead Town Bowling Club location map"
          src="https://www.google.com/maps?q=Maidenhead+Town+Bowls+CLub+SL6+1BN&output=embed"
          className="w-full h-full border-0"
          loading="lazy"
          aria-label="Google map showing Maidenhead Town Bowling Club location"
          allowFullScreen
        />
      </div>
    </div>
  );
};

export default LocationPage;
