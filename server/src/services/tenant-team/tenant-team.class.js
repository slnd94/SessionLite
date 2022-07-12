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

    const invites = await this.app.service('user-invites').find({
      query: {
        tenant: params.query.tenant,
        $skip: params.query.$skip,
        $limit: params.query.$limit,
        $select: {
          _id: 1,
          email: 1,
          tenant: 1
        }
      }
    });

    return users;
  }

  async patch (id, data, params) {
    if(data.addInviteEmailAddresses) {
      data.addInviteEmailAddresses.forEach(async emailAddress => {
        // check to see if this email has already been used
        const existingInvites = await this.app.service('user-invites').find({
          query: {
            email: emailAddress,
            tenant: id
          }
        });
  
        if(existingInvites.total === 0) {
          const existingUsers = await this.app.service('users').find({
            query: {
              email: emailAddress
            }
          });
    
          if(existingUsers.total === 0) {
            try{
              const invite = await this.app.service('user-invites').create({
                tenant: id,
                type: "team",
                email: emailAddress
              });
            } catch(err) {
              console.log("🚀 ~ file: tenant-team.class.js ~ line 50 ~ TenantTeam ~ patch ~ err", err)
            }
          }
        }
      });

      return { success: true }
    } else if (data.removeInvites) {

    }
  }
};
