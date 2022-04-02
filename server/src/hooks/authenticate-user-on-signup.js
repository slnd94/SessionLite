// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return async context => {
    // we set context.data.unhashedPassword in a before hook
    // so we could retain access to the unhashed pw and authenticate the user in this hook
    const data = {
      email: context.data.email,
      password: context.data.unhashedPassword,
      strategy: 'local'
    };
    const params = { ...context.params, user: context.result };
    return context.app.service('authentication').create(data, params).then(res => {      
      context.result = res;

      return context;
    });
  };
};
