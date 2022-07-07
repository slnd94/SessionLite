// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const errors = require('@feathersjs/errors');
const errorMessages = require('../utils/errorMessages');
// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async context => {
    let idParam = null;
    switch (context.method) {
      case 'get': case 'patch': case 'update': case 'remove':
        idParam = context.id;
        break;
      case 'find':
        idParam = context.params.query.tenant;
        break;
      case 'create':
        idParam = context.data.tenant;
        break;
      default:
        idParam = null;
        break;
    }

    if(!idParam) {
      return Promise.reject(new errors.BadRequest(errorMessages.badRequest));
    }

    let auth = false;

    // authorize if:
    if(
      // it's an internal call
      !context.params.provider
      // or it's a sysAdmin user making the call
      || context.params.sysAdminUser
    ) {
      auth = true;
    }

    if(!auth) {
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
          auth = true;
      }
    }
    
    if(auth) {
      return context;
    } else {
      return Promise.reject(new errors.Forbidden(errorMessages.forbidden));
    }
  };
};
