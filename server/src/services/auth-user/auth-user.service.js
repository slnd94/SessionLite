// Initializes the `authUser` service on path `/auth-user`
const { AuthUser } = require('./auth-user.class');
const hooks = require('./auth-user.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/auth-user', new AuthUser(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('auth-user');

  service.hooks(hooks);
};
