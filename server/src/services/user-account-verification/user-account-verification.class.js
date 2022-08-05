/* eslint-disable no-unused-vars */
const { verificationKey } = require('../../utils/userUtils');

exports.UserAccountVerification = class UserAccountVerification {
  constructor (options) {
    this.options = options || {};
  }
  
  setup(app) {
    this.app = app;
  }

  async patch (id, data, params) {
    switch(params.query?.verificationAction) {
      case 'set':
        // set new verification key and send a fresh email to user

        // set the expiry date time
        const emailVerificationKeyExpiryDate = new Date();
        emailVerificationKeyExpiryDate.setMinutes(emailVerificationKeyExpiryDate.getMinutes() + parseInt(this.app.get('emailVerificationExpiryMinutes')));
        const emailVerificationData = {
          emailVerified: false,
          emailVerificationKey: verificationKey(),
          emailVerificationKeyExpiryDate
        };
        return this.app.service('users')
          .patch(id, { verification: emailVerificationData })
          .then(res => {
            // send welcome/verification email to user
            this.app.service('emails-sendinblue')
              .create({
                templateId: this.app.get('welcomeVerificationEmailTemplate'),
                destination: params.user.email,
                data: {  
                  appLogoUrl: `${this.app.get('appWebBaseUrl')}/images/siteLogoSmall.png`,
                  appPrimaryColor: this.app.get('appPrimaryColor'),
                  appName: this.app.get('appName'),
                  emailVerificationUrl: `${this.app.get('appWebBaseUrl')}/user/verification/email/${emailVerificationData.emailVerificationKey}`,
                  privacyPolicyUrl: this.app.get('privacyPolicyUrl')
                }
              });
            return { _id: res._id, verificationSetSuccess: true };
          });
        break;
      case 'verify':
        // use the provided code to verify user's email address
        if (data.key.toString() === params.user.verification.emailVerificationKey.toString()
            && Date.now() < params.user.verification.emailVerificationKeyExpiryDate) {
          // valid verification key
          // update the user email verification
          return this.app.service('users')
            .patch(id, { verification: { emailVerificationKey: null, emailVerificationKeyExpiryDate: null, emailVerified: true }})
            .then(result => {
              // return only the user id
              return { _id: result._id, verified: true };
            });
        } else {
          // invalid verification key
          return { verified: false };
        }
        break;
      default:
        return data;
        break;
    }
  }
};
