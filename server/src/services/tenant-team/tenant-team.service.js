// Initializes the `tenantUsers` service on path `/tenant-team`
const { TenantTeam } = require('./tenant-team.class');
const hooks = require('./tenant-team.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/tenant-team', new TenantTeam(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('tenant-team');

  service.hooks(hooks);
};
