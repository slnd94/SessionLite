/* eslint-disable no-unused-vars */
const { api } = require("../../utils/api");

exports.TenantDetails = class TenantDetails {
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

    if(data.logo) {
      // updating the logo.  Delete the old logo first.
      const tenant = await this.app.service('tenants')
      .get(params.user.tenant, {
        query: {
          $select: [ 'logo' ]
        }
      });

      if (tenant?.logo?.handle) {
        // we need to delete the old logo file at the storage service
        // first get a policy and signature
        const deleteAuth = await this.app.service('file-auth').find({
          query: {
            call: [ "remove" ],
            handle: tenant.logo.handle
          }
        });

        // delete the old logo
        const deleteResponse = await api({
          method: "delete",
          url: `https://www.filestackapi.com/api/file/${tenant.logo.handle}?key=${this.app.get('fileStackApiKey')}&policy=${deleteAuth.policy}&signature=${deleteAuth.signature}`
        });
      }

      if (!data.logo.handle) {
        data.logo = null;
      }
    }

    return this.app.service('tenants')
      .patch(id, data)
      .then(res => {
        return { success: true };
      });
  }
};
