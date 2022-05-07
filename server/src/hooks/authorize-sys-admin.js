// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const errors = require('@feathersjs/errors');
const errorMessages = require('../utils/errorMessages');
// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async context => {
    if(context.params.sysAdminUser) {
      return context;
    } else {
      // user does not have sysAdmin rights.  Reject.
      return Promise.reject(new errors.Forbidden(errorMessages.forbidden));
    }
  };
};
