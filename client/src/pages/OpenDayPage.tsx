import React from 'react';
import SEO from '../components/SEO';
import img003 from "../assets/img003.jpg";

const OpenDayPage: React.FC = () => {
  return (
    <div className="w-full">
      <SEO
        title="OpenDayPage – Maidenhead Town Bowls Club"
        description="Advertisement for a club Open Day"
      />

      {/* Grey rounded rectangle with small top margin and reduced padding */}
      <div
        className="bg-gray-200 rounded-2xl shadow-lg max-w-4xl w-full mx-auto flex flex-col mt-4 px-4 py-4"
        style={{ minHeight: '75vh' }}
      >
        
        {/* Top half: 25% height, text left, image right with margins */}
        <div
          className="flex flex-col md:flex-row justify-between items-center mb-4"
          style={{ flexBasis: '25%' }}
        >
          {/* Left side: text */}
          <div className="flex-1 flex flex-coljustify-center ml-2">
            <h1 className="text-3xl font-bold mb-2">Open Day 2025</h1>
            <p className="text-lg mb-1"><strong>Where:</strong> Maidenhead Town Bowls Club</p>
            <p className="text-lg"><strong>Date:</strong> Saturday 14th September 2025</p>
          </div>

          {/* Right side: image */}
          <div className="flex-1 flex justify-end items-center mr-2">
            <img
              src={img003}
              alt="Open Day"
              className="object-cover rounded-lg shadow-md bg-transparent"
              style={{ maxHeight: '200px', width: 'auto' }}
            />
          </div>
        </div>

        {/* Bottom half: 75% height, centered text, increased line spacing */}
        <div
          className="border-t border-gray-300 pt-4 text-center flex-1"
          style={{ flexBasis: '75%' }}
        >
          <p className="text-base leading-loose">
            We invite you to come along and give Bowls a try.<br/>
            We will provide the bowls and a member of the club will guide you through the basics of the game.<br/>
            <span className="text-red-600">(We do ask that you wear flat bottom shoes, trainers are fine)</span><br/>
            Have a look around the club, chat to our members and get a feel for the place.<br/>
            Bowls is a great game to play at all ages. You can enjoy it from day one just by playing with other members of the club, but you can take it 
            to County or even National level if you wish.<br/>
            Bowls is also a great way to meet people and we believe the social aspect of the sport to be very important.<br/>
            We would love to see you on. Free Tea/Coffee and biscuits will be available. The bar will be open.<br/>
            So come along and meet us and try your hand at bowls.<br/>
            The Bowls Club is situated in Oaken Grove Recreation Park, car parking is available via the Oaken Grove entrance.
          </p>
        </div>

      </div>
    </div>
  );
};

export default OpenDayPage;
