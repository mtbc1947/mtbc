import React from "react";

const HistoryPage = () => {
  return (
    <div className="bg-[url('/grass.jpg')] bg-cover bg-center min-h-screen p-6 md:p-16 text-black font-sans">
      <div className="bg-white/80 p-6 md:p-10 rounded-md shadow-lg max-w-5xl mx-auto">
        <div className="flex justify-center mb-6">
          <img
            src="/images/history_trophies.jpg"
            alt="Trophies and Honour Board"
            className="rounded shadow-md max-w-full h-auto"
          />
        </div>

        <p className="mb-4">
          The Maidenhead Town Club was formed in 1942 from the nucleus of the
          old Maidenhead and Taplow Bowling Club where the Green was originally
          behind the Dumb Bell Public House in Taplow. (Many of the original
          trophies are still played for today). Despite the ongoing Second World
          War, the Club was reformed at the Municipal Bowling Green in Oaken
          Grove Park on 13th July 1942, with a friendly match against Burnham.
        </p>

        <p className="mb-4">
          The Official opening took place on 13th August 1942. The newly formed
          Maidenhead Town Bowling club was opened at Oaken Grove by the Mayor Mr
          H.H. Neve, Mr Campbell Dyke, President of the EBA and President of
          Berkshire, plus other officers from Berkshire were in attendance.
        </p>

        <p className="mb-4">
          You can see our past presidents by clicking{" "}
          <a href="/presidents-gallery" className="text-blue-700 underline">
            here to display the Presidents Gallery
          </a>
          .
        </p>

        <p className="mb-4">
          The Club has grown from strength to strength and the Pavilion has been
          replaced four times and has had two big extensions over the years.
          Current Membership (2025) numbers: 90 Men and 40 Ladies who compete in
          all the county and national competitions as can be seen from the club
          honours board.
        </p>

        <p className="mb-4">
          Joining the Berkshire County Association in the year we were reformed
          we have been enthusiastic supporters of the County Association and the
          EBA ever since.
        </p>

        <p className="mb-4">
          The Club has supplied one EBA president – Roy Thomas JP; five County
          Presidents: A J Hooper, R H Thomas JP, John Marshall, Grant Oxtoby and
          Stewart Wright as well as two County Match Secretaries.
        </p>

        <p className="mb-4">
          Also in the club’s history, there have been 6 Ladies who have been
          Ladies County Presidents – Dorothy Campbell-Dykes, Edie Hooper, Hilda
          McCarthy, Sandy Lucas, Joy Thomas and Betty Warner-Fletcher.
        </p>
      </div>
    </div>
  );
};

export default HistoryPage;
