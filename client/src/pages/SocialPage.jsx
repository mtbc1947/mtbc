import React from "react";
import { useEffect, useState } from 'react';
import { getReferenceData } from "../utils/getReferenceData.js";

import clubFront from '../assets/club_front.jpg';
import green1 from '../assets/green1.jpg';


const SocialPage = () => {
  const [strings, setStrings] = useState([]);
  
  useEffect(() => {
    const getData = async () => {
      const data = await getReferenceData("Social");
      // @ts-ignore
      setStrings(data);
    };
    getData();
  }, []);

  console.log("Strings");
  console.log(strings);
  /**
  const wFullFee = strings[0] || "";
  const wJoiningFee = strings[1] || "";
  const wSocialFee = strings[2] || "";
  const wRollUpFee = strings[3] || "";
  const wCompFee = strings[4]  || "";
  const wMatchFee = strings[5] || "";
  */

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
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
}

export default SocialPage