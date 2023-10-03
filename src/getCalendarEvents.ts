import { calendar_v3 } from "googleapis";
import { addYears } from "date-fns";

export async function getCalendarEvents(
  calendar: calendar_v3.Calendar,
  id: string,
  from = new Date(),
  until = addYears(from, 1)
) {
  const res = await calendar.events.list({
    calendarId: id,
    timeMin: from.toISOString(),
    // maxResults: 10,
    timeMax: until.toISOString(),
    singleEvents: true,
    orderBy: "startTime",
  });

  const events = res.data.items;
  if (!events || events.length === 0) {
    console.log("No upcoming events found.");
    return [];
  }

  return events;
}
