// Initializes the `tenantUserInvites` service on path `/tenant-user-invites`
const { TenantTeamInvites } = require('./tenant-user-invites.class');
const hooks = require('./tenant-user-invites.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/tenant-user-invites', new TenantTeamInvites(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('tenant-user-invites');

  service.hooks(hooks);
};
