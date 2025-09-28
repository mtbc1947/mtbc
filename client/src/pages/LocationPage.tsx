import React from 'react';
import SEO from '../components/SEO';

const LocationPage: React.FC = () => {
  return (
    <div
      className="max-w-6xl mx-auto px-4 py-12 grid md:grid-cols-2 gap-8 relative rounded-lg overflow-hidden bg-white bg-opacity-70"
    >
      <SEO
        title="LocationPage – Maidenhead Town Bowls Club"
        description="Map showing location of the club and directions on how to get there"
      />

      {/* Left Column */}
      <div className="relative space-y-8 text-black z-10">
        {/* Club Info */}
        <div>
          <h2 className="text-2xl font-bold mb-2">Maidenhead Town Bowling Club</h2>
          <address className="not-italic text-base">
            Oaken Grove Recreation Park<br/>
            Oaken  Grove<br />
            Maidenhead<br />
            SL6 6HL
          </address>
        </div>

        {/* Getting There */}
        <div>
          <h2 className="text-xl font-bold mb-2">Getting There</h2>
          <p className="text-base">
            The main entrance to Oaken Grove Park is from Oaken Grove. There
            is ample public parking there, both inside the park, and in the
            entrance road from Oaken Grove. There is an alternative entrance to the park 
            with car parking from Courthouse Rd.
          </p>
        </div>
      </div>

      {/* Right Column – Google Map */}
      <div className="relative w-full h-96 md:h-[300px] lg:h-[500px] rounded shadow-lg overflow-hidden z-10">
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