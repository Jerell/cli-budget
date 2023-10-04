import { TimeSeries } from "./TimeSeries";

export default function displayTimeSeries(tag: string, ts: TimeSeries) {
  console.log({
    tag,
    total: ts.total,
    log: ts.log,
    cumulative: ts.cumulative,
  });
}
