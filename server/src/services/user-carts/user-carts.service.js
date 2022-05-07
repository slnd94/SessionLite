// Initializes the `userCarts` service on path `/user-carts`
const { UserCarts } = require('./user-carts.class');
const hooks = require('./user-carts.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/user-carts', new UserCarts(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('user-carts');

  service.hooks(hooks);
};
