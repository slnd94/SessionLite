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
      // limit based on allowed fields and only those supplied
      data = {
        ...(data.name ? {name: data.name} : {}),
        ...(data.logo ? {logo: data.logo} : {})
      };
    }

    return this.app.service('clients')
      .patch(id, data)
      .then(res => {
        return { success: true };
      });
  }
};
