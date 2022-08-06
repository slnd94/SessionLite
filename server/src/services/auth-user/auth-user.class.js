/* eslint-disable no-unused-vars */
exports.AuthUser = class AuthUser {
  constructor(options) {
    this.options = options || {};
  }

  setup(app) {
    this.app = app;
  }

  async find(params) {
    // get the user tenant if available
    const tenant = params.user.tenant
      ? await this.app.service("tenants").get(params.user.tenant)
      : null;
    const tenantAdmin =
      tenant?.adminUsers &&
      tenant.adminUsers.find(
        (x) => x._id.toString() === params.user._id.toString()
      )
        ? true
        : false;

    // set up the return user obj
    return {
      _id: params.user._id,
      email: params.user.email,
      name: {
        given: params.user.name.given,
        family: params.user.name.family,
      },
      verified: params.user.verification.emailVerified,
      locked: params.user.locked,
      active: params.user.active,
      tenantAdmin,
      // tenant if available:
      ...(tenant
        ? {
            tenant: {
              _id: tenant._id,
              name: tenant.name,
              logo: tenant.logo,
              ...(tenantAdmin
                ? {
                    tentativePlan: tenant.tentativePlan,
                    plan: tenant.plan,
                    paddle: tenant.paddle,
                  }
                : {}),
            },
          }
        : {}),
    };
  }
};
