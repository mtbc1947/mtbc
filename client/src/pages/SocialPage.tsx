import React, { useEffect, useState } from "react";
import SEO from '../components/SEO';
import { getReferenceValuesByPage } from '../utilities';

import clubFront from '../assets/club_front.jpg';
import green1 from '../assets/green1.jpg';

const SocialPage: React.FC = () => {
  const [strings, setStrings] = useState<string[]>([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const data: string[] = await getReferenceValuesByPage("Social");
        setStrings(data);
      } catch (error) {
        console.error("Failed to fetch reference values:", error);
      }
    };
    getData();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <SEO
        title="SocialPage – Maidenhead Town Bowls Club"
        description="A description of the Social events that the club holds each week."
      />
      <div className="bg-gray-200 rounded-2xl shadow-md p-8 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4 text-center">Social Page</h2>
        <ul className="space-y-3">
          {strings.map((link, index) => (
            <li key={index} className="flex justify-between">
              <span className="text-blue-600 underline">{link}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SocialPage;
