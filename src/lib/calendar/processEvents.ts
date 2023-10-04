import { calendar_v3 } from "googleapis";
import { TimeSeries } from "../TimeSeries";
import parseTransactionString from "../parseCurrency";
import { TimeSeriesAccumulator } from "../TimeSeriesAccumulator";

type e = Pick<calendar_v3.Schema$Event, "start" | "summary">;

export default function processEvents(events: e[]): TimeSeriesAccumulator {
  return events.reduce(
    (acc: TimeSeriesAccumulator, event) => {
      const start = event.start?.dateTime || event.start?.date;
      if (!start || !event.summary) return acc;

      const transaction = parseTransactionString(event.summary);
      if (!transaction) return acc;

      acc.all.record(start, acc.all.on(start) + transaction.value);
      acc[transaction.label] = acc[transaction.label] ?? new TimeSeries();
      acc[transaction.label].record(
        start,
        acc[transaction.label].on(start) + transaction.value
      );

      return acc;
    },
    {
      all: new TimeSeries(),
    }
  );
}
