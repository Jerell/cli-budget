import { expect, test, describe } from "bun:test";
// import config from "../config.json";

describe("parseCurrency", () => {
  const cases: [string, number][] = [
    ["[+£100.00] income", 100],
    ["[£10.00] expense", -10],
    ["[£1] arbitrary text", -1],
  ];

  test.each(cases)("%s -> %d", (t, expected) => {
    // const match = config.currencyRegex;
  });
});
