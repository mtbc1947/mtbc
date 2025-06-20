import React from "react";

const KennetPage = () => {
  //const sheetUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vR-y3QEc-Gv9i_foxtzg6QBCS1ei7Hemf5iBCOp0kKvxY4a3-II3dHqEXEx8RcK5S8yag35WZYcWXCg/pubhtml?gid=660375987&single=true";
  const sheetUrl = "https://docs.google.com/spreadsheets/d/1afLS8xd8HG-azxVbbgGoxLtjiOpAB9XLUnGY_yta_fY/edit?gid=0#gid=0"
  return (
    <div className="flex flex-col items-center justify-center">
      <h2>Kennet Page</h2>
      <iframe
        title="Kennet Spreadsheet 2"
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

export default KennetPage;
