const moment = require('moment');

const localizer = date => moment.utc(date).toDate();

const dateFormat = {
  time: 'h:mm A',
  short: 'DD-MMM-YYYY',
  dateTimeShort: 'DD-MMM-YYYY h:mm A',
  long: 'MMMM D, YYYY',
  year: 'YYYY',
};

module.exports = {
  utcnow: () => {
    return moment.utc().format();
  },
  getDate: date => localizer(date),
  getFormattedTime: dateTime =>
    moment(localizer(dateTime)).format(dateFormat.time),
  getFormattedDateShort: dateTime =>
    moment(localizer(dateTime)).format(dateFormat.short),
  getFormattedDateTimeShort: dateTime =>
    moment(localizer(dateTime)).format(dateFormat.dateTimeShort),
  getFormattedDateLong: dateTime =>
    moment(localizer(dateTime)).format(dateFormat.long),
  getFormattedDateYear: dateTime =>
    moment(localizer(dateTime)).format(dateFormat.year)
};
