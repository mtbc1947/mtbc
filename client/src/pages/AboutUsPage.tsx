import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SEO from '../components/SEO';
import { getReferenceValuesByPage } from '../utilities';

import clubFront from '../assets/club_front.jpg';
import club from '../assets/match1.jpg';

const AboutUsPage: React.FC = () => {
  const wYear = new Date().getFullYear();

  // Define the type of the strings array elements
  const [strings, setStrings] = useState<string[]>([]);

  useEffect(() => {
    const getData = async () => {
      const data = await getReferenceValuesByPage("AboutUs");
      // Assume data is string[]
      setStrings(data as string[]);
    };
    getData();
  }, []);

  // Safely access strings with fallback empty strings
  const wFullFee = strings[0] ?? "";
  const wJoiningFee = strings[1] ?? "";
  const wSocialFee = strings[2] ?? "";
  const wRollUpFee = strings[3] ?? "";
  const wCompFee = strings[4] ?? "";
  const wMatchFee = strings[5] ?? "";

  return (
    <div
      className="bg-cover bg-center min-h-screen p-6 md:p-16 text-black font-sans"
      style={{ backgroundImage: `url(${clubFront})` }}
    >
      <SEO
        title="About Us – Maidenhead Town Bowls Club"
        description="Some background information about our bowls club."
      />

      <div className="bg-white/70 p-6 md:p-10 rounded-md shadow-lg max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">MAIDENHEAD TOWN BOWLS CLUB</h1>
        <p className="mb-4">
          MAIDENHEAD TOWN BOWLS CLUB prides itself on making new members
          welcome and encourages them in every way possible. For complete
          beginners Coaching sessions are organised at the beginning of the
          season and new bowlers have their own tournament towards end of the
          season. We have several organised roll-up sessions during the week
          and again during our club night on Friday. You are free to roll-up
          any time convenient to yourself.
        </p>

        <p className="mb-4">
          Everyone is encouraged to play in the interclub Friendly Matches
          which take place most Saturday/Sunday afternoons, and occasionally
          midweek. Whether you are new or experienced, these matches and our
          Club roll-up sessions will enable you to meet and get to know many of
          our existing club members and greatly enhance the enjoyment of being
          part of Maidenhead Town Bowls Club.
        </p>

        <p className="mb-4">
          Additionally, we have two men’s teams who play in the Kennet League
          in the evenings, and four teams in the County over 55 league in the
          afternoons. Our ladies play in the Thames Valley League, in which we
          have two teams, and the Royal Shield.
        </p>

        <p className="mb-4">
          We compete in all the County Competitions and have a very successful
          record.
        </p>

        <p className="mb-4 font-semibold">Whatever your ability – there is something for everyone!</p>

        <h2 className="text-xl font-bold mt-8 mb-2">MEMBERSHIP FEE</h2>
        <p className="mb-2">Our Full Membership Fee for {wYear} is £{wFullFee} with {wJoiningFee}, the Social Membership fee for {wYear} is £{wSocialFee}.</p>
        <p className="mb-2">Use of the green for Roll Ups and Club Competitions are {wRollUpFee}.</p>
        <p className="mb-2">There is a fee of £{wCompFee} for each Club Competition entered.</p>
        <p className="mb-2">There is a match fee of £{wMatchFee} for interclub matches to cover the cost of the snack provided at the end of the game. If a meal is provided the charge may be higher.</p>

        <h2 className="text-xl font-bold mt-8 mb-2">SOCIAL EVENTS</h2>
        <p className="mb-4">
          As well as the competitive side of the club, we also pride ourselves
          on our informality and we hold a number of events each week to
          encourage this aspect.{" "}
          <Link to="/social" className="text-blue-700 underline">Click here</Link> for more details of these events.
        </p>

        <h2 className="text-xl font-bold mt-8 mb-2">DATA PRIVACY</h2>
        <p className="mb-4">
          This site uses cookies as well as holding some information on its
          members. To view the club's privacy policy,{" "}
          <Link to="/privacy" className="text-blue-700 underline">click here</Link>.
        </p>

        <h2 className="text-xl font-bold mt-8 mb-2">APPLICATION FORM</h2>
        <p className="mb-4">
          If you would like to join, a Membership Application Form is available
          on request from our Club Secretary or if you would like to have a
          chat first, please use the <Link to="/contactUs" className="text-blue-700 underline">Contact Form</Link> to get someone to contact
          you or email the club <a href="mailto:maidenheadtownbc@gmail.com" className="text-blue-700 underline">maidenheadtownbc@gmail.com</a>
        </p>

        <div className="mt-6 flex justify-center">
          <img
            src={club}
            alt="club"
            className="rounded shadow-md max-w-xs md:max-w-md w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default AboutUsPage;
