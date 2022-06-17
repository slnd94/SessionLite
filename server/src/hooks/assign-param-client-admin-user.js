// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return async context => {
    if (context.params.authenticated && context.params.user?.client) {
      // check to see if user is admin on the client
      const client = await context.app.service('clients')
        .get(context.params.user.client, {
          query: {
            $select: [ 'adminUsers' ]
          }
        });
        console.log("🚀 ~ file: assign-param-client-admin-user.js ~ line 8 ~ client", client)

      if(client?.adminUsers?.find(x => x.toString() === context.params.user._id.toString())) {
        context.params.clientAdminUser = true;
      } else {
        context.params.clientAdminUser = false;
      }
    } else {
      context.params.clientAdminUser = false;
    }
    return context;
  };
};
