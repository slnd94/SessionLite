// Initializes the `tenantSessions` service on path `/tenant-sessions`
const { TenantSessions } = require('./tenant-sessions.class');
const hooks = require('./tenant-sessions.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/tenant-sessions', new TenantSessions(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('tenant-sessions');

  service.hooks(hooks);
};
