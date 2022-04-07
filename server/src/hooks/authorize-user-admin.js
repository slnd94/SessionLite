// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const errors = require('@feathersjs/errors');
const errorMessages = require('../utils/errorMessages');
// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async context => {
    let idParam = null;
    if(context.id) {
      idParam = context.id;
    } else if (context.params.payload && context.params.payload.userId) {
      idParam = context.params.payload.userId;
    }

    // authorize if:
    if(
      // it's an internal call
      !context.params.provider
      // or it's a sysAdmin user making the call
      || context.params.sysAdminUser
      // or it's the subject user making the call
      || (context.params.authenticated && context.params.user._id.toString() === idParam.toString())
    ) {
      return context;
    } else {
      return Promise.reject(new errors.Forbidden(errorMessages.forbidden));
    }
  };
};
