/* eslint-disable no-unused-vars */
const SibApiV3Sdk = require("sib-api-v3-sdk");

const {
  getFormattedDateLong,
  getFormattedTime,
} = require("../../utils/dateUtils");

exports.EmailsSendinblue = class EmailsSendinblue {
  constructor(options) {
    this.options = options || {};
  }

  setup(app) {
    this.app = app;

    this.defaultClient = SibApiV3Sdk.ApiClient.instance;
    this.apiKey = this.defaultClient.authentications["api-key"];
    this.apiKey.apiKey = this.app.get("sendInBlueApiKey");
    this.apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
  }

  async create(data, params) {
    const curDateTime = new Date();

    let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail(); // SendSmtpEmail | Values to send a transactional email

    sendSmtpEmail = {
      to: [
        {
          email: data.destination,
          // name: "John Doe",
        },
      ],
      templateId: parseInt(data.templateId),
      params: {
        ...data.data
      },
      headers: {
        "X-Mailin-custom":
          "custom_header_1:custom_value_1|custom_header_2:custom_value_2",
      },
    };

    this.apiInstance.sendTransacEmail(sendSmtpEmail).then(
      function (res) {
        console.log("API called successfully. Returned data: " + JSON.stringify(res));
      },
      function (error) {
        console.error(error);
      }
    );

    // const emailParams = {
    //   // ConfigurationSetName: "testDestinationWeebleDevEmailNotifications",
    //   Source: this.app.get("emailSourceAddress"),
    //   Template: data.template,
    //   Destination: {
    //     ToAddresses: [data.destination],
    //   },
    //   TemplateData: JSON.stringify({
    //     appUrl: this.app.get("host"),
    //     appLogoUrl: `${this.app.get("host")}/logoSmall.png`,
    //     dateTime: `${getFormattedDateLong(curDateTime)} ${getFormattedTime(
    //       curDateTime
    //     )}`,
    //     ...data.data,
    //   }),
    // };
    // this.ses.sendTemplatedEmail(emailParams, function (err, data) {
    //   // if (err) console.log(err, err.stack); // an error occurred
    //   // else     console.log(data);           // successful response
    // });

    return data;
  }
};
