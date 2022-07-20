/* eslint-disable no-unused-vars */
const errors = require("@feathersjs/errors");
exports.TenantTeam = class TenantTeam {
  constructor(options) {
    this.options = options || {};
  }

  setup(app) {
    this.app = app;
  }

  async find(params) {
    // assign the search term on name if provided
    const nameSearchQuery = params.query.search
      ? {
          $or: [
            { "name.family": { $regex: new RegExp(params.query.search, "i") } },
            { "name.given": { $regex: new RegExp(params.query.search, "i") } },
            { "email": { $regex: new RegExp(params.query.search, "i") } }
          ],
        }
      : {};
    delete params.query.search;

    // enforce only the fields we want to be able to query on
    params.query = {
      tenant: params.query.tenant,
      $skip: params.query.$skip,
      $limit: params.query.$limit,
      ...(params.query.active ? { active: params.query.active } : {}),
      ...(params.query.type ? { type: params.query.type } : {})
    }
    
    const users = await this.app.service("users").find({
      query: {
        ...nameSearchQuery,
        ...params.query,
        $select: {
          _id: 1,
          email: 1,
          name: 1,
          tenant: 1,
          active: 1,
        },
        $sort: {
          "name.family": 1,
          "name.given": 1,
        },
      },
    });

    // add on the tenantAdmin field
    const tenant = await this.app.service("tenants").get(params.query.tenant);
    users.data = users.data.map((user) => ({
      ...user,
      tenantAdmin:
        tenant?.adminUsers &&
        tenant.adminUsers.find((x) => x._id.toString() === user._id.toString())
          ? true
          : false,
    }));

    return users;
  }

  async patch(id, data, params) {
    if (data.updateUser) {
      // check to see if the requested user is the current user
      if (data.updateUser.toString() === params.user._id.toString()) {
        return Promise.reject(
          new errors.BadRequest("You cannot modify yourself")
        );
      }
      // check that the requested user is in the user's tenant
      const user = await this.app.service("users").get(data.updateUser, {
        query: {
          $select: {
            _id: 1,
            tenant: 1,
          },
        },
      });

      if (user?.tenant.toString() === id.toString()) {
        // enforce only the fields that should be able to update here
        const updateData = {
          ...(Object.hasOwn(data, "active") ? { active: data.active } : {}),
        };
        // update the user
        await this.app.service("users").patch(data.updateUser, updateData);

        // update tenant admin users as needed
        const tenant = await this.app.service("tenants").get(id);
        if (
          tenant?.adminUsers &&
          tenant.adminUsers.find(
            (x) => x._id.toString() === user._id.toString()
          )
        ) {
          if (data.tenantAdmin === false) {
            // remove tenant admin access for the user
            const updatedAdminUsers = tenant.adminUsers.filter(
              (item) => item.toString() !== data.updateUser.toString()
            );
            await this.app
              .service("tenants")
              .patch(id, { adminUsers: updatedAdminUsers });
          }
        }
        if (
          tenant?.adminUsers &&
          !tenant.adminUsers.find(
            (x) => x._id.toString() === user._id.toString()
          )
        ) {
          if (data.tenantAdmin) {
            // add tenant admin access for the user
            await this.app
              .service("tenants")
              .patch(id, {
                adminUsers: [...tenant.adminUsers, data.updateUser],
              });
          }
        }

        return { success: true };
      } else {
        return Promise.reject(new errors.BadRequest("invalid user"));
      }
    } else if (data.deactivateUser) {
      // check to see the requested user is not the current user
      if (data.deactivateUser.toString() === params.user._id.toString()) {
        return Promise.reject(
          new errors.BadRequest("You cannot modify your own permissions")
        );
      }
      // check that the requested user is in the user's tenant
      const user = await this.app.service("users").get(data.deactivateUser, {
        query: {
          $select: {
            _id: 1,
            tenant: 1,
          },
        },
      });

      if (user?.tenant.toString() === id.toString()) {
        // deactivate the user
        return this.app
          .service("users")
          .patch(data.deactivateUser, { active: false })
          .then((res) => {
            return { success: true };
          });
      } else {
        return Promise.reject(new errors.BadRequest("invalid user"));
      }
    } else if (data.activateUser) {
      // check to see the requested user is not the current user
      if (data.activateUser.toString() === params.user._id.toString()) {
        return Promise.reject(
          new errors.BadRequest("You cannot activate yourself")
        );
      }
      // check that the requested user is in the user's tenant
      const user = await this.app.service("users").get(data.activateUser, {
        query: {
          $select: {
            _id: 1,
            tenant: 1,
          },
        },
      });

      if (user?.tenant.toString() === id.toString()) {
        //TODO: Check plan allowances here to see if the user can be activated
        // deactivate the user
        return this.app
          .service("users")
          .patch(data.activateUser, { active: true })
          .then((res) => {
            return { success: true };
          });
      } else {
        return Promise.reject(new errors.BadRequest("invalid user"));
      }
    }
  }
};
