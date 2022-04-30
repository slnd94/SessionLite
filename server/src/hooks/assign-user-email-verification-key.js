// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const { v4: uuidv4 } = require('uuid');
// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async context => {
    // set the expiry date time
    const emailVerificationKeyExpiryDate = new Date();
    emailVerificationKeyExpiryDate.setMinutes(emailVerificationKeyExpiryDate.getMinutes() + parseInt(context.app.get('emailVerificationExpiryMinutes')));
    context.data = {
      ...context.data,
      emailVerified: false,
      emailVerificationKey: `${uuidv4()}${uuidv4()}${uuidv4()}${uuidv4()}${uuidv4()}`.replace(/-/g, ""),
      emailVerificationKeyExpiryDate
    }
    return context;
  };
};
