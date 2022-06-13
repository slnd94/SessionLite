/* eslint-disable no-unused-vars */
exports.UserProfile = class UserProfile {
  constructor (options) {
    this.options = options || {};
  }
  
  setup(app) {
    this.app = app;
  }

  async get (id, params) {
    return this.app.service('users')
      .get(id === "me" ? params.user._id : id)
      .then(res => {
        return {
          _id: res._id,
          email: res.email,
          name: {
            given: res.name.given,
            family: res.name.family
          }
        }
      });
  }

  async patch (id, data, params) {
    const { sysAdminUser } = params;

    // if user is not admin, reinforce the only fields we want updated
    if (!sysAdminUser) {
      data = {
        name: data.name
      };
    }

    return this.app.service('users')
      .patch(id, data)
      .then(res => {
        // return only the user id
        return { _id: res._id };
      });
  }
};
