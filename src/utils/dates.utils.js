import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(utc);
dayjs.extend(timezone);

export function formatDateInTimeZone(date) {
  const tz = "Asia/Riyadh";
  const tzDayJs = dayjs.utc(date).tz(tz); //existing time treated as local time
  // const date = dayjs(closed_date).tz("2013-11-18 11:55:20", tz);
  const formattedDate = tzDayJs.format("DD-MM-YYYY HH:mm A");
  return formattedDate;
}
