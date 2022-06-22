// Initializes the `tenantRegistration` service on path `/tenant-registration`
const { TenantRegistration } = require('./tenant-registration.class');
const hooks = require('./tenant-registration.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/tenant-registration', new TenantRegistration(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('tenant-registration');

  service.hooks(hooks);
};
