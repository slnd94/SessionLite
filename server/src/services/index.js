const users = require('./users/users.service.js');
const authUser = require('./auth-user/auth-user.service.js');
const userProfile = require('./user-profile/user-profile.service.js');
const userAccount = require('./user-account/user-account.service.js');
const emails = require('./emails/emails.service.js');
const userAccountVerification = require('./user-account-verification/user-account-verification.service.js');
const products = require('./products/products.service.js');
const userCarts = require('./user-carts/user-carts.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(users);
  app.configure(authUser);
  app.configure(userProfile);
  app.configure(userAccount);
  app.configure(emails);
  app.configure(userAccountVerification);
  app.configure(products);
  app.configure(userCarts);
};
