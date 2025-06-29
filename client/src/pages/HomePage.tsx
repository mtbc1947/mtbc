import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';

import { getReferenceValuesByPage } from '../utilities';

import homeBackground from '../assets/Home_2.jpg';
import openDayImage from '../assets/OpenDay.jpg';
import janYoneko from '../assets/jan_yoneko.jpg';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [strings, setStrings] = useState<string[]>([]);

  useEffect(() => {
    const getData = async () => {
      const data = await getReferenceValuesByPage("Home");
      setStrings(data);
    };
    getData();
  }, []);

  const wOpenHours = strings[0] || "MISSING"; // e.g., "10:00am"
  const wOpenDays = strings[1] || "MISSING"; // e.g., "7 days a week"
  const wGreenFees = strings[2] || "MISSING"; // e.g., "no green fees"
  const wOpenDay = strings[3] || "N"; // "Y" or "N"
  const wOpenDayMkr = wOpenDay === "Y";

  const handleImageButtonClick = () => {
    navigate('/openDay');
  };

  return (
    <div
      className="w-full flex-grow bg-cover bg-center p-6 text-black min-h-screen"
      style={{ backgroundImage: `url(${homeBackground})` }}
    >
      <SEO
        title="HomePage – Maidenhead Town Bowls Club"
        description="The club web site's home page"
      />
      {/* Top: Welcome Row */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 mb-8">
        <h1 className="text-3xl font-bold text-black">Welcome to Our Club</h1>
        <p className="text-lg md:text-right text-black">
          Founded 1942 Affiliated to Bowls England and RCBBA
        </p>
      </header>

      {/* Content Box */}
      <section
        className="relative rounded-2xl p-6 shadow-lg flex flex-col md:flex-row items-center md:items-start gap-6"
        style={{ backgroundColor: 'rgba(243, 244, 246, 0.7)' }} // ~30% opacity
      >
        {/* Animated Open Day Button */}
        {wOpenDayMkr && (
          <motion.button
            onClick={handleImageButtonClick}
            initial={{ opacity: 0, x: typeof window !== 'undefined' ? window.innerWidth : 500, rotate: 90 }}
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
        <article className="flex-1 text-black text-[18px] leading-relaxed">
          <p>
            Maidenhead Town Bowls Club is situated in quiet parkland in Oaken Grove Park,
            with the benefit of ample free parking. We are a friendly, sociable club,
            where visitors and new members can be assured of a warm welcome.
            A number of social events are held during the season, including BBQs,
            Race Nights, Quizzes and a Club Night each week where all members are
            encouraged to bowl and partake of Fish and Chips or other culinary delights.
          </p>
          <br />
          <div className="flex flex-col md:flex-row gap-4">
            <div>
              <p>
                We have a large Club House with a well stocked bar and a kitchen where coffee
                and tea can be prepared at any time. The kitchen also caters for some of our
                home games and loan events, by providing a much acclaimed two-course meal.
              </p>
              <br />
              <p>
                The Green is enclosed by a beech hedge providing privacy and shelter from
                the elements.​ Amongst the pretty gardens around the Green are ample viewing
                areas and if the weather is a bit chilly a very nice comfy seating area
                inside, where a drink can be enjoyed from the bar or coffee/tea from the kitchen.
              </p>
              <br />
            </div>
            <img
              src={janYoneko}
              alt="Club grounds and pavilion"
              className="w-40 h-40 object-cover rounded-lg shadow-md hidden md:block"
            />
          </div>
          <p>
            The greens are open from {wOpenHours}, {wOpenDays}, until dusk,
            and Members are welcome to come along for a roll-up and use the
            Green whenever it is available, with {wGreenFees}.
          </p>
        </article>
      </section>
    </div>
  );
};

export default HomePage;
