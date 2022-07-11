/* eslint-disable no-unused-vars */
exports.TenantTeamInvites = class TenantTeamInvites {
  constructor (options) {
    this.options = options || {};
  }
  
  setup(app) {
    this.app = app;
  }

  async find (params) {
    const invites = await this.app.service('user-invites').find({
      query: {
        tenant: params.query.tenant,
        type: "team",
        $skip: params.query.$skip,
        $limit: params.query.$limit,
        $select: {
          _id: 1,
          email: 1,
          tenant: 1
        }
      }
    });

    return invites;
  }
};
