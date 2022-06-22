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
    } else if (context.data && context.data.tenantId) {
      idParam = context.data.tenantId;
    } else if (context.params.query && context.params.query.tenantId) {
      idParam = context.params.query.tenantId;
    }

    if(!idParam) {
      return Promise.reject(new errors.BadRequest(errorMessages.badRequest));
    }

    let authUserAdmin = false;

    // authorize if:
    if(
      // it's an internal call
      !context.params.provider
      // or it's a sysAdmin user making the call
      || context.params.sysAdminUser
    ) {
      authUserAdmin = true;
    }

    if(!authUserAdmin) {
      // check to see if user is admin on the tenant
      const tenant = await context.app.service('tenants')
        .get(idParam, {
          query: {
            $select: [ 'adminUsers' ]
          }
        });

      if(
        context.params.authenticated
        && context.params.user
        && tenant.adminUsers
        && tenant.adminUsers.find(x => x.toString() === context.params.user._id.toString())) {
        authUserAdmin = true;
      }
    }
    
    if(authUserAdmin) {
      return context;
    } else {
      return Promise.reject(new errors.Forbidden(errorMessages.forbidden));
    }
  };
};
