/* eslint-disable no-unused-vars */
exports.AuthUser = class AuthUser {
  constructor (options) {
    this.options = options || {};
  }
  
  setup(app) {
    this.app = app;
  }

  async find (params) {
    // get the user client if available
    const client = params.user.client ? await this.app.service('clients').get(params.user.client) : null;
    console.log("🚀 ~ file: auth-user.class.js ~ line 14 ~ AuthUser ~ find ~ client", client)


    client.adminUsers && client.adminUsers.find(x => x._id.toString() === params.user._id.toString())
    // set up the return user obj
    return {
      _id: params.user._id,
      email: params.user.email,
      name: {
        given: params.user.name.given,
        family: params.user.name.family
      },
      isVerified: params.user.verification.emailVerified,
      isLocked: params.user.locked,
      isClientAdmin: client?.adminUsers && client.adminUsers.find(x => x._id.toString() === params.user._id.toString()) ? true : false,
      // client if available:
      ...(client
        ? {client: {
          _id: client._id,
          name: client.name
        }} : {})
    }
  }
};
