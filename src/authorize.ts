const { authenticate } = require("@google-cloud/local-auth");
import { SCOPES, CREDENTIALS_PATH } from ".";
import { loadSavedCredentialsIfExist } from "./loadSavedCredentialsIfExist";
import { saveCredentials } from "./saveCredentials";

/**
 * Load or request or authorization to call APIs.
 *
 */
export async function authorize() {
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
