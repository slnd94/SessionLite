// Initializes the `tenantTeamInvites` service on path `/tenant-team-invites`
const { TenantTeamInvites } = require('./tenant-team-invites.class');
const hooks = require('./tenant-team-invites.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/tenant-team-invites', new TenantTeamInvites(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('tenant-team-invites');

  service.hooks(hooks);
};
