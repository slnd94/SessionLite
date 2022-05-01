// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const { verificationKey } = require('../utils/userUtils');
module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return async context => {
    // set the expiry date time
    const emailVerificationKeyExpiryDate = new Date();
    emailVerificationKeyExpiryDate.setMinutes(emailVerificationKeyExpiryDate.getMinutes() + parseInt(context.app.get('emailVerificationExpiryMinutes')));
    // reinforce the only fields we want added
    context.data = {
      name: context.data.name,
      email: context.data.email,
      password: context.data.password,
      unhashedPassword: context.data.password,
      verification: {
        emailVerified: false,
        emailVerificationKey: verificationKey(),
        emailVerificationKeyExpiryDate
      }
    };

    // return prepped context
    return context;
  };
};
