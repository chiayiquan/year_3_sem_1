import moment from "moment";

function createDateRange(monthRange: number = 1): number[] {
  const currentDateTime = moment();
  const firstDay = moment(
    getFirstDayOfMonthDate(currentDateTime, monthRange, "subtract")
  );
  const lastDay = moment(getLastDayOfMonthDate(currentDateTime, monthRange));
  return [convertDateToUnix(firstDay), convertDateToUnix(lastDay)];
}

function getFirstDayOfMonthDate(
  date: string | moment.Moment,
  monthRange: number = 0,
  type: "add" | "subtract" = "add"
): string {
  return type === "add"
    ? moment(date)
        .add(monthRange, "months")
        .startOf("month")
        .format("YYYY-MM-DD hh:mm")
        .valueOf()
    : moment(date)
        .subtract(monthRange, "months")
        .startOf("month")
        .format("YYYY-MM-DD hh:mm")
        .valueOf();
}

function getLastDayOfMonthDate(
  date: string | moment.Moment,
  monthRange: number = 0,
  type: "add" | "subtract" = "add"
): string {
  return type === "add"
    ? moment(date)
        .add(monthRange, "months")
        .endOf("month")
        .format("YYYY-MM-DD hh:mm")
        .valueOf()
    : moment(date)
        .subtract(monthRange, "months")
        .endOf("month")
        .format("YYYY-MM-DD hh:mm")
        .valueOf();
}

function convertDateToUnix(date: string | moment.Moment): number {
  return moment(date).unix();
}

function convertUnixToDate(unix: number): string {
  return moment.unix(unix).local().format("YYYY-MM-DD HH:mm:ss");
}

function getCurrentDate(): string {
  return moment().local().format("YYYY-MM-DD");
}

function getLastDayOfMonth(date: string | moment.Moment = moment()): number {
  return parseInt(moment(date).endOf("month").format("DD"));
}
export default {
  createDateRange,
  convertDateToUnix,
  convertUnixToDate,
  getCurrentDate,
  getFirstDayOfMonthDate,
  getLastDayOfMonthDate,
  getLastDayOfMonth,
};
