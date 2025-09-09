import React, { useEffect, useState }  from 'react';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';

import { getRefDataValuesByPage } from 'utilities';

import img003 from "../assets/img003.jpg";

const OpenDayPage: React.FC = () => {
  const [strings, setStrings] = useState<string[]>([]);

  useEffect(() => {
    const getData = async () => {
      const data = await getRefDataValuesByPage("OpenDay");
      // Assume data is string[]
      setStrings(data as string[]);
    };
    getData();
  }, []);

  // Safely access strings with fallback empty strings
console.log(strings);
  const openDate = strings[1] ?? "";
  const startTime = strings[4] ?? "";
  const endTime = strings[0] ?? "";


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
          <div className="flex-1 flex flex-col justify-center ml-2 gap-2">
            <h1 className="text-3xl font-bold mb-2">Open Day 2025</h1>
<div className="grid grid-cols-[auto_1fr] gap-x-2 text-lg items-center">

              <div className="font-semibold">Where:</div>
              <div>Maidenhead Town Bowls Club</div>

              <div className="font-semibold">Date:</div>
              <div>{openDate}</div>

              <div className="font-semibold">Time:</div>
              <div>{startTime} to {endTime}</div>
            </div>
          </div>

          {/* Right side: animated image */}
          <div className="flex-1 flex justify-end items-center mr-2">
            <motion.img
              src={img003}
              alt="Open Day"
              className="object-cover rounded-lg shadow-md bg-transparent"
              style={{ maxHeight: '200px', width: 'auto' }}
              initial={{ opacity: 0, scale: 0.2, rotate: 360 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Bottom half: 75% height, centered text */}
        <div
          className="border-t border-gray-300 pt-4 text-center flex-1"
          style={{ flexBasis: '75%' }}
        >
          <p className="text-base leading-loose">
            We invite you to come along and give Bowls a try.<br />
            We will provide the bowls and a member of the club will guide you through the basics of the game.<br />
            <span className="text-red-600">(We do ask that you wear flat bottom shoes, trainers are fine)</span><br />
            Have a look around the club, chat to our members and get a feel for the place.<br />
            Bowls is a great game to play at all ages. You can enjoy it from day one just by playing with other members of the club, but you can take it
            to County or even National level if you wish.<br />
            Bowls is also a great way to meet people and we believe the social aspect of the sport to be very important.<br />
            We would love to see you on. Free Tea/Coffee and biscuits will be available. The bar will be open.<br />
            So come along and meet us and try your hand at bowls.<br />
            The Bowls Club is situated in Oaken Grove Recreation Park, car parking is available via the Oaken Grove entrance.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OpenDayPage;
