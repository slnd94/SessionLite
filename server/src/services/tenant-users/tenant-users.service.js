// Initializes the `tenantUsers` service on path `/tenant-users`
const { TenantUsers } = require('./tenant-users.class');
const hooks = require('./tenant-users.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/tenant-users', new TenantUsers(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('tenant-users');

  service.hooks(hooks);
};
