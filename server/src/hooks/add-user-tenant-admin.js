// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async (context) => {
    // get the user tenant if available
    const tenant = context.result.tenant
      ? await context.app.service("tenants").get(context.result.tenant)
      : null;

    context.result = {
      ...context.result,
      tenantAdmin:
        tenant?.adminUsers &&
        tenant.adminUsers.find(
          (x) => x._id.toString() === context.result._id.toString()
        )
          ? true
          : false,
    };

    return context;
  };
};
