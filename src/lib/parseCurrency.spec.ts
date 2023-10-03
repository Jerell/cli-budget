import { expect, test, describe } from "bun:test";
import parseTransactionString from "./parseCurrency";

describe("parseCurrency", () => {
  const cases: [string, [number, string]][] = [
    ["[+£100.00] income", [100, "income"]],
    ["[+£105.43] income", [105.43, "income"]],
    ["[£10.00] expense", [-10, "expense"]],
    ["[£1] arbitrary text", [-1, "arbitrary text"]],
  ];

  test.each(cases)("%s", (text, [n, label]) => {
    const { value, label: l } = parseTransactionString(text)!;
    expect([value, l]).toStrictEqual([n, label]);
  });
});
