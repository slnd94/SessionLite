import dateFormat, { masks } from "dateformat";

export const formatDateTime = (dateTime) =>
  dateFormat(dateTime, "dd-mm-yyyy h:MM TT");

export const formatDateTimeLong = (dateTime) =>
  dateFormat(dateTime, "dddd, mmmm dS, yyyy, h:MM:ss TT");

export const formatDate = (dateTime) => dateFormat(dateTime, "dd-mm-yyyy");

export const formatDateLong = (dateTime) =>
  dateFormat(dateTime, "dddd, mmmm dS, yyyy");

export const formatTime = (dateTime) => dateFormat(dateTime, "h:MM TT");
