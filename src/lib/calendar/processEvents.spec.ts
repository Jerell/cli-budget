import { expect, test, describe } from "bun:test";
import processEvents from "./processEvents";
import { calendar_v3 } from "googleapis";

describe("processEvents", () => {
  test("total", () => {
    const events: {
      summary?: string | null | undefined;
      start?: calendar_v3.Schema$EventDateTime | undefined;
    }[] = [
      { summary: "[+£100.00] income", start: { date: "2023-10-03" } },
      { summary: "[£50.00] spend", start: { date: "2023-10-04" } },
    ];

    const processed = processEvents(events);

    expect(processed.all.total).toBe(50);
    expect(processed.income.total).toBe(100);
    expect(processed.spend.total).toBe(-50);
  });
});
