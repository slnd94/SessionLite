/* eslint-disable no-unused-vars */
const { v4: uuidv4 } = require('uuid');

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
        emailVerificationData = {
          emailVerified: false,
          emailVerificationKey: uuidv4()
        };
        return this.app.service('users')
          .patch(id, emailVerificationData, params)
          .then(res => {
            // return only the user id
            return { _id: res._id };
          });
        break;
      case 'verify':
        if (data.key.toString() === params.user.verification.emailVerificationKey.toString()) {
          // valid verification key
          // update the user email verification
          return this.app.service('users')
            .patch(id, { verification: { emailVerificationKey: null, emailVerificationKeyExpiryDate: null, emailVerified: true }}, {})
            .then(result => {
              // return only the user id
              return { _id: result._id };
            });
        } else {
          // invalid verification key
          console.log('NO MATH')
        }
        return data;
        break;
      default:
        return data;
        break;
    }
  }
};
