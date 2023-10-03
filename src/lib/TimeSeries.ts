export type IRecord = { [date: string]: number };

/***
 * Records values at dates/times.
 *
 * New records on a date/time overwrite old ones.
 */
export class TimeSeries {
  public log: IRecord = {};
  public total = 0;

  constructor(log?: IRecord) {
    if (!log) return;

    this.recordAll(log);
  }

  public record(datetime: string, value: number) {
    this.log[datetime] = this.log[datetime] ?? 0;
    this.total += value - (this.log[datetime] || 0);
    this.log[datetime] = value;
  }

  public recordAll(log: IRecord) {
    for (const [datetime, num] of Object.entries(log)) {
      this.record(datetime, num);
    }
  }

  public on(datetime: string) {
    return this.log[datetime] || 0;
  }

  public at(datetime: string) {
    if (this.log[datetime] !== undefined) {
      return this.log[datetime];
    }
    const earlier = this.before(datetime);

    const lastRecordDay = earlier.lastDay();

    return earlier.on(lastRecordDay);
  }

  public lastDay() {
    const dates = Object.keys(this.log).sort();
    return dates[dates.length - 1];
  }

  /***
   * exclusive datetime
   */
  public before(datetime: string) {
    const cutoffDate = new Date(datetime);
    return new TimeSeries(
      Object.entries(this.log).reduce((acc, [d, num]) => {
        if (new Date(d) < cutoffDate) {
          acc[d] = num;
        }
        return acc;
      }, {} as IRecord)
    );
  }

  /***
   * inclusive datetime
   */
  public after(datetime: string) {
    const cutoffDate = new Date(datetime);
    return new TimeSeries(
      Object.entries(this.log).reduce((acc, [d, num]) => {
        if (new Date(d) >= cutoffDate) {
          acc[d] = num;
        }
        return acc;
      }, {} as IRecord)
    );
  }

  get cumulative() {
    let runningTotal = 0;
    return Object.keys(this.log)
      .sort()
      .reduce((acc, d) => {
        runningTotal += this.log[d];
        acc[d] = runningTotal;
        return acc;
      }, {} as IRecord);
  }

  get flat() {
    return Object.entries(this.log).reduce((acc, [k, v], i) => {
      acc[i] = [k, v];
      return acc;
    }, [] as [string, number][]);
  }

  private domain(t?: TimeSeries) {
    if (!t) {
      return Object.keys(this.log);
    }
    return Array.from(
      new Set(Object.keys(this.log).concat(Object.keys(t.log)))
    );
  }

  public merge(t: TimeSeries) {
    const dates = this.domain(t);

    return new TimeSeries(
      dates.reduce((acc, datetime) => {
        acc[datetime] = this.on(datetime) + t.on(datetime);
        return acc;
      }, {} as IRecord)
    );
  }

  public dot(t: TimeSeries, sustainA = false, sustainB = false) {
    const dates = this.domain(t);

    const getA = (d: string) => (sustainA ? this.at(d) : this.on(d));
    const getB = (d: string) => (sustainB ? t.at(d) : t.on(d));

    return new TimeSeries(
      dates.reduce((acc, datetime) => {
        acc[datetime] = getA(datetime) * getB(datetime);
        return acc;
      }, {} as IRecord)
    );
  }

  public allValuesEqualTo(n: number) {
    const values = Object.values(this.flat);
    if (n != 0 && !values.length) {
      throw new Error("This TimeSeries has no values.");
    }
    return values.every(([_, v]) => v === n);
  }
}
