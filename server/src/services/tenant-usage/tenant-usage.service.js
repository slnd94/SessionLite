// Initializes the `tenantUsage` service on path `/tenant-usage`
const { TenantUsage } = require('./tenant-usage.class');
const hooks = require('./tenant-usage.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/tenant-usage', new TenantUsage(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('tenant-usage');

  service.hooks(hooks);
};
