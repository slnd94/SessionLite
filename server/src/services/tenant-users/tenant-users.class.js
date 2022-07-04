/* eslint-disable no-unused-vars */
exports.TenantUsers = class TenantUsers {
  constructor (options) {
    this.options = options || {};
  }
  
  setup(app) {
    this.app = app;
  }

  async find (params) {
    return await this.app.service('users').find({
      query: {
        tenant: params.query.tenant,
        $skip: params.query.$skip,
        $limit: params.query.$limit
      }
    });
  }
};
