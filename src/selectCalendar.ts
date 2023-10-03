import { calendar_v3 } from "googleapis";
import { createSelection } from "bun-promptx";
import { cutoffText } from "./cutoffText";
import { listCalendars } from ".";

export async function selectCalendar(calendar: calendar_v3.Calendar) {
  const calendars = await listCalendars(calendar);
  const { selectedIndex, error } = createSelection(
    calendars.map((c, i) => ({
      text: c.name || `calendar ${i}`,
      description: cutoffText(c.description || ""),
    })),
    {
      headerText: "choose the budget calendar",
    }
  );
  if (error) throw new Error(error);
  if (selectedIndex === null) throw new Error("calendar index is null");
  return calendars[selectedIndex];
}
