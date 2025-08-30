import React, { useState, ChangeEvent } from 'react';
import PageLayout from '../layouts/PageLayout';
import SEO from '../components/SEO';

type Officer = {
  role: string;
  name: string;
};

type OfficersData = {
  [committee: string]: Officer[];
};

const officersData: OfficersData = {
  Management: [
    { role: 'President', name: 'Kathy Wells' },
    { role: 'Chairperson', name: 'Tim Eales' },
    { role: 'Club Secretary', name: 'Lesley Monaghan' },
    { role: 'Club Treasurer', name: 'Christine Rogers' },
    { role: 'Green Ranger', name: 'Vacant' },
  ],
  Mens: [
    { role: "Men's Captain", name: 'Tim Eales' },
    { role: 'Fixture Secretary', name: 'Carol Van Noorden' },
  ],
  Ladies: [
    { role: "Ladies' Captain", name: 'Kim Eales' },
  ],
  Social: [
    { role: 'Catering Coordinator', name: 'Julie Beal' },
    { role: 'Social Team Representative', name: 'Ann Roberts' },
  ],
  Others: [
    { role: 'Maintenance Manager', name: 'Tony Stuart' },
  ],
};

const OfficersPage: React.FC = () => {
  const [selectedCommittee, setSelectedCommittee] = useState<keyof OfficersData>('Management');

  const handleCommitteeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedCommittee(e.target.value as keyof OfficersData);
  };

  return (
    <PageLayout>
      <div className="flex flex-col items-center space-y-4">
        <SEO
          title="OfficersPage – Maidenhead Town Bowls Club"
          description="Shows the members who hold elected positions within the club"
        />
        <h1 className="text-2xl font-bold">Club Officers</h1>

        <select
          className="border border-gray-300 rounded px-4 py-2 bg-white shadow"
          value={selectedCommittee}
          onChange={handleCommitteeChange}
        >
          {Object.keys(officersData).map((committee) => (
            <option key={committee} value={committee}>
              {committee}
            </option>
          ))}
        </select>

        <div className="w-full max-w-xl mt-6 bg-white/90 rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-4 text-center">{selectedCommittee} Committee</h2>
          <ul className="space-y-2">
            {officersData[selectedCommittee].map((officer) => (
              <li key={officer.role} className="flex justify-between border-b pb-1">
                <span>{officer.role}</span>
                <span>{officer.name}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </PageLayout>
  );
};

export default OfficersPage;
