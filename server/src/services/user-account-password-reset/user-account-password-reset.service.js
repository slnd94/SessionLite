// Initializes the `userAccountPasswordReset` service on path `/user-account-password-reset`
const { UserAccountPasswordReset } = require('./user-account-password-reset.class');
const hooks = require('./user-account-password-reset.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/user-account-password-reset', new UserAccountPasswordReset(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('user-account-password-reset');

  service.hooks(hooks);
};
