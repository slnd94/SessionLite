// Initializes the `tenantPlans` service on path `/tenant-plans`
const { TenantPlans } = require('./tenant-plans.class');
const hooks = require('./tenant-plans.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/tenant-plans', new TenantPlans(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('tenant-plans');

  service.hooks(hooks);
};
