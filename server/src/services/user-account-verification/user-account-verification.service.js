// Initializes the `userAccountVerification` service on path `/user-account-verification`
const { UserAccountVerification } = require('./user-account-verification.class');
const hooks = require('./user-account-verification.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/user-account-verification', new UserAccountVerification(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('user-account-verification');

  service.hooks(hooks);
};
