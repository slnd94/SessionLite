const AWS = require('aws-sdk');
const { returnTimeLog } = require('./helpers');
const { EMAIL_ACCESS_KEY_ID, EMAIL_SECRET_ACCESS_KEY, EMAIL_REGION, EMAIL_SOURCE_ADDRESS } = process.env

const ses = new AWS.SES({
  accessKeyId: EMAIL_ACCESS_KEY_ID,
  secretAccessKey: EMAIL_SECRET_ACCESS_KEY,
  region: EMAIL_REGION
});

const sendEmail = async (recipients, template, data) => {
  try {
    const emailParams = {
      Source: EMAIL_SOURCE_ADDRESS,
      Template: template,
      Destination: {
        ToAddresses: recipients
      },
      TemplateData: JSON.stringify(data)
    };
    ses.sendTemplatedEmail(emailParams, function(err, data) {
      // if (err) console.log(err, err.stack); // an error occurred
      // else     console.log(data);           // successful response
    });
    return data;
  } catch (error) {
    console.log(
      `${returnTimeLog()} There was an error sending email: ${error.body || JSON.stringify(error)}`
    );
  }
};

module.exports = { sendEmail };
