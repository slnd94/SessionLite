const users = require('./users/users.service.js');
const authUser = require('./auth-user/auth-user.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(users);
  app.configure(authUser);
};
