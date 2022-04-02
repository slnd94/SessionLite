// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return async context => {
    // reinforce the only fields we want added
    context.data = {
      name: context.data.name,
      email: context.data.email,
      password: context.data.password,
      unhashedPassword: context.data.unhashedPassword
    };

    // return prepped context
    return context;
  };
};
