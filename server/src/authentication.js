const { AuthenticationService, JWTStrategy } = require('@feathersjs/authentication');
const { LocalStrategy } = require('@feathersjs/authentication-local');
const { expressOauth } = require('@feathersjs/authentication-oauth');

module.exports = app => {
  const authentication = new AuthenticationService(app);

  authentication.register('jwt', new JWTStrategy());
  authentication.register('local', new LocalStrategy());

  app.use('/authentication', authentication);

  app.service('/authentication').hooks({
    after: {
      create: [
        async (context) => {
          // get the user tenant if available
          const tenant = context.result.user.tenant ? await context.app.service('tenants').get(context.result.user.tenant) : null;
          
          // set up the return user obj
          context.result.user = {
            _id: context.result.user._id,
            email: context.result.user.email,
            name: {
              given: context.result.user.name.given,
              family: context.result.user.name.family 
            },
            isVerified: context.result.user.verification.emailVerified,
            isLocked: context.result.user.locked,
            isTenantAdmin: tenant?.adminUsers && tenant.adminUsers.find(x => x._id.toString() === context.result.user._id.toString()) ? true : false,
            // tenant if available:
            ...(tenant
              ? {tenant: {
                _id: tenant._id,
                name: tenant.name,
                logo: tenant.logo,
                plan: tenant.plan
              }} : {})
          };
        }
      ]
    }
  });

  app.configure(expressOauth());
};
