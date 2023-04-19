const fs = require("fs").promises;
const path = require("path");
const process = require("process");
const { authenticate } = require("@google-cloud/local-auth");
const { google } = require("googleapis");

// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = path.join(process.cwd(), "auth/token.json");
const CREDENTIALS_PATH = path.join(process.cwd(), "auth/credentials.json");

// If modifying these scopes, delete token.json.
const SCOPES = [
  "https://www.googleapis.com/auth/drive",
  "https://www.googleapis.com/auth/drive.file",
  "https://www.googleapis.com/auth/spreadsheets",
];

const spreadsheetId = "1xUS59aImQCHCfyhrM4MH_8yar55fkPvTHBh5Cw6nQuw";
const sheetName = "playground";
const range = `${sheetName}!A:C`;

/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

/**
 * Serializes credentials to a file compatible with GoogleAUth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials(client) {
  const content = await fs.readFile(CREDENTIALS_PATH);
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: "authorized_user",
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(TOKEN_PATH, payload);
}

/**
 * Load or request or authorization to call APIs.
 *
 */
async function authorize() {
  let client = await loadSavedCredentialsIfExist();
  if (client) {
    return client;
  }
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  if (client.credentials) {
    await saveCredentials(client);
  }
  return client;
}

async function writeUserData(auth) {
  const sheets = google.sheets({ version: "v4", auth });
  const request = {
    spreadsheetId,
    range: "playground!A:C",
    valueInputOption: "RAW",
    // insertDataOption: "INSERT_ROWS",
    resource: {
      //   majorDimension: "ROWS",
      values: [["mario", "camacho", "mario.camacho2@gmail.com"]],
    },
    auth,
  };

  try {
    const response = (await sheets.spreadsheets.values.append(request)).data;
    // TODO: Change code below to process the `response` object:
    console.log(JSON.stringify(response, null, 2));
  } catch (err) {
    console.error(err);
  }
}

function updateValues(auth) {
  const sheets = google.sheets({ version: "v4", auth });
  const values = [["mario", "camacho", "mario.camacho2@gmail.com"]];
  try {
    sheets.spreadsheets.values
      .append({
        spreadsheetId,
        range: "playground!A:C",
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

authorize().then(updateValues).catch(console.error);

// scopes: "https://www.googleapis.com/auth/cloud-platform",
// scopes: 'https://www.googleapis.com/auth/spreadsheets'

// 1xUS59aImQCHCfyhrM4MH_8yar55fkPvTHBh5Cw6nQuw
// 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms
