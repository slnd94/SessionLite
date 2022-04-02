// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return async context => {
    const { sysAdminUser } = context.params;
    if(!sysAdminUser) {
      if(context.data) {
        delete context.data.sysAdmin;
      }
    }
    return context;
  };
};
