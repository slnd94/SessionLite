// Initializes the `tenantDetails` service on path `/tenant-details`
const { TenantDetails } = require('./tenant-details.class');
const hooks = require('./tenant-details.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/tenant-details', new TenantDetails(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('tenant-details');

  service.hooks(hooks);
};
