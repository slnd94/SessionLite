// Initializes the `tenantRooms` service on path `/tenant-rooms`
const { TenantRooms } = require('./tenant-rooms.class');
const hooks = require('./tenant-rooms.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/tenant-rooms', new TenantRooms(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('tenant-rooms');

  service.hooks(hooks);
};
