import { expect, test, describe } from "bun:test";
import { TimeSeries } from "./TimeSeries";

describe("construct", () => {
  test("loads values on the right days", () => {
    const log = new TimeSeries({ "2022-10-10": 20, "2022-10-23": 3 });

    expect(log.log["2022-10-10"]).toBe(20);
    expect(log.log["2022-10-23"]).toBe(3);
    expect(log.total).toBe(23);
  });

  test("also works with times", () => {
    const log = new TimeSeries({
      "2022-10-10T10:00": 20,
      "2022-10-10T11:00": 3,
    });

    expect(log.log["2022-10-10"]).toBe(undefined);

    expect(log.log["2022-10-10T10:00"]).toBe(20);
    expect(log.log["2022-10-10T11:00"]).toBe(3);
    expect(log.total).toBe(23);
  });
});

describe("record", () => {
  test("increases the total", () => {
    const log = new TimeSeries();

    log.record("2022-10-10", 3);
    expect(log.total).toBe(3);

    log.record("2022-10-11", 4);
    expect(log.total).toBe(7);
  });

  test("overwrites the day", () => {
    const log = new TimeSeries();

    log.record("2022-10-10", 3);
    expect(log.total).toBe(3);

    log.record("2022-10-10", 4);
    expect(log.total).toBe(4);
  });
});

describe("before", () => {
  test("returns a TimeSeries with only the values before a given datetime", () => {
    const log = new TimeSeries({
      "2022-10-10": 20,
      "2022-10-23": 3,
      "2022-10-23T11:00": 1,
    });

    expect(log.before("2022-10-15").log["2022-10-10"]).toBe(20);
    expect(log.before("2022-10-15").total).toBe(20);
    expect(log.before("2022-10-23").total).toBe(20);
    expect(log.before("2022-10-23T12:00").total).toBe(24);
  });
});

describe("after", () => {
  test("returns a TimeSeries with only the values after a given datetime", () => {
    const log = new TimeSeries({ "2022-10-10": 20, "2022-10-23": 3 });

    expect(log.after("2022-10-15").log["2022-10-23"]).toBe(3);
    expect(log.after("2022-10-15").total).toBe(3);
    expect(log.after("2022-10-23").total).toBe(3);
    expect(log.after("2022-10-23T11:00").total).toBe(0);
  });
});

describe("cumulative", () => {
  test("should return a cumulative series of values", () => {
    const log = new TimeSeries({ "2022-10-10": 20, "2022-10-23": 3 });

    expect(log.cumulative["2022-10-23"]).toBe(23);
  });
});

describe("at", () => {
  test("should return the most recent value at a given datetime", () => {
    const log = new TimeSeries({
      "2022-10-10": 20,
      "2022-10-23": 3,
      "2022-10-23T12:00": 4,
    });

    expect(log.at("2022-10-09")).toBe(0);
    expect(log.at("2022-10-10")).toBe(20);
    expect(log.at("2022-10-11")).toBe(20);
    expect(log.at("2022-10-23")).toBe(3);
    expect(log.at("2022-10-23T11:00")).toBe(3);
    expect(log.at("2022-10-23T13:00")).toBe(4);
    expect(log.at("2022-10-24")).toBe(4);
  });
});

describe("on", () => {
  test("should return the value on a given datetime", () => {
    const log = new TimeSeries({
      "2022-10-10": 20,
      "2022-10-23": 3,
      "2022-10-23T12:00": 4,
    });

    expect(log.on("2022-10-09")).toBe(0);
    expect(log.on("2022-10-10")).toBe(20);
    expect(log.on("2022-10-11")).toBe(0);
    expect(log.on("2022-10-23")).toBe(3);
    expect(log.on("2022-10-23T11:00")).toBe(0);
    expect(log.on("2022-10-23T12:00")).toBe(4);
    expect(log.on("2022-10-23T13:00")).toBe(0);
    expect(log.on("2022-10-24")).toBe(0);
  });
});

describe("merge", () => {
  test("should sum TimeSeries values", () => {
    const log1 = new TimeSeries({
      "2022-10-10": 5,
      "2022-10-11": 3,
      "2022-10-23": 4,
    });
    const log2 = new TimeSeries({
      "2022-10-10": 2,
      "2022-10-23": 1,
      "2022-10-24": 6,
    });

    const merged = log1.merge(log2);

    expect(merged.on("2022-10-10")).toBe(7);
    expect(merged.on("2022-10-11")).toBe(3);
    expect(merged.on("2022-10-23")).toBe(5);
    expect(merged.on("2022-10-24")).toBe(6);
  });
});

describe("dot", () => {
  test("should multiply as if matrix", () => {
    const log1 = new TimeSeries({
      "2022-10-10": 5,
      "2022-10-11": 3,
      "2022-10-23": 4,
    });
    const log2 = new TimeSeries({
      "2022-10-10": 2,
      "2022-10-23": 1,
      "2022-10-24": 6,
    });

    const multiplied = log1.dot(log2);

    expect(multiplied.on("2022-10-10")).toBe(10);
    expect(multiplied.on("2022-10-11")).toBe(0);
    expect(multiplied.on("2022-10-23")).toBe(4);
    expect(multiplied.on("2022-10-24")).toBe(0);

    const rates = new TimeSeries({
      "2022-10-10": 10,
      "2022-10-23": 15,
    });
    const hours = new TimeSeries({
      "2022-10-11": 3,
      "2022-10-25": 4,
    });
    const cost = rates.dot(hours, true);
    expect(cost.total).toBe(90);
    expect(cost.on("2022-10-10")).toBe(0);
    expect(cost.on("2022-10-11")).toBe(30);
  });
});

describe("flatten", () => {
  test("returns the log as an array of key value pairs", () => {
    const ts = new TimeSeries({
      "2022-10-10": 5,
      "2022-10-11": 3,
      "2022-10-23": 4,
    });

    expect(ts.flat).toEqual([
      ["2022-10-10", 5],
      ["2022-10-11", 3],
      ["2022-10-23", 4],
    ]);
  });
});

describe("allValuesEqualTo", () => {
  test("compares each value to see if they are all the same input", () => {
    const correctTs = new TimeSeries({
      "2023-05-14": 0,
      "2023-05-15": 0,
      "2023-05-16": 0,
    });
    const incorrectTs = new TimeSeries({
      "2023-05-14": 0,
      "2023-05-15": 3213,
      "2023-05-16": 0,
    });
    const almostCorrectTs = new TimeSeries({
      "2023-05-14": 0,
      "2023-05-15": -1,
      "2023-05-16": 1,
    });

    expect(correctTs.allValuesEqualTo(0)).toBe(true);
    expect(incorrectTs.allValuesEqualTo(0)).toBe(false);
    expect(almostCorrectTs.allValuesEqualTo(0)).toBe(false);
  });

  test("should not work with null values", () => {
    const log = new TimeSeries();

    expect(log.log["2022-10-10"]).toBe(undefined);

    expect(() => {
      log.allValuesEqualTo(1);
    }).toThrow("This TimeSeries has no values.");

    expect(log.allValuesEqualTo(0)).toBe(true);
  });
});
