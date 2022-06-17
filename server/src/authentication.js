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
          // get the user client if available
          const client = context.result.user.client ? await context.app.service('clients').get(context.result.user.client) : null;
          
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
            isClientAdmin: client?.adminUsers && client.adminUsers.find(x => x._id.toString() === context.result.user._id.toString()) ? true : false,
            // client if available:
            ...(client
              ? {client: {
                _id: client._id,
                name: client.name,
                logo: client.logo
              }} : {})
          };
        }
      ]
    }
  });

  app.configure(expressOauth());
};
