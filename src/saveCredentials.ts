import { CREDENTIALS_PATH, TOKEN_PATH } from ".";

/**
 * Serializes credentials to a file compatible with GoogleAUth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */

export async function saveCredentials(client: any) {
  const content = Bun.file(CREDENTIALS_PATH);
  const keys = await content.json();
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: "authorized_user",
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await Bun.write(TOKEN_PATH, payload);
}
