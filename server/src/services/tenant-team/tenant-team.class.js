/* eslint-disable no-unused-vars */
exports.TenantTeam = class TenantTeam {
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

  async patch (id, data, params) {
    const { sysAdminUser } = params;

    if(data.addInviteEmailAddresses) {
      // console.log("🚀 ~ file: tenant-team.class.js ~ line 25 ~ TenantTeam ~ patch ~ data.addInvites", data.addInviteEmailAddresses)
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
