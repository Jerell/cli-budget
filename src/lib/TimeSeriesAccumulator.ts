import { createSelection } from "bun-promptx";
import { TimeSeries } from "./TimeSeries";
import { selectChoice } from "./selectChoice";

export interface TimeSeriesAccumulator {
  all: TimeSeries;
  [label: string]: TimeSeries;
}

export function selectByKey(
  tsa: TimeSeriesAccumulator,
  exit: () => undefined
): [string, TimeSeries] | void {
  const choices = Object.keys(tsa);

  const selectedIndex = selectChoice(
    choices,
    {
      headerText: "Choose which item to examine",
    },
    exit
  );
  if (selectedIndex === undefined || selectedIndex >= choices.length) {
    return;
  }

  const key = Object.keys(tsa)[selectedIndex];
  return [key, tsa[key]];
}
