// Initializes the `userAccount` service on path `/user-account`
const { UserAccount } = require('./user-account.class');
const hooks = require('./user-account.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/user-account', new UserAccount(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('user-account');

  service.hooks(hooks);
};
