// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const errors = require('@feathersjs/errors');

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async context => {
  // console.log("🚀 ~ file: authenticate-user-standing.js ~ line 8 ~ context", context)
    if(context.params.provider && ((!context?.params?.user) || context.params.user.locked || !context.params.user.active)) {
      return Promise.reject(new errors.NotAuthenticated());
    }
    return context;
  };
};
