// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const { v4: uuidv4 } = require('uuid');
// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async context => {
    context.data.emailVerificationKey = uuidv4();
    return context;
  };
};
