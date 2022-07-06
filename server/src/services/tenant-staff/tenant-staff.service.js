// Initializes the `tenantUsers` service on path `/tenant-staff`
const { TenantStaff } = require('./tenant-staff.class');
const hooks = require('./tenant-staff.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/tenant-staff', new TenantStaff(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('tenant-staff');

  service.hooks(hooks);
};
