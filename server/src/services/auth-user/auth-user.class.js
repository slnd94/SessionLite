/* eslint-disable no-unused-vars */
exports.AuthUser = class AuthUser {
  constructor (options) {
    this.options = options || {};
  }
  
  setup(app) {
    this.app = app;
  }

  async find (params) {
    return {
      _id: params.user._id,
      email: params.user.email,
      name: {
        given: params.user.name.given,
        family: params.user.name.family
      },
      isVerified: params.user.verification.emailVerified,
      isLocked: params.user.locked
    }
  }
};
