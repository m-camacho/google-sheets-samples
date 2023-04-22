const { GoogleAuth } = require("google-auth-library");
const { writeUserData } = require("./append");

require("dotenv").config();

/**
 * Instead of specifying the type of client you'd like to use (JWT, OAuth2, etc)
 * this library will automatically choose the right client based on the environment.
 */
async function main() {
  console.log(process.env.GOOGLE_APPLICATION_CREDENTIALS);
  const auth = new GoogleAuth({
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  const projectId = await auth.getProjectId();
  console.log({ projectId });
  await writeUserData(auth);
}

main()
  .then(() =>
    console.log(
      "Service Account finished writing a new row in oursky google-sheet !"
    )
  )
  .catch(console.error);
