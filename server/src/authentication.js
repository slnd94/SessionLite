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
        (context) => {
          // this will retain our access to the unhashed pw,
          // so we can authenticate the user in the "after create" hook
          context.result.user = {
            _id: context.result.user._id,
            email: context.result.user.email,
            name: {
              given: context.result.user.name.given,
              family: context.result.user.name.given
            },
            isVerified: context.result.user.verification.emailVerified,
            isLocked: context.result.user.locked
          };
        }
      ]
    }
  });

  app.configure(expressOauth());
};
