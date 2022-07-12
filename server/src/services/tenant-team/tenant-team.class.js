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
    const users = await this.app.service("users").find({
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
          active: 1,
        },
        $sort: {
          "name.family": 1,
          "name.given": 1,
        },
      },
    });

    return users;
  }

  async patch(id, data, params) {
    if (data.deactivateUser) {
      // check to see the requested user is not the current user
      if(data.deactivateUser.toString() === params.user._id.toString()) {
        return Promise.reject(new errors.BadRequest("You cannot deactivate yourself"));
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
      if(data.activateUser.toString() === params.user._id.toString()) {
        return Promise.reject(new errors.BadRequest("You cannot activate yourself"));
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
