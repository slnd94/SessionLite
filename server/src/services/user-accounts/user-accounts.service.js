// Initializes the `userAccounts` service on path `/user-accounts`
const { UserAccounts } = require('./user-accounts.class');
const hooks = require('./user-accounts.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/user-accounts', new UserAccounts(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('user-accounts');

  service.hooks(hooks);
};
