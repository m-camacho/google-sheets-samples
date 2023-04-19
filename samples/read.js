const { google } = require("googleapis");
const { authorize } = require("../auth");

const spreadsheetId = "1xUS59aImQCHCfyhrM4MH_8yar55fkPvTHBh5Cw6nQuw";
const sheetName = "data";
const range = `${sheetName}!A2:C`;

/**
 * Prints the names and majors of students in a sample spreadsheet:
 * @see https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
 */
async function listTelescopeNetwork(auth) {
  const sheets = google.sheets({ version: "v4", auth });
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
  });
  const rows = res.data.values;
  if (!rows || rows.length === 0) {
    console.log("No data found.");
    return;
  }

  console.log("Name, email:");
  rows.forEach((row) => {
    console.log(`${row[0]} ${row[1]}, ${row[2]}`);
  });
}

authorize().then(listTelescopeNetwork).catch(console.error);
