import { authorize } from "./authorize";
import { calendar_v3, google } from "googleapis";
import pathTag from "./pathTag";
import { ArrayElement } from "./lib/arrayElement";
import { createSelection } from "bun-promptx";

// If modifying these scopes, delete token.json.
export const SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
export const TOKEN_PATH = pathTag`token.json`;
export const CREDENTIALS_PATH = pathTag`credentials.json`;

async function listCalendars(calendar: calendar_v3.Calendar) {
  const list = await calendar.calendarList.list();
  const items = list.data.items;

  if (!items) throw new Error("no calendar items");

  return items.map((c) => {
    const { id, summary: name, description, ...details } = c;
    return {
      id: id as string,
      name,
      description,
      details,
    };
  });
}

const cutoffText = (t: string, limit = 25) =>
  t.length <= limit ? t : t.slice(0, limit - 1) + "...";

async function selectCalendar(calendar: calendar_v3.Calendar) {
  const calendars = await listCalendars(calendar);
  const { selectedIndex, error } = createSelection(
    calendars.map((c, i) => ({
      text: c.name || `calendar ${i}`,
      description: cutoffText(c.description || ""),
    }))
  );
  if (error) throw new Error(error);
  if (selectedIndex === null) throw new Error("calendar index is null");
  return calendars[selectedIndex];
}

/**
 * Lists the next 10 events on the user's primary calendar.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
async function listEvents(auth: any) {
  const calendar = google.calendar({ version: "v3", auth });
  const cal = await selectCalendar(calendar);
  console.log(cal);

  const res = await calendar.events.list({
    calendarId: cal.id,
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
