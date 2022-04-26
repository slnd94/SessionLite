/* eslint-disable no-unused-vars */
const AWS = require('aws-sdk');

const { getFormattedDateLong, getFormattedTime } = require('../../utils/dateUtils');

exports.Emails = class Emails {
  constructor (options) {
    this.options = options || {};
  }
  
  setup(app) {
    this.app = app;

    this.ses = new AWS.SES({
      accessKeyId: this.app.get('emailAccessKeyId'),
      secretAccessKey: this.app.get('emailSecretAccessKey'),
      region: this.app.get('emailRegion')
    });
  }

  async create (data, params) {
    const curDateTime = new Date();
    const emailParams = {
      // ConfigurationSetName: "testDestinationWeebleDevEmailNotifications",
      Source: this.app.get('emailSourceAddress'),
      Template: data.template,
      Destination: {
        ToAddresses: [data.destination]
      },
      TemplateData: JSON.stringify({
        appUrl: this.app.get('host'),
        appLogoUrl: `${this.app.get('host')}/logoSmall.png`,
        dateTime: `${getFormattedDateLong(curDateTime)} ${getFormattedTime(curDateTime)}`,
        ...data.data
      })
    };
    this.ses.sendTemplatedEmail(emailParams, function(err, data) {
      // if (err) console.log(err, err.stack); // an error occurred
      // else     console.log(data);           // successful response
    });

    return data;
  }
};
