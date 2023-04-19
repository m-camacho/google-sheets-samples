const { google } = require("googleapis");
const { authorize } = require("../auth");

const spreadsheetId = "1xUS59aImQCHCfyhrM4MH_8yar55fkPvTHBh5Cw6nQuw";
const sheetName = "playground";
const range = `${sheetName}!A:C`;

function writeUserData(auth) {
  const sheets = google.sheets({ version: "v4", auth });
  const values = [["elvis", "rocha", "elvis.rocha@gmail.com"]];
  try {
    sheets.spreadsheets.values
      .append({
        spreadsheetId,
        range,
        valueInputOption: "RAW",
        resource: {
          values,
        },
      })
      .then((response) => {
        console.log(JSON.stringify(response.data, null, 2));
      });
  } catch (err) {
    console.log(JSON.stringify(err, null, 2));
    return;
  }
}

authorize().then(writeUserData).catch(console.error);
