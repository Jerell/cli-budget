import { google } from "googleapis";
import { TOKEN_PATH } from "../..";

/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */

export async function loadSavedCredentialsIfExist() {
  try {
    const content = Bun.file(TOKEN_PATH);
    const credentials = await content.json();
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}
