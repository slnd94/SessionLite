// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return async context => {
    if (context.params.authenticated && context.params.user?.tenant) {
      // check to see if user is admin on the tenant
      const tenant = await context.app.service('tenants')
        .get(context.params.user.tenant, {
          query: {
            $select: [ 'adminUsers' ]
          }
        });

      if(tenant?.adminUsers?.find(x => x.toString() === context.params.user._id.toString())) {
        context.params.tenantAdminUser = true;
      } else {
        context.params.tenantAdminUser = false;
      }
    } else {
      context.params.tenantAdminUser = false;
    }
    return context;
  };
};
