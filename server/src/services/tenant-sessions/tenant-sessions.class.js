/* eslint-disable no-unused-vars */
exports.TenantSessions = class TenantSessions {
  constructor (options) {
    this.options = options || {};
  }
  
  setup(app) {
    this.app = app;
  }

  async find (params) {    
    return await this.app.service('sessions').find({
      query: {
        tenant: params.query.tenant,
        $skip: params.query.$skip,
        $limit: params.query.$limit
      }
    });
  }
};
