// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const { v4: uuidv4 } = require('uuid');
// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async context => {
    const testKey = `${uuidv4()}---${uuidv4()}---${uuidv4()}---${uuidv4()}---${uuidv4()}`
    console.log("🚀 ~ file: assign-user-email-verification-key.js ~ line 8 ~ testKey", testKey)
    context.data.emailVerificationKey = `${uuidv4()}${uuidv4()}${uuidv4()}${uuidv4()}${uuidv4()}`.replace(/-/g, "");
    return context;
  };
};
