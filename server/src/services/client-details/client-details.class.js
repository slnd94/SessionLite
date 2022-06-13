/* eslint-disable no-unused-vars */
exports.ClientDetails = class ClientDetails {
  constructor (options) {
    this.options = options || {};
  }
  
  setup(app) {
    this.app = app;
  }

  async patch (id, data, params) {
    const { sysAdminUser } = params;

    // if user is not admin, reinforce the only fields we want updated
    if (!sysAdminUser) {
      data = {
        name: data.name
      };
    }

    return this.app.service('clients')
      .patch(id, data)
      .then(res => {
        // return only the client id
        return { _id: res._id };
      });
  }
};
