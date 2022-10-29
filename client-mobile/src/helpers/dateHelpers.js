// import moment from "moment-timezone";

// const localizer = (date) => moment.utc(date).toDate();

import dateFormat, { masks } from "dateformat";

// export const dateFormat = {
//   time: "h:mm A",
//   short: "DD-MMM-YYYY",
//   dateTimeShort: "DD-MMM-YYYY h:mm A",
//   long: "MMMM D, YYYY",
//   dateLong: {
//     weekday: "long",
//     year: "numeric",
//     month: "long",
//     day: "numeric",
//   },
//   dateTimeLong: {
//     weekday: "long",
//     year: "numeric",
//     month: "long",
//     day: "numeric",
//     hour: "numeric",
//     minute: "numeric"
//   },
//   year: "YYYY",
// };

// export const getDate = (date) => localizer(date);

// export const getFormattedTime = (dateTime) =>
//   moment(localizer(dateTime)).format(dateFormat.time);

// export const getFormattedDateShort = (dateTime) =>
//   moment(localizer(dateTime)).format(dateFormat.short);

// export const getFormattedDateTimeShort = (dateTime) =>
//   moment(localizer(dateTime)).format(dateFormat.dateTimeShort);

// export const getFormattedDateLong = (dateTime) =>
//   moment(localizer(dateTime)).format(dateFormat.long);

export const getFormattedDateTimeLong = (dateTime) =>
  dateFormat(new Date(dateTime), "dddd, mmmm dS, yyyy, h:MM:ss TT");

  export const getFormattedDateLong = (dateTime) =>
    dateFormat(new Date(dateTime), "dddd, mmmm dS, yyyy");

  export const getFormattedTimeLong = (dateTime) =>
    dateFormat(new Date(dateTime), "h:MM:ss TT");

// export const getFormattedDateYear = (dateTime) =>
//   moment(localizer(dateTime)).format(dateFormat.year);
