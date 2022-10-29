// Initializes the `userSessions` service on path `/user-sessions`
const { UserSessions } = require('./user-sessions.class');
const hooks = require('./user-sessions.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/user-sessions', new UserSessions(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('user-sessions');

  service.hooks(hooks);
};
