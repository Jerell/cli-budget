import { calendar_v3 } from "googleapis";
import { cutoffText } from "../cutoffText";
import { listCalendars } from "../..";
import { selectChoice } from "../selectChoice";

export async function selectCalendar(calendar: calendar_v3.Calendar) {
  const calendars = await listCalendars(calendar);

  const choices = calendars.map((c, i) => ({
    text: c.name || `calendar ${i}`,
    description: cutoffText(c.description || ""),
  }));

  const selectedIndex = selectChoice(choices, {
    headerText: "choose the budget calendar",
  });
  if (selectedIndex === undefined) {
    return;
  }

  return calendars[selectedIndex];
}
