const users = require('./users/users.service.js');
const authUser = require('./auth-user/auth-user.service.js');
const userProfile = require('./user-profile/user-profile.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(users);
  app.configure(authUser);
  app.configure(userProfile);
};
