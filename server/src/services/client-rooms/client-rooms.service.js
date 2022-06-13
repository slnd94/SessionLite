// Initializes the `clientRooms` service on path `/client-rooms`
const { ClientRooms } = require('./client-rooms.class');
const hooks = require('./client-rooms.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/client-rooms', new ClientRooms(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('client-rooms');

  service.hooks(hooks);
};
