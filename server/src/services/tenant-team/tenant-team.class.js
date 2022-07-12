/* eslint-disable no-unused-vars */
exports.TenantTeam = class TenantTeam {
  constructor (options) {
    this.options = options || {};
  }
  
  setup(app) {
    this.app = app;
  }

  async find (params) {
    const users = await this.app.service('users').find({      
      query: {
        tenant: params.query.tenant,
        type: "team",
        $skip: params.query.$skip,
        $limit: params.query.$limit,
        $select: {
          _id: 1,
          email: 1,
          name: 1,
          tenant: 1,
          active: 1
        },
        $sort: {
          "name.family": 1,
          "name.given": 1
        }
      }
    });

    return users;
  }
};
