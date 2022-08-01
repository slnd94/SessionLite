// Initializes the `UserCounts` service on path `/tenant-usage`
const { UserCounts } = require('./tenant-usage.class');
const hooks = require('./tenant-usage.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/tenant-usage', new UserCounts(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('tenant-usage');

  service.hooks(hooks);
};
