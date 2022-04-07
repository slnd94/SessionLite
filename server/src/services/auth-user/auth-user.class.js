/* eslint-disable no-unused-vars */
exports.AuthUser = class AuthUser {
  constructor (options) {
    this.options = options || {};
  }
  
  setup(app) {
    this.app = app;
  }

  async find (params) {
    return this.app.service('users')
      // return the current authorized user
      .get(params.user._id, {})
      .then(result => result);
  }
};
