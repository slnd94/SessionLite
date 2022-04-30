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
    // console.log("🚀 ~ file: user-account-verification.class.js ~ line 14 ~ UserAccountVerification ~ patch ~ id", id)
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
      case 'verify':
        // console.log('the data:', { id, data, params })
        if (data.key.toString() === params.user.emailVerificationKey.toString()) {
          console.log('MATCH')
          // valid verification key
          // update the user email verification
          return this.app.service('users')
            .patch(id, { emailVerificationKey: null, emailVerificationKeyExpiryDate: null, emailVerified: true }, {})
            .then(result => {
              console.log("🚀 ~ file: user-account-verification.class.js ~ line 36 ~ UserAccountVerification ~ patch ~ result", result)
              // return only the user id
              return { _id: result._id };
            });
        } else {
          // invalid verification key
          console.log('NO MATH')
        }
        return data;
      default:
        return data;
    }
  }
};
