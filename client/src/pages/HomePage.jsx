import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

import homeBackground from '../assets/Home_2.jpg';
import openDayImage from '../assets/OpenDay.jpg';
import janYoneko from '../assets/jan_yoneko.jpg';

const HomePage = () => {
  const navigate = useNavigate();
  const wOpeningTime = "10:00am";
  const wOpeningDays = " 7 days a week";
  const wGreenFees = "no green fees";
  const wOpenDayMkr = false;

  const handleImageButtonClick = () => {
    navigate('/openDay');
  };

  return (
    <div
      className="w-full flex-grow bg-cover bg-center p-6 text-black"
      style={{ backgroundImage: `url(${homeBackground})` }}
    >     
      {/* Top: Welcome Row */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 mb-8">
        <h1 className="text-3xl font-bold text-black">Welcome to Our Club</h1>
        <p className="text-lg md:text-right text-black">
          Founded 1942 Affiliated to Bowls England and RCBBA
        </p>
      </div>

      {/* Content Box */}
      <div className="relative rounded-2xl p-6 shadow-lg
       flex flex-col md:flex-row items-center md:items-start gap-6"
        style={{ backgroundColor: 'rgba(243, 244, 246, 0.7)' }} // 30% opacity
      >
        
        {/* 🎯 Animated Image Button (if shown) */}
        {wOpenDayMkr && (
          <motion.button
            onClick={handleImageButtonClick}
            initial={{ opacity: 0, x: typeof window !== 'undefined' ? window.innerWidth : 500,  rotate: 90 }}
            animate={{ opacity: 1, x: 0, y: -80, rotate: 330 }}
            transition={{ duration: 2.0, ease: 'easeOut' }}
            className="absolute -top-4 -left-4 w-40 h-30 z-10 focus:outline-none"
            aria-label="Open Day Button"
          >
            <img
              src={openDayImage}
              alt="Open Day"
              className="w-full h-full object-contain"
            />
          </motion.button>
        )}

        {/* Text Content */}
        <div className="flex-1 text-black text-[18px] leading-relaxed">
          <p className="">
            Maidenhead Town Bowls Club is situated in quiet parkland in Oaken Grove Park,
            with the benefit of ample free parking. We are a friendly, sociable club,
            where visitors and new members can be assured of a warm welcome.
            A number of social events are held during the season, including BBQ’s,
            Race Nights, Quizzes and a Club Night each week where all members are
            encouraged to bowl and partake of Fish and Chips or other culinary delights.
          </p>
          <br/>
          <div className="flex flex-row">
            <div>
              <p className="">
                We have a large Club House with a well stocked bar and a kitchen where coffee
                and tea can be prepared at any time.  The kitchen also caters for some of our
                  home games and loan events,  by providing a much acclaimed two-course meal.
              </p>
              <br/>
              <p>
                The Green is enclosed by a beech hedge providing privacy and shelter from
                the elements.​ Amongst the pretty gardens around the Green are ample viewing
                  areas and if the weather is a bit chilly a very nice comfy seating area
                  inside, where a drink can be enjoyed from the bar or coffee/tea from the kitchen.
              </p>
              <br/>
            </div>
            <img
              src={janYoneko}
              alt="Visual 2"
              className="w-40 h-40 object-cover rounded-lg shadow-md hidden md:block"
            />
          </div>
          <p>
            The greens are open from {wOpeningTime},{wOpeningDays}, until dusk,
             and Members are welcome to come along for a roll-up and use the
              Green whenever it is available, with {wGreenFees}.          
          </p>
        </div>

      </div>
    </div>
  );
};

export default HomePage;
