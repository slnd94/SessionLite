// Initializes the `tenantTemplates` service on path `/tenant-templates`
const { TenantTemplates } = require('./tenant-templates.class');
const hooks = require('./tenant-templates.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/tenant-templates', new TenantTemplates(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('tenant-templates');

  service.hooks(hooks);
};
