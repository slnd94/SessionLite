// Initializes the `fileAuth` service on path `/file-auth`
const { FileAuth } = require('./file-auth.class');
const hooks = require('./file-auth.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/file-auth', new FileAuth(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('file-auth');

  service.hooks(hooks);
};
