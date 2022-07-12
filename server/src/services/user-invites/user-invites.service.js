// Initializes the `userInvites` service on path `/user-invites`
const { UserInvites } = require('./user-invites.class');
const createModel = require('../../models/user-invites.model');
const hooks = require('./user-invites.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
    // whitelist: [ '$populate' ]
  };

  // Initialize our service with any options it requires
  app.use('/user-invites', new UserInvites(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('user-invites');

  service.hooks(hooks);
};
