import { expect, test, describe } from "bun:test";
import { cutoffText } from "./cutoffText";

describe("cut to length 15", () => {
  const cases: [string, number][] = [
    ["short", 5],
    ["eighteen character", 18],
  ];

  test.each(cases)("%s (%d)", (text, length) => {
    expect(cutoffText(text, 15).length).toBe(length);
  });
});

describe("cut to length 2", () => {
  const cases: [string, number][] = [
    ["short", 5],
    ["eighteen character", 5],
  ];

  test.each(cases)("%s (%d)", (text, length) => {
    expect(cutoffText(text, 2).length).toBe(length);
  });
});
