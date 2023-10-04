import { authorize } from "./lib/auth/authorize";
import { calendar_v3, google } from "googleapis";
import pathTag from "./lib/pathTag";
import { selectCalendar } from "./lib/calendar/selectCalendar";
import { getCalendarEvents } from "./lib/calendar/getCalendarEvents";
import { enterDate } from "./lib/enterDate";
import { addYears } from "date-fns";
import processEvents from "./lib/calendar/processEvents";
import displayTimeSeries from "./lib/displayTimeSeries";
import { selectByKey } from "./lib/TimeSeriesAccumulator";

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

async function run(auth: any) {
  const calendar = google.calendar({ version: "v3", auth });
  const cal = await selectCalendar(calendar);
  if (!cal) return;

  const start = enterDate("Enter start date: ");
  const end = enterDate("Enter end date: ", addYears(start, 1));

  const events = await getCalendarEvents(calendar, cal.id, start, end);
  const acc = processEvents(events);

  let repeat = true;
  const exit = () => {
    repeat = false;
    return undefined;
  };
  while (repeat) {
    const selection = selectByKey(acc, exit);
    if (selection === undefined) {
      return;
    }
    const [tag, item] = selection;
    displayTimeSeries(tag, item);
  }
}

authorize().then(run).catch(console.error);
