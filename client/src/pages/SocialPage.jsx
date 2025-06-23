import React from "react";
import { useEffect, useState } from 'react';
import { getReferenceData } from "../utils/getReferenceData.js";

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
    <div className=''>SocialPage</div>
  )
}

export default SocialPage