import { authorize } from "./lib/auth/authorize";
import { calendar_v3, google } from "googleapis";
import pathTag from "./lib/pathTag";
import { selectCalendar } from "./lib/calendar/selectCalendar";
import { getCalendarEvents } from "./lib/calendar/getCalendarEvents";

export const SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"];

export const TOKEN_PATH = pathTag`token.json`;
export const CREDENTIALS_PATH = pathTag`credentials.json`;

export async function listCalendars(calendar: calendar_v3.Calendar) {
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

async function process(auth: any) {
  const calendar = google.calendar({ version: "v3", auth });
  const cal = await selectCalendar(calendar);

  const events = await getCalendarEvents(calendar, cal.id);
  events.map((event) => {
    const start = event.start?.dateTime || event.start?.date;
    console.log(`${start} - ${event.summary}`);
  });
}

authorize().then(process).catch(console.error);
