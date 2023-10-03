import { expect, test, describe } from "bun:test";
import parseCurrency from "./parseCurrency";

describe("parseCurrency", () => {
  const cases: [string, number][] = [
    ["[+£100.00] income", 100],
    ["[+£105.43] income", 105.43],
    ["[£10.00] expense", -10],
    ["[£1] arbitrary text", -1],
  ];

  test.each(cases)("%s -> %d", (text, expected) => {
    expect(parseCurrency(text)).toBe(expected);
  });
});
