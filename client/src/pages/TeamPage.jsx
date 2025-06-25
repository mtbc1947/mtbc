import React from "react";
import { useParams } from 'react-router-dom';

const TeamPage = () => {
    const { league, team } = useParams();
    let wLeague = "";
    let wTeam = "";
    let wTitle = "";
    switch (league) {
      case "kl":
        wLeague = "Kennet League";
        wTitle = `${wLeague} ${team}`;
        break;
      case "klv":
        wLeague = "KLV League";
        wTitle = `${wLeague} ${team}`;
        break;
      case "rs":
        wLeague = "Royal Shield";
        wTitle = `${wLeague}`;
        break;
      case "tv":
        wLeague = "Thames Valley";
        wTeam = (team === "A")? "Ash" : "Beech";
        wTitle = `${wLeague} ${wTeam}`;
        break;
      default:
        break;
    }
  //const sheetUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vR-y3QEc-Gv9i_foxtzg6QBCS1ei7Hemf5iBCOp0kKvxY4a3-II3dHqEXEx8RcK5S8yag35WZYcWXCg/pubhtml?gid=660375987&single=true";
  const sheetUrl = "https://docs.google.com/spreadsheets/d/1afLS8xd8HG-azxVbbgGoxLtjiOpAB9XLUnGY_yta_fY/edit?gid=0#gid=0"
  return (
    <div className="flex flex-col items-center justify-center">
      <br/>
      <h2 className="text-3xl font-bold">{wTitle}</h2>
      <br/>
      <iframe
        title={wTitle}
        src={sheetUrl}
        width="75%"
        height="600px"
        style={{ border: "1px solid #ccc" }}
        frameBorder="0"
        scrolling="yes"
      />
    </div>
  );
};

export default TeamPage;
