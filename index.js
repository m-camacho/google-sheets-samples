const { google } = require("googleapis");
const { authorize } = require("./auth");

const spreadsheetId = "1xUS59aImQCHCfyhrM4MH_8yar55fkPvTHBh5Cw6nQuw";
const sheetName = "playground";
const range = `${sheetName}!A:C`;

const values = [["mario", "camacho", "mario.camacho2@gmail.com"]];

async function writeSpreedSheet() {
  const auth = await authorize();
  const sheets = google.sheets({ version: "v4", auth });
  try {
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: "RAW",
      resource: {
        values,
      },
    });
    console.log(JSON.stringify(response.data, null, 2));
  } catch (err) {
    console.log(JSON.stringify(err, null, 2));
    return;
  }
}

writeSpreedSheet();

// Interesting/important notes

// https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values/append
// https://developers.google.com/sheets/api/quickstart/nodejs
// https://developers.google.com/sheets/api/guides/values#javascript

// https://cloud.google.com/nodejs/docs/reference/google-auth-library/latest#json-web-tokens
