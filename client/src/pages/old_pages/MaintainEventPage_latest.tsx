import React from 'react';
import MaintainPageLayout from '../layouts/MaintainPageLayout';
import PaginatedList from '../components/PaginatedList';
import backgroundImage from '../assets/green1.jpg';


// Define the data structure for an event
interface Event {
  id: number;
  name: string;
  date: string;
}

const MaintainEventPage: React.FC = () => {
  // Mock data for events, typed as Event[]
  const events: Event[] = Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    name: `Event ${i + 1}`,
    date: new Date(2025, 10, i + 1).toLocaleDateString(),
  }));

  const renderEventItem = (event: Event) => (
    <div className="flex justify-between w-full">
      <span className="font-medium">{event.name}</span>
      <span className="text-gray-500">{event.date}</span>
    </div>
  );

  const filterComponent = (
    <div>
      <input
        type="text"
        placeholder="Filter events..."
        className="w-full p-2 border border-gray-300 rounded-md"
      />
    </div>
  );

  const listComponent = <PaginatedList items={events} renderItem={renderEventItem} />;

  const commandComponent = (
    <>
      <div className="w-1/4 pl-6">
        <div className="border rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-4">Live Event Maintenance</h2>
          <button className="bg-teal-200 rounded-full px-5 py-2 mb-6 hover:bg-teal-300">
            Create
          </button>
          <div className="mb-2">Go to:</div>
          <button className="bg-teal-200 rounded-full px-5 py-2 hover:bg-teal-300">
            Menu
          </button>
        </div>
      </div>
    </>
  );

  return (
    <MaintainPageLayout
      backgroundImage={backgroundImage as string}
      filter={filterComponent}
      list={listComponent}
      commands={commandComponent}
    />
  );
};

export default MaintainEventPage;