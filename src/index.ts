import { authorize } from "./authorize";
import { google } from "googleapis";
import pathTag from "./pathTag";

// If modifying these scopes, delete token.json.
export const SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
export const TOKEN_PATH = pathTag`token.json`;
export const CREDENTIALS_PATH = pathTag`credentials.json`;

async function listCalendars() {}

/**
 * Lists the next 10 events on the user's primary calendar.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
async function listEvents(auth: any) {
  const calendar = google.calendar({ version: "v3", auth });
  const r = await calendar.calendarList.list();
  console.log(r);

  const res = await calendar.events.list({
    calendarId: "primary",
    timeMin: new Date().toISOString(),
    maxResults: 10,
    singleEvents: true,
    orderBy: "startTime",
  });
  const events = res.data.items;
  if (!events || events.length === 0) {
    console.log("No upcoming events found.");
    return;
  }
  console.log("Upcoming 10 events:");
  events.map((event: any, i: any) => {
    const start = event.start.dateTime || event.start.date;
    console.log(`${start} - ${event.summary}`);
  });
}

authorize().then(listEvents).catch(console.error);
