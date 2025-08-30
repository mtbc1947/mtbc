import React from "react";
import { useEffect } from "react";
import { useParams } from 'react-router-dom';
import SEO from '../components/SEO';

interface RouteParams {
  league?: string;
  team?: string;
  [key: string]: string | undefined;
}
const TeamPage: React.FC = () => {
  const { league, team } = useParams<RouteParams>();

  let sheetUrl = "";
  let wLeague = "";
  let wTeam = "";
  let wTitle = "";

  switch (league) {
    case "kl":
      wLeague = "Kennet League";
      wTitle = `${wLeague} ${team}`;
      if (team === "A") {
        sheetUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vR-y3QEc-Gv9i_foxtzg6QBCS1ei7Hemf5iBCOp0kKvxY4a3-II3dHqEXEx8RcK5S8yag35WZYcWXCg/pubhtml?gid=660375987&single=true";
      } else {
        sheetUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vR-y3QEc-Gv9i_foxtzg6QBCS1ei7Hemf5iBCOp0kKvxY4a3-II3dHqEXEx8RcK5S8yag35WZYcWXCg/pubhtml?gid=1958189786&single=true";
      }
      break;

    case "klv":
      wLeague = "KLV League";
      wTitle = `${wLeague} ${team}`;
      if (team === "A") {
        sheetUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vR-y3QEc-Gv9i_foxtzg6QBCS1ei7Hemf5iBCOp0kKvxY4a3-II3dHqEXEx8RcK5S8yag35WZYcWXCg/pubhtml?gid=950926831&single=true";
      } else if (team === "B") {
        sheetUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vR-y3QEc-Gv9i_foxtzg6QBCS1ei7Hemf5iBCOp0kKvxY4a3-II3dHqEXEx8RcK5S8yag35WZYcWXCg/pubhtml?gid=950926831&single=true";
      } else if (team === "C") {
        sheetUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vR-y3QEc-Gv9i_foxtzg6QBCS1ei7Hemf5iBCOp0kKvxY4a3-II3dHqEXEx8RcK5S8yag35WZYcWXCg/pubhtml?gid=1085628576&single=true";
      } else {
        sheetUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vR-y3QEc-Gv9i_foxtzg6QBCS1ei7Hemf5iBCOp0kKvxY4a3-II3dHqEXEx8RcK5S8yag35WZYcWXCg/pubhtml?gid=849149984&single=true";
      }
      break;

    case "rs":
      wLeague = "Royal Shield";
      wTitle = `${wLeague}`;
      sheetUrl = ""; // No iframe for Royal Shield
      break;

    case "tv":
      wLeague = "Thames Valley";
      wTeam = team === "A" ? "Ash" : "Beech";
      wTitle = `${wLeague} ${wTeam}`;
      if (wTeam === "Ash") {
        sheetUrl = "https://docs.google.com/spreadsheets/d/1psUcxTJRWDOhiEV-9Os5X6JVZpA0uaSasI6sq3pTg2I/edit?pli=1#gid=627684544";
      } else {
        sheetUrl = "https://docs.google.com/spreadsheets/d/12x1aJxwzvv7tI3a3w3Be4GRveJczTJbQqwZSgdCs-ME/edit#gid=627684544";
      }
      break;

    default:
      wTitle = "Unknown Team";
      sheetUrl = "";
      break;
  }
  /**
  if (sheetUrl) {
    useEffect(() => {
      window.open(sheetUrl, "_blank", "noopener,noreferrer");
    }, [sheetUrl]);
  }
  */

  return (
    <div className="flex flex-col items-center justify-center p-1 ">
      <SEO
        title="TeamPage – Maidenhead Town Bowls Club"
        description="Shows the results for a club team"
      />
      <h2 className="text-3xl font-bold my-2">{wTitle}</h2>

      {league === "rs" ? (
        <p className="text-center text-2xl max-w-xl">
          <br/>
          The results for matches in the Royal Shield League are not available on-line.
          <br/><br/>
          Please contact the team captain to get the latest results and table information.
        </p>
      ) : sheetUrl ? (
        <iframe
          title={wTitle}
          src={sheetUrl}
          width="100%"
          height="665px"
          style={{ border: "4px solid #ccc" }}
        />
      ) : (
        <p className="text-center">No data available for this team.</p>
      )}
    </div>
  );
};

export default TeamPage;
